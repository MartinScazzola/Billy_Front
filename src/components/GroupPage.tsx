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
import Navigation from './Navigation';
import { dbUrl } from "../DBUrl";
import ExpenseCard from './ExpenseCard';

export type Expense = {
  id: number;
  name: string;
  amount: number;
  currency: string;
  memberWhoPaid: number;
  memberWhoPaidName: string;
  members: number[];
};

type Member = {
  id_user: number; 
  name: string;
  debts: { [key: string]: number };
};

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
  const { groupid } = useParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [debts, setDebts] = useState<Debts[]>([]);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseName, setExpenseName] = useState('');
  const [amount, setAmount] = useState(0);
  const [memberWhoPaid, setMemberWhoPaid] = useState(0);
  const [membersWhoParticipated, setMembersWhoParticipated] = useState<string[]>([]);

  const toggleMember = (memberName: string) => {
    if (membersWhoParticipated.includes(memberName)) {
      setMembersWhoParticipated(membersWhoParticipated.filter((name) => name !== memberName));
    } else {
      setMembersWhoParticipated([...membersWhoParticipated, memberName]);
    }
  };

  const [newUser, setNewUser] = useState(0);

  const [groupMembers, setGroupMembers] = useState<Member[]>([]);
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

  const handleMemberNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setMemberName(e.target.value);
  // e.target.value ID de group

  const [errorExpense, setErrorExpense] = useState('');
  const [currency, setCurrency] = React.useState('ARG');

  const handleExpenseNameChange = (e: { target: { value: React.SetStateAction<string>; }; }) => setExpenseName(e.target.value);
  const handleAmountChange = (e: { target: { value: any; }; }) => setAmount(Number(e.target.value));


  const updateDebts = (expenses: Expense[]) => {
    console.log("expenses", expenses)
    const debts = groupUsers.map(user => ({ id_user: user.id_user, amount: 0 }));
    console.log('antes del for:', debts);
    expenses.forEach(expense => {
      const amountPerMember = expense.amount / expense.members.length;
      console.log("members", expense.members)
      expense.members.forEach(id => {
        console.log("id", id)
        if (id == expense.memberWhoPaid) {
          debts.find(debt => debt.id_user === id)!.amount -= amountPerMember * (expense.members.length - 1);
        } else {
          debts.find(debt => debt.id_user === id)!.amount += amountPerMember;
        }
      });
    })
    setDebts(debts);
    console.log('Debts despues del for:', debts);
  }

  const handleAddExpense = () => {
    if (expenseName.trim() === '') {
      setErrorExpense('El nombre del gasto es requerido');
      return;
    }

    if (memberWhoPaid === 0) {
      setErrorExpense('El miembro que pagó el gasto es requerido');
      return;
    }

    if (amount === 0) {
      setErrorExpense('El monto del gasto es requerido y tiene que ser mayor a 0');
      return;
    }

    const newExpense = {
      id: 0, 
      name: expenseName,
      amount: amount,
      currency: currency,
      memberWhoPaid: memberWhoPaid,
      memberWhoPaidName: groupUsers.find(member => member.id_user === memberWhoPaid)?.name ?? '',
      members: groupUsers.map(member => member.id_user),
    };

    setExpenses([...expenses, newExpense]);
    updateDebts(expenses);

    console.log('expenses:', expenses);

    const expense_post = {
      id_expense: null,
      id_group: groupid,
      id_user: memberWhoPaid,
      name: expenseName,
      amount: amount,
      currency: currency,
      participants: groupUsers.map(member => member.id_user),
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
      })
      .catch(error => console.error('Error fetching user list:', error));

    setExpenseName('');
    setAmount(0);
    setCurrency('ARG');
    setMemberWhoPaid(groupUsers[0].id_user);
    setErrorExpense('');
  };

  const handleDeleteExpense = (id: number) => {
    console.log('handleDeleteExpense - ',id);
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

  const handleAddGroupMember = () => {
    console.log('handleAddGroupMember',newUser);
    if (newUser == 0) {
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
      }
    })
      .then(response => response.json())
      .then(data => {
        window.location.reload();
        console.log("User added to group:", data);
      })
      .catch(error => console.error('Error fetching user list:', error));

    const newMember = {
      id_user: newUser,
      name: memberName,
      debts: { 'ARG': 0, 'USD': 0 },
    };
    setGroupMembers([...groupMembers, newMember]);
    setMemberName('');
    setErrorMemberName('');
    setIsModalOpen(false);
  }

  const handleDeleteGroupMember = (id_user: number) => {
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
          }
        })
        setExpenses(maped);
      })
      .catch(error => console.error('Error fetching expenses list:', error));

      updateDebts(expenses)
  },[groupid, groupUsers.length, expenses.length]);

  if(debts == undefined){
    return (<div className="container text-center">
        <div className="row align-items-center">
            <div className="col my-4">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    </div>)
  }
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ p: 4 }}>
        
        {/* NAVIGATION */}

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
                      sx={{ mr: -1.5, '&:hover': { bgcolor: '#DDDDDD' }, width: 300 , zIndex: 20000}}
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

        <Box sx={{ p: 4 }}>
          <Typography level="title-lg" textColor="text.secondary" component="h1">
            {`${group.name}`}
          </Typography>
        </Box>
        {drawerOpen && (
          <Layout.SideDrawer onClose={() => setDrawerOpen(false)}>
            <Navigation groupMembers={groupMembers} groupUsers={groupUsers} handleOpenModal={handleOpenModal} handleDeleteGroupMember={handleDeleteGroupMember} errorMemberName={errorMemberName} debts={debts}/>
          </Layout.SideDrawer>
        )}
        <Layout.Root
          sx={{
            ...(drawerOpen && {
              height: '100vh',
              overflow: 'hidden',
            }),
          }}
        >
          <Layout.SideNav>
            <Navigation groupMembers={groupMembers} groupUsers={groupUsers} handleOpenModal={handleOpenModal} handleDeleteGroupMember={handleDeleteGroupMember} errorMemberName={errorMemberName} debts={debts}/>
          </Layout.SideNav>

          <Layout.Main>
            <List
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 2,
              }}
            >
              {expenses.map((expense, index) => (
                <ExpenseCard expense={expense} index={index} delete2={handleDeleteExpense} />
              ))}
            </List>
          </Layout.Main>
          <Layout.SidePane>
            <Box
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography level="title-lg" textColor="text.secondary" component="h1">
                Gastos
              </Typography>
              <Button onClick={handleAddExpense} size="sm">
                Agregar nuevo gasto
              </Button>
            </Box>
            <List
              size="sm"
              sx={{ '--ListItem-radius': 'var(--joy-radius-sm)', '--List-gap': '4px' }}
            >
              <ListItem nested sx={{ display: 'flex' }}>
                <ListSubheader sx={{ letterSpacing: '2px', fontWeight: '800' }}>
                  {errorExpense && <p style={{ color: 'red' }}>{errorExpense}</p>}
                </ListSubheader>
              </ListItem>
            </List>
            <Box sx={{ p: 2 }}>
              <Stack spacing={1.5}>
                <Input
                  type="text"
                  placeholder="Nombre del gasto"
                  value={expenseName}
                  onChange={handleExpenseNameChange}
                  sx={{ width: 300 }}

                />
              </Stack>
              <Stack spacing={1.5}>
                <Input
                  type="number"
                  placeholder="Monto"
                  value={amount}
                  onChange={handleAmountChange}
                  startDecorator={{ USD: '$', ARG: '$' }[currency]}
                  endDecorator={
                    <React.Fragment>
                      <Divider orientation="vertical" />
                      <Select
                        variant="plain"
                        value={currency}
                        onChange={(_, value) => setCurrency(value!)}
                        slotProps={{
                          listbox: {
                            variant: 'outlined',
                          },
                        }}
                        sx={{ mr: -1.5, '&:hover': { bgcolor: 'transparent' } }}
                      >
                        <Option value="ARG">ARG</Option>
                        <Option value="USD">USD</Option>
                      </Select>
                    </React.Fragment>
                  }
                  sx={{ width: 300 }}
                />
              </Stack>
              <div className='bg-blue-300 inline'>
                <Stack spacing={1.5}>
                  <Select
                    placeholder="Miembro que lo pagó"
                    variant="plain"
                    value={memberWhoPaid}
                    onChange={(_, value) => setMemberWhoPaid(value!)}
                    slotProps={{
                      listbox: {
                        variant: 'outlined',
                      },
                    }}
                    sx={{ mr: -1.5, '&:hover': { bgcolor: 'transparent' }, width: 300, border: '1px solid #bdbdbd' }}
                  >
                    {groupUsers.map((member, key) => (
                      <Option key={key} value={member.id_user}>{member.name}</Option>
                    ))}
                  </Select>
                </Stack>
              </div>
            </Box>
          </Layout.SidePane>
        </Layout.Root>
      </Box>
    </CssVarsProvider>
  );
}

export default GroupPage;


