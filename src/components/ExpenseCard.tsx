import React, { useEffect, useState } from 'react';
import Sheet from '@mui/joy/Sheet';
import { CssVarsProvider, CssBaseline, Typography, Button, Box } from '@mui/joy';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import EditIcon from '@mui/icons-material/Edit';

type Expense = {
    name: string;
    amount: number;
    currency: string;
    memberWhoPaid: string;
  };

type ExpenseCardProps = {
    expense: Expense;
    index: number;
};

const ExpenseCard: React.FunctionComponent<ExpenseCardProps> = ({ expense, index }) => {
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
          <Typography level="title-lg">{expense.name}</Typography>
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
                  <Typography level="body-md">Pagado por {expense.memberWhoPaid}</Typography>
                  <Typography level="body-md">$ {expense.amount} {expense.currency}</Typography>
              </Box>
          )}
      </Sheet>
  );
};


export default ExpenseCard;