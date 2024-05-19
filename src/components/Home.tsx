import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CssVarsProvider,
  CssBaseline,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/joy";
import NotificationsIcon from "@mui/icons-material/Notifications";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PersonIcon from "@mui/icons-material/Person";
import FolderIcon from "@mui/icons-material/Folder";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PeopleIcon from "@mui/icons-material/People";
import "../style_components/Home.css";
import { getAuth } from "firebase/auth";
import appFirebase from "../../src/credentials";
import { dbUrl } from "../DBUrl";
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import DeleteIcon from '@mui/icons-material/Delete';

// Definir el tipo para los grupos
type Group = {
  id_group: number;
  name: string;
  members: string[];
  memberCount: number;
};
const auth = getAuth(appFirebase);

const Home = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // Estado para el menú desplegable del usuario
  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null); // Estado para el menú desplegable de notificaciones

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setGroupName(""); // Limpiar el campo después de cerrar el modal
  };

  const handleDeleteGroup = (group_id: number) => {
    console.log("group_id", group_id)
    fetch(`${dbUrl}/groups/${group_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.status === 204) {
        console.log(`Group ${group_id} deleted`);
        setGroups(groups.filter((group) => group.id_group !== group_id));
      } else {
        console.error('Failed to remove user:', response.status);
    }});
  };

  const handleGroupNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setGroupName(e.target.value);

  useEffect(() => {
    fetch(
      `${dbUrl}/userid?` +
        new URLSearchParams({
          email: auth?.currentUser?.email ?? "",
        }),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        fetch(`${dbUrl}/users/${data.id_user}/groups`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) =>
            setGroups(
              data.map((group: any) => {
                return {
                  id_group: group.id_group,
                  name: group.name,
                  members: [auth?.currentUser?.email ?? ""],
                  memberCount: 1,
                };
              })
            )
          );
      });
  }, []);

  const handleCreateGroup = () => {
    if (groupName.trim() !== "") {
      
      console.log("groupname", groupName)
      fetch(
        `${dbUrl}/userid?` +
          new URLSearchParams({
            email: auth?.currentUser?.email ?? "",
          }),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((response) => response.json())
      .then((data_user) => {
        console.log("data_user", data_user)
        fetch(`${dbUrl}/groups`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_group: null,
            name: groupName,
            participants: [data_user.id_user],
          }),
        }).then((response) => response.json())
          .then((data) => {
            console.log("data_group", data)
            const newGroup = {
              id_group: data.id_group,
              name: data.name,
              members: [auth?.currentUser?.email ?? ""],
              memberCount: 1,
            };
            setGroups([...groups, newGroup]);
            handleCloseModal();
          });
        });
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (anchorEl) {
      handleMenuClose();
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotifMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (notifAnchorEl) {
      handleNotifMenuClose();
    } else {
      setNotifAnchorEl(event.currentTarget);
    }
  };

  const handleNotifMenuClose = () => {
    setNotifAnchorEl(null);
  };

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        console.log("Sesión cerrada exitosamente.");
        navigate("/billy/login");
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/billy/login");
    }
  }, []);

  return (
    <CssVarsProvider>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 4,
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Button
            onClick={handleOpenModal}
            startDecorator={<GroupAddIcon />}
            sx={{ mb: 2 }}
            variant="solid"
            color="primary"
          >
            Crear nuevo grupo
          </Button>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={handleNotifMenuOpen}
              sx={{ border: "1px solid grey", mr: 1 }}
            >
              <NotificationsIcon />
            </IconButton>
            <IconButton
              onClick={handleMenuOpen}
              sx={{ border: "1px solid grey" }}
            >
              <PersonIcon />
              <Typography sx={{ ml: 1 }}>
                {auth?.currentUser?.email ?? "Usuario"}
              </Typography>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleSignOut}>Cerrar sesión</MenuItem>
            </Menu>
            <Menu
              anchorEl={notifAnchorEl}
              open={Boolean(notifAnchorEl)}
              onClose={handleNotifMenuClose}
            >
              <MenuItem>Notificación 1</MenuItem>
              <MenuItem>Notificación 2</MenuItem>
              <MenuItem>Notificación 3</MenuItem>
            </Menu>
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            overflowY: "auto",
            borderRadius: 2,
            boxShadow: 3,
            p: 2,
            bgcolor: "background.paper",
          }}
        >
          <table className="table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ borderBottom: "1px solid #e0e0e0", padding: "8px" }}>
                  <FolderIcon /> Nombre del Grupo
                </th>
                <th style={{ borderBottom: "1px solid #e0e0e0", padding: "8px" }}>
                  <AdminPanelSettingsIcon /> Administrador
                </th>
                <th style={{ borderBottom: "1px solid #e0e0e0", padding: "8px" }}>
                  <PeopleIcon /> Cantidad de miembros
                </th>
                <th style={{ borderBottom: "1px solid #e0e0e0", padding: "8px" }}>
                </th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #e0e0e0" }}>
                  <td style={{ padding: "8px" }}>
                    <Link to={`/billy/group/${group.id_group}`} className="link">
                      {group.name}
                    </Link>
                  </td>
                  <td style={{ padding: "8px" }}>{group.members.join(", ")}</td>
                  <td style={{ padding: "8px" }}>{group.memberCount}</td>
                  <td style={{ padding: "8px" }}>
                    <ListItemButton onClick={() => handleDeleteGroup(group.id_group)}>
                      <ListItemDecorator>
                        <DeleteIcon/>
                      </ListItemDecorator>
                    </ListItemButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
        {isModalOpen && (
          <Box
            sx={{
              position: "fixed",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <Box
              sx={{
                bgcolor: "background.paper",
                p: 3,
                borderRadius: "16px",
                boxShadow: 6,
                minWidth: "300px",
                border: "1px solid grey", // Agregar borde gris alrededor del modal
              }}
            >
              <Typography level="h3" sx={{ mb: 1 }}>
                Nuevo grupo
              </Typography>
              <input
                type="text"
                placeholder="Nombre del grupo"
                value={groupName}
                onChange={handleGroupNameChange}
                style={{
                  width: "100%",
                  marginBottom: "16px",
                  padding: "8px",
                  border: "1px solid #bdbdbd",
                  borderRadius: "16px",
                }}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button onClick={handleCloseModal}>Cancelar</Button>
                <Button onClick={handleCreateGroup}>Crear</Button>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </CssVarsProvider>
  );
};

export default Home;


                  {/* <ListItemButton>
                  <ListItemDecorator>
                    <DeleteIcon/>
                  </ListItemDecorator>
                  </ListItemButton> */}
                  {/* <td style={{ padding: "8px" }}>{group.id_group}</td> */}