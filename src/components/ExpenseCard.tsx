import { useState } from 'react';

import Sheet from '@mui/joy/Sheet';
import {Typography, Button, Box } from '@mui/joy';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';


import List from '@mui/joy/List';

import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemContent from '@mui/joy/ListItemContent';

import DeleteIcon from '@mui/icons-material/Delete';




export default function ExpenseCard({ expense, index, delete2 } : any) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpandClick = () => {
      console.log("expense - ", expense);
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
              <ListItemButton onClick={() => delete2(expense.id)}>
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