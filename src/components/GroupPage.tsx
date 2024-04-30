import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CssVarsProvider, CssBaseline, Typography, Button, Box } from '@mui/joy';
import '../style_components/Home.css';

import List from '@mui/joy/List';
import Stack from '@mui/joy/Stack';
import Sheet from '@mui/joy/Sheet';

import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import Divider from '@mui/joy/Divider';
import Input from '@mui/joy/Input';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';

import Layout from './Layout';
import Navigation from './Navigation';

const GroupPage = () => {
  const { groupName } = useParams(); 
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState('');
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState('');
  const [currency, setCurrency] = React.useState('ARG');

  const handleExpenseNameChange = (e) => setExpenseName(e.target.value);
  const handleAmountChange = (e) => setAmount(Number(e.target.value));

  const handleAddExpense = () => {
    if (expenseName.trim() === '') {
      setError('El nombre del gasto es requerido');
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
    setError('');
  };

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ p: 4 }}>
        <Typography level="title-lg" textColor="text.secondary" component="h1">
          {`${groupName}`}
        </Typography>
      </Box>
      {drawerOpen && (
        <Layout.SideDrawer onClose={() => setDrawerOpen(false)}>
          <Navigation />
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
          <Navigation />
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
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </Box>
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
    </CssVarsProvider>
  );
}

export default GroupPage;


