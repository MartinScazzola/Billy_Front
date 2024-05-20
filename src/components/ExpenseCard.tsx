import React, { useEffect, useState } from 'react';

import Sheet from '@mui/joy/Sheet';
import { CssVarsProvider, CssBaseline, Typography, Button, Box } from '@mui/joy';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import EditIcon from '@mui/icons-material/Edit';

import List from '@mui/joy/List';
import ListSubheader from '@mui/joy/ListSubheader';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemContent from '@mui/joy/ListItemContent';

import DeleteIcon from '@mui/icons-material/Delete';

import { Expense } from './GroupPage';

type ExpenseCardProps = {
    expense: Expense;
    index: number;
    handleDeleteExpense: (id: number) => void;
};

const ExpenseCard: React.FunctionComponent<ExpenseCardProps> = ({ expense, index, handleDeleteExpense }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpandClick = () => {
      setIsExpanded(!isExpanded);
  };

  return (
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
          <List key={expense.id}>
            <ListItem>
              <ListItemContent>
                <Typography level="title-lg">{expense.name}</Typography>
              </ListItemContent>
              <ListItemButton onClick={() => handleDeleteExpense(expense.id)}>
                <ListItemDecorator>
                  <DeleteIcon/>
                </ListItemDecorator>
              </ListItemButton>
            </ListItem>
          </List>
          <Button
              size="sm"
              variant="plain"
              endDecorator={isExpanded ? <KeyboardArrowDownRoundedIcon fontSize="small" /> : <KeyboardArrowRightRoundedIcon fontSize="small" />}
              sx={{ px: 1, mt: 1 }}
              onClick={handleExpandClick}
          >
              {isExpanded ? 'Colapsar' : 'Expandir'}
          </Button>
          {isExpanded && (
              <Box sx={{ mt: 2 }}>
                  <Typography level="body-md">Pagado por {expense.memberWhoPaidName}</Typography>
                  <Typography level="body-md">$ {expense.amount} {expense.currency}</Typography>
              </Box>
          )}
      </Sheet>
  );
};


export default ExpenseCard;