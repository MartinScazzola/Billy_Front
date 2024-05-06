import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CssVarsProvider, CssBaseline, Typography, Button, Box } from '@mui/joy';
import '../style_components/Home.css';

import List from '@mui/joy/List';
import ListSubheader from '@mui/joy/ListSubheader';
import ListItem from '@mui/joy/ListItem';
import Stack from '@mui/joy/Stack';
import Sheet from '@mui/joy/Sheet';

import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import Divider from '@mui/joy/Divider';
import Input from '@mui/joy/Input';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';

import Layout from './Layout';
import Navigation from './Navigation';
import { set } from 'firebase/database';

const GroupPage = () => {
  const { groupName } = useParams(); 
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState('');
  const [amount, setAmount] = useState(0);

  const [groupMembers, setGroupMembers] = useState([{name: 'iñaki', debts: {'ARG': 0, 'USD': 0}}]);
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

  const [errorExpense, setErrorExpense] = useState('');
  const [currency, setCurrency] = React.useState('ARG');

  const handleExpenseNameChange = (e) => setExpenseName(e.target.value);
  const handleAmountChange = (e) => setAmount(Number(e.target.value));

  const handleAddExpense = () => {
    if (expenseName.trim() === '') {
      setErrorExpense('El nombre del gasto es requerido');
      return;
    }

    if (amount === 0) {
      setErrorExpense('El monto del gasto tiene que ser mayor a 0');
      return;
    }

    const newExpense = {
      name: expenseName,
      amount: amount,
      currency: currency,
    };
    setExpenses([...expenses, newExpense]);
    setExpenseName('');
    setAmount(0);
    setCurrency('ARG');
    setErrorExpense('');
  };

  const handleAddGroupMember = () => {
    if (memberName.trim() === '') {
      setErrorMemberName('El nombre del miembro es requerido');
      return;
    }
    const newMember = {
      name: memberName,
      debts: {'ARG': 0, 'USD': 0},
    };
    setGroupMembers([...groupMembers, newMember]);
    setMemberName('');
    setErrorMemberName('');
    setIsModalOpen(false);
  }

  const handleDeleteGroupMember = (name: string) => {
    setGroupMembers(groupMembers.filter(member => member.name !== name));
  }

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ p: 4 }}>
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
              <input
                type="text"
                placeholder="Nombre del nuevo miembro"
                value={memberName}
                onChange={handleMemberNameChange}
                className="input"
                style={{
                  display: 'block',
                  width: '100%',
                  marginBottom: '16px',
                  padding: '8px',
                  fontSize: '16px',
                  border: '1px solid #bdbdbd',
                  borderRadius: '16px',
                  backgroundColor: '#333',
                  color: 'white'
                }}
              />
              <List>
                <ListItem nested sx={{ display: 'flex'}}>
                  <ListSubheader sx={{ fontWeight: '800'}}>
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
            {`${groupName}`}
          </Typography>
        </Box>
        {drawerOpen && (
          <Layout.SideDrawer onClose={() => setDrawerOpen(false)}>
            <Navigation groupMembers={groupMembers} handleOpenModal={handleOpenModal} handleDeleteGroupMember={handleDeleteGroupMember} errorMemberName={errorMemberName}/>
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
            <Navigation groupMembers={groupMembers} handleOpenModal={handleOpenModal} handleDeleteGroupMember={handleDeleteGroupMember} errorMemberName={errorMemberName}/>
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
                <Sheet
                  key={index}
                  component="li"
                  variant="outlined"
                  sx={{
                    borderRadius: 'sm',
                    p: 2,
                    listStyle: 'none',
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <div>
                      <Typography level="title-md">{expense.name}</Typography>
                      <Typography level="body-xs">{`${expense.amount} ${expense.currency}`}</Typography>
                    </div>
                  </Box>
                  <Button
                    size="sm"
                    variant="plain"
                    endDecorator={<KeyboardArrowRightRoundedIcon fontSize="small" />}
                    sx={{ px: 1, mt: 1 }}
                  >
                    Expandir
                  </Button>
                </Sheet>
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
              <ListItem nested sx={{ display: 'flex'}}>
                <ListSubheader sx={{ letterSpacing: '2px', fontWeight: '800'}}>
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
                  startDecorator={{ USD: '$', ARG: '$'}[currency]}
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
            </Box>
          </Layout.SidePane>
        </Layout.Root>
      </Box>
    </CssVarsProvider>
  );
}

export default GroupPage;


