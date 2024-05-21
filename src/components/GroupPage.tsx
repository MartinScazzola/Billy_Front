import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CssVarsProvider, CssBaseline, Typography, Button, Box } from '@mui/joy';
import '../style_components/Home.css';

import List from '@mui/joy/List';
import ListSubheader from '@mui/joy/ListSubheader';
import ListItem from '@mui/joy/ListItem';
import Stack from '@mui/joy/Stack';

import Divider from '@mui/joy/Divider';
import Input from '@mui/joy/Input';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';

import Layout from './Layout';
import { dbUrl } from "../DBUrl";
import ExpenseCard from './ExpenseCard';
import Navigation from './Navigation';
import ExpenseTable from './ExpenseTable';
import { getAuth } from 'firebase/auth';
import appFirebase from '../credentials';
import NavigationLeft from './NavigationLeft';
import NewExpenseModal from './NewExpenseModal';
import { set } from 'firebase/database';

export type Expense = {
  id: number;
  name: string;
  amount: number;
  currency: string;
  memberWhoPaid: number;
  memberWhoPaidName: string;
  members: number[];
  liquidated: boolean;
};

// type Member = {
//   id_user: number;
//   name: string;
//   debts: { [key: string]: number };
// };

type Debts = {
  id_user: number;
  amount: number;
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
  const auth = getAuth(appFirebase);
  const user = auth.currentUser;
  const { groupid } = useParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [debts, setDebts] = useState<Debts[]>([]);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseName, setExpenseName] = useState('');
  const [amount, setAmount] = useState(0);
  const [memberWhoPaid, setMemberWhoPaid] = useState(0);
  const [expenseModal, setExpenseModal] = useState(false);

  const [newUser, setNewUser] = useState(0);

  const [groupUsers, setGroupUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState<User[]>([]);

  const [group, setGroup] = useState<Group>({ id_group: 0, name: 'USD' }); // or const [group, setGroup] = useState<Group | (() => Group)>({});
  const [memberName, setMemberName] = useState('');
  const [errorMemberName, setErrorMemberName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setErrorMemberName('');
    setMemberName('');
  }

  const [errorExpense, setErrorExpense] = useState('');
  const [currency, setCurrency] = React.useState('ARG');

  const handleExpenseNameChange = (e: { target: { value: React.SetStateAction<string>; }; }) => setExpenseName(e.target.value);
  const handleAmountChange = (e: { target: { value: any; }; }) => setAmount(Number(e.target.value));

  const closeExpenseModal = () => {
    setExpenseModal(false);
  };
  const newExpenseModal = () => {
    setExpenseModal(true);
  };
  
  //Para el new expense modal
  const handleAddExpenseToState = (newExpense: any) => {
    setExpenses([...expenses, newExpense]);
    updateDebts([...expenses, newExpense]);
  };


  const updateDebts = (expenses: Expense[]) => {
    console.log("expenses", expenses)
    const debts = groupUsers.map(user => ({ id_user: user.id_user, amount: 0 }));
    console.log('antes del for:', debts);
    expenses.forEach(expense => {
      if (expense.liquidated) {
        return;
      }
      const amountPerMember = expense.amount / expense.members.length;
      console.log("members", expense.members)
      expense.members.forEach(id => {
        console.log("id", id)
        const memberDebt = debts.find(debt => debt.id_user === id);
        if (id == expense.memberWhoPaid) {
          if (memberDebt != undefined ){
            memberDebt.amount -= amountPerMember * (expense.members.length - 1);
          }
        } else {
          if(memberDebt != undefined){
            memberDebt.amount += amountPerMember;
          }
        }
      });
    })
    setDebts(debts);
    console.log('Debts despues del for:', debts);
  }

  const handleAddExpense = (newExpense: Expense) => {

    console.log('expenses:', expenses);

    const expense_post = {
      id_expense: null,
      id_group: groupid,
      id_user: newExpense.memberWhoPaid,
      name: newExpense.name,
      amount: newExpense.amount,
      currency: newExpense.currency,
      participants: newExpense.members,
      liquidated: false
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
      .then(data => {
        console.log("User added to group:", data);
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
    console.log('handleDeleteExpense - ', id);
    const api = new URL(`${dbUrl}/expenses/${id}`);

    fetch(api, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.status === 204) {
          console.log(`Expense ${id} removed from group ${groupid}`);
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
      id_group: parseInt(groupid),
      id_user: expense.memberWhoPaid,
      name: expense.name,
      amount: expense.amount,
      currency: expense.currency,
      participants: expense.members,
      liquidated: true
    }

    console.log('expense_put:', expense_put);

    fetch(api, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expense_put)
    })
      .then(response => {
        if (response.status === 200) {
          console.log(`Expense ${expense.id} liquidated in group ${groupid}`);
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
    console.log('handleAddGroupMember', newUser);
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
      console.log("User added to group:", data);
      const newUserObject = totalUsers.find(user => user.id_user === newUser);
      
      if (newUserObject) {
        setGroupUsers([...groupUsers, { ...newUserObject}]);
        setDebts([...debts, {id_user: newUserObject.id_user ,amount: 0}])
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
          console.log(`User ${id_user} removed from group ${groupid}`);
          // Optionally update the state or perform other actions here
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

    console.log('useEffect');
    fetch(`${dbUrl}/groups/${groupid}/users`)
      .then(response => response.json())
      .then(data => {
        console.log("User list:", data);
        setGroupUsers(data);
      })
      .catch(error => console.error('Error fetching group:', error));


    fetch(`${dbUrl}/groups/${groupid}`)
      .then(response => response.json())
      .then(data => {
        console.log("User list:", data);
        setGroup(data);
      })
      .catch(error => console.error('Error fetching groups list:', error));

    fetch(`${dbUrl}/users`)
      .then(response => response.json())
      .then(data => {
        console.log("Total users list:", data);
        setTotalUsers(data);
      })
      .catch(error => console.error('Error fetching user list:', error));

    fetch(`${dbUrl}/expenses`)
      .then(response => response.json())
      .then(data => {
        console.log("Total expenses list:", data);
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
            liquidated: expense.liquidated
          }
        })
        setExpenses(maped);
      })
      .catch(error => console.error('Error fetching expenses list:', error));

    updateDebts(expenses)
  }, [groupid, groupUsers.length, expenses.length]);


  return (
    <main className='mt-10 mx-5'>
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
                <Typography level="h3" sx={{ mb: 1, color: 'white' }}>Nuevo miembro</Typography>
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
                    Cancelar
                  </Button>
                  <Button onClick={handleAddGroupMember} sx={{ color: 'white' }}>
                    Agregar
                  </Button>
                </Box>
              </Box>
            </Box>
          </React.Fragment>
        )}
      </div>
      <div className='grid grid-cols-12'>
        <div className='col-span-2'>
          <NavigationLeft groupUsers={groupUsers} user={user} debts={debts} modal={setIsModalOpen} handleDeleteGroupUser={handleDeleteGroupUser}/>
        </div>
        <div className='col-span-10 py-0 flex flex-col justify-center items-center'>
          <div className='w-full h-16 bg-white p-0 flex items-center px-10 font-semibold rounded-xl justify-between'>
            <p className='text-xl'>Gastos</p>
            <button className='bg-blue-400 p-2 rounded-xl text-white hover:bg-blue-600 transition duration-300' onClick={() => setExpenseModal(true)}>Añadir Gasto</button>
          </div>
          <ExpenseTable items={expenses} deleteFunction={handleDeleteExpense} liquidatedFunction={handleLiquidateExpense}/>
        </div>
      </div>
      {expenseModal === true && (
      <NewExpenseModal cancelFunction={closeExpenseModal} groupUsers={groupUsers} expenses = {expenses} setExpenses={setExpenses} addFunction={handleAddExpense}/>
)}

    </main>
  );
}

export default GroupPage;


