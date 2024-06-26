import List from '@mui/joy/List';
import ListSubheader from '@mui/joy/ListSubheader';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemContent from '@mui/joy/ListItemContent';

import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentIndRoundedIcon from '@mui/icons-material/AssignmentIndRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';

type User = {
  id_user: number;
  name: string;
  email: string;
};

export default function Navigation({ groupUsers, handleOpenModal, handleDeleteGroupMember, debts}: any) {
  const { t } = useTranslation();
  return (
    <List
      size="sm"
      sx={{ '--ListItem-radius': 'var(--joy-radius-sm)', '--List-gap': '4px' }}
    >
      <ListItem nested>
        <ListSubheader sx={{ letterSpacing: '2px', fontWeight: '800' }}>
          Browse
        </ListSubheader>
        <List
          aria-labelledby="nav-list-browse"
          sx={{
            '& .JoyListItemButton-root': { p: '8px' },
          }}
        >
          <ListItem>
            <ListItemButton selected>
              <ListItemDecorator>
                <PeopleRoundedIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>Grupo</ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>
              <ListItemDecorator sx={{ color: 'neutral.500' }}>
                <AccountTreeRoundedIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>Liquidar Gastos</ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>
              <ListItemDecorator sx={{ color: 'neutral.500' }}>
                <AssignmentIndRoundedIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>Manejar cuenta</ListItemContent>
            </ListItemButton>
          </ListItem>
        </List>
      </ListItem>
      <List
        size="sm"
        sx={{ '--ListItem-radius': 'var(--joy-radius-sm)', '--List-gap': '4px' }}
      >
        <ListItem nested sx={{ display: 'flex' }}>
          <ListItem >
            <ListSubheader sx={{ letterSpacing: '2px', fontWeight: '800' }}>
              {t('Miembros del grupo')}
            </ListSubheader>
            <ListItemButton onClick={handleOpenModal}>
              <ListItemDecorator>
                <AddIcon />
              </ListItemDecorator>
            </ListItemButton>
          </ListItem>

          {groupUsers.map((user: User) => (
            <List key={user.id_user}>
              <ListItem>
                <ListItemDecorator>
                  <ArticleRoundedIcon fontSize="small" />
                </ListItemDecorator>
                <ListItemContent>{user.name}</ListItemContent>
                <ListItemButton onClick={() => handleDeleteGroupMember(user.id_user)}>
                  <ListItemDecorator>
                    <DeleteIcon/>
                  </ListItemDecorator>
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemContent> {t('Deuda')}: ${debts.find((debt: any) => debt.id_user === user.id_user)?.amount || 0
                }</ListItemContent>
              </ListItem>
            </List>
          ))}
        </ListItem>
      </List>
    </List>
  );
}

