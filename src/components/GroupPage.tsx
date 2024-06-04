import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Button, Box } from '@mui/joy';
import '../style_components/Home.css';

import List from '@mui/joy/List';
import ListSubheader from '@mui/joy/ListSubheader';
import ListItem from '@mui/joy/ListItem';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';


import { dbUrl } from "../DBUrl";
import ExpenseTable from './ExpenseTable';
import { getAuth } from 'firebase/auth';
import appFirebase from '../credentials';
import NavigationLeft from './NavigationLeft';
import NewExpenseModal from './NewExpenseModal';
import { useTranslation } from 'react-i18next';

export type Expense = {
  id: number;
  name: string;
  amount: number;
  currency: string;
  memberWhoPaid: number;
  memberWhoPaidName: string;
  members: number[];
  liquidated: boolean;
  expense_distribution: number[];
  date: string;
  category: string;
};

type Debts = {
  id_user: number;
  amount: number;
  currency: string;
}

type User = {
  id_user: number;
  name: string;
  email: string;
};

type Group = {
  id_group: number;
  name: string;
};


const GroupPage = () => {
  const { t } = useTranslation();
  const auth = getAuth(appFirebase);
  const user = auth.currentUser;
  const { groupid } = useParams();
  const [debts, setDebts] = useState<Debts[]>([]);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [_expenseName, setExpenseName] = useState('');
  const [_amount, setAmount] = useState(0);
  const [_memberWhoPaid, setMemberWhoPaid] = useState(0);
  const [expenseModal, setExpenseModal] = useState(false);


  const [newUser, setNewUser] = useState(0);

  const [groupUsers, setGroupUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState<User[]>([]);

  const [group, setGroup] = useState<Group>({ id_group: 0, name: '' });
  const [_memberName, setMemberName] = useState('');
  const [errorMemberName, setErrorMemberName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setErrorMemberName('');
    setMemberName('');
  }

  const [_errorExpense, setErrorExpense] = useState('');
  const [_currency, setCurrency] = React.useState('ARG');

  const closeExpenseModal = () => {
    setExpenseModal(false);
  };


  const updateDebts = (expenses: Expense[]) => {
    const debts = groupUsers.map(user => {
      return expenses.map((expense) => expense.currency).filter((item: any,
        index: any, arr: any) => arr.indexOf(item) === index).map((currency) => ({ id_user: user.id_user, amount: 0, currency: currency }))
    }
    ).flat();
    expenses.forEach(expense => {
      if (expense.liquidated) {
        return;
      }

      expense.members.forEach((id, index) => {
        const memberDebt = debts.find(debt => debt.id_user === id && debt.currency === expense.currency);
        if (id == expense.memberWhoPaid) {
          if (memberDebt != undefined) {

            memberDebt.amount -= (expense.amount - expense.expense_distribution[index]);
          }
        } else {
          if (memberDebt != undefined) {
            memberDebt.amount += expense.expense_distribution[index];
          }
        }
      });
    })
    setDebts(debts);
  }

  const handleAddExpense = (newExpense: Expense) => {

    const expense_post = {
      id_expense: null,
      id_group: groupid,
      id_user: newExpense.memberWhoPaid,
      name: newExpense.name,
      amount: newExpense.amount,
      currency: newExpense.currency,
      participants: newExpense.members,
      liquidated: false,
      expense_distribution: newExpense.expense_distribution,
      date: newExpense.date,
      category: newExpense.category,
    }

    const data = new URL(`${dbUrl}/expenses`);

    fetch(data, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expense_post)
    })
      .then(response => response.json())
      .then(_data => {
        setExpenses([...expenses, newExpense]);
        updateDebts(expenses);
      })
      .catch(error => console.error('Error fetching user list:', error));

    setExpenseName('');
    setAmount(0);
    setCurrency('ARG');
    setMemberWhoPaid(groupUsers[0].id_user);
    setErrorExpense('');
  };

  const handleDeleteExpense = (id: number) => {
    const api = new URL(`${dbUrl}/expenses/${id}`);

    fetch(api, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.status === 204) {
          //setExpenses(expenses.filter(expense => expense.id !== id))
          //window.location.reload();
        } else {
          console.error('Failed to remove user:', response.status);
        }
      })
      .catch(error => console.error('Error removing user from group:', error));
    setExpenses(expenses.filter(expense => expense.id !== id));
  }

  const handleLiquidateExpense = (expense: Expense) => {
    // put expenses/{id}
    const api = new URL(`${dbUrl}/expenses/${expense.id}`);

    const expense_put = {
      id_expense: expense.id,
      id_group: parseInt(groupid ?? ''),
      id_user: expense.memberWhoPaid,
      name: expense.name,
      amount: expense.amount,
      currency: expense.currency,
      participants: expense.members,
      liquidated: true,
      expense_distribution: expense.expense_distribution,
      category: expense.category,
      date: expense.date
    }
    fetch(api, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expense_put)
    })
      .then(response => {
        if (response.status === 200) {
          setExpenses(expenses.map(exp => {
            if (exp.id === expense.id) {
              exp.liquidated = true;
            }
            return exp;
          }));
          updateDebts(expenses);
        } else {
          console.error('Failed to liquidate expense:', response.status);
        }
      })
      .catch(error => console.error('Error liquidating expense from group:', error));
  }

  const handleAddGroupMember = () => {
    if (newUser === 0) {
      setErrorMemberName('El nombre del miembro es requerido');
      return;
    }

    const data = new URL(`${dbUrl}/groups/${groupid}/users`);
    data.searchParams.append('id_group', groupid ?? '');
    data.searchParams.append('id_user', newUser.toString());

    fetch(data, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        const newUserObject = totalUsers.find(user => user.id_user === newUser);

        if (newUserObject) {
          setGroupUsers([...groupUsers, { ...newUserObject }]);
          setDebts([...debts, { id_user: newUserObject.id_user, amount: 0, currency: 'ARS' }])
        }

        setMemberName('');
        setErrorMemberName('');
        setIsModalOpen(false);
      })
      .catch(error => console.error('Error adding user to group:', error));
  };

  const handleDeleteGroupUser = (id_user: number) => {
    const api = new URL(`${dbUrl}/groups/${groupid}/users`);
    api.searchParams.append('id_group', groupid ?? '');
    api.searchParams.append('id_user', id_user.toString());

    fetch(api, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.status === 204) {

        } else {
          console.error('Failed to remove user:', response.status);
        }
      })
      .catch(error => console.error('Error removing user from group:', error));
    setGroupUsers(groupUsers.filter(member => member.id_user !== id_user));
    // setExpenses(expenses.filter(expense => expense.memberWhoPaid !== id_user).map(expense => {
    //   expense.members = expense.members.filter(member => member !== id_user);
    //   return expense;
    // }));
  }

  useEffect(() => {

    fetch(`${dbUrl}/groups/${groupid}/users`)
      .then(response => response.json())
      .then(data => {
        setGroupUsers(data);
      })
      .catch(error => console.error('Error fetching group:', error));


    fetch(`${dbUrl}/groups/${groupid}`)
      .then(response => response.json())
      .then(data => {
        setGroup(data);
      })
      .catch(error => console.error('Error fetching groups list:', error));

    fetch(`${dbUrl}/users`)
      .then(response => response.json())
      .then(data => {
        setTotalUsers(data);
      })
      .catch(error => console.error('Error fetching user list:', error));

    fetch(`${dbUrl}/expenses`)
      .then(response => response.json())
      .then(data => {
        const filtered = data.filter((expense: any) => expense.id_group == groupid);
        const maped = filtered.map((expense: any) => {
          return {
            id: expense.id_expense,
            name: expense.name,
            amount: expense.amount,
            currency: expense.currency,
            memberWhoPaid: expense.id_user,
            memberWhoPaidName: groupUsers.find((member: any) => member.id_user === expense.id_user)?.name ?? '',
            members: expense.participants,
            liquidated: expense.liquidated,
            expense_distribution: expense.expense_distribution,
            category: expense.category,
            date: expense.date
          }
        })
        setExpenses(maped);
      })
      .catch(error => console.error('Error fetching expenses list:', error));

    updateDebts(expenses)
  }, [groupid, groupUsers.length, expenses.length]);

  if (group.name == '') {
    return <div className="flex flex-col gap-5 justify-center items-center h-[100vh]" role="status">
                <svg aria-hidden="true" className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span>Loading...</span>
            </div>
  }

  return (
    <aside className='mt-10 mx-5'>
      <div className='w-50 ml-64 h-40 bg-gradient-to-b from-blue-200 to-blue-400 flex items-center rounded-2xl shadow-2xl'>
        <h1 className="text-4xl ml-20 font-bold text-gray-800 leading-tight mb-2 border-b-2 border-gray-700 pb-2">
          {group.name}
        </h1>
      </div>
      <div>

        {isModalOpen && (
          <React.Fragment>
            <Box
              sx={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 9999,
              }}
            />
            <Box
              sx={{
                position: 'fixed',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000,
              }}
            >
              <Box
                sx={{
                  bgcolor: 'black',
                  color: 'white',
                  p: 3,
                  pt: 2,
                  borderRadius: '16px',
                  boxShadow: 6,
                  minWidth: '300px',
                  border: '1px solid #bdbdbd',
                }}
              >
                <Typography level="h3" sx={{ mb: 1, color: 'white' }}>{t('Nuevo miembro')}</Typography>
                <Select
                  // Poner un placeholder que se agregar nuevo usuario
                  placeholder="Seleccione nuevo usuario"
                  variant="plain"
                  value={newUser}
                  onChange={(_, value) => setNewUser(value!)}
                  slotProps={{
                    listbox: {
                      variant: 'outlined',
                      sx: {
                        zIndex: 20000,
                      },
                    },
                  }}
                  sx={{ mr: -1.5, '&:hover': { bgcolor: '#DDDDDD' }, width: 300, zIndex: 20000 }}
                >
                  {totalUsers.map((member, key) => (
                    <Option key={key} value={member.id_user}>{member.name}</Option>
                  ))}
                </Select>
                <List>
                  <ListItem nested sx={{ display: 'flex' }}>
                    <ListSubheader sx={{ fontWeight: '800' }}>
                      {errorMemberName && <p style={{ color: 'red' }}>{errorMemberName}</p>}
                    </ListSubheader>
                  </ListItem>
                </List>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1 }}>
                  <Button onClick={handleCloseModal} sx={{ color: 'white' }}>
                    {t('Cancelar')}
                  </Button>
                  <Button onClick={handleAddGroupMember} sx={{ color: 'white' }}>
                    {t('Agregar')}
                  </Button>
                </Box>
              </Box>
            </Box>
          </React.Fragment>
        )}
      </div>
      <div className='grid grid-cols-12'>
        <div className='col-span-1'>
          <NavigationLeft groupUsers={groupUsers} user={user} debts={debts} modal={setIsModalOpen} handleDeleteGroupUser={handleDeleteGroupUser} groupName = {group.name}/>
        </div>
        <div className='col-span-11 py-0 ml-[100px] flex flex-col justify-center items-center'>
          <div className='w-full h-16 bg-white p-0 flex items-center px-10 font-semibold rounded-xl justify-between'>
            <p className='text-xl'>{t('Gastos')}</p>
            <button className='bg-blue-400 p-2 rounded-xl text-white hover:bg-blue-600 transition duration-300' onClick={() => setExpenseModal(true)}>{t('Añadir Gasto')}</button>
          </div>
          <ExpenseTable expenses={expenses} deleteFunction={handleDeleteExpense} liquidatedFunction={handleLiquidateExpense}/>
        </div>
      </div>
      {expenseModal === true && (
        <NewExpenseModal cancelFunction={closeExpenseModal} groupUsers={groupUsers} expenses={expenses} setExpenses={setExpenses} addFunction={handleAddExpense} />
      )}

    </aside>
  );
}

export default GroupPage;


