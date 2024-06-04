import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CssVarsProvider,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
} from "@mui/joy";
import NotificationsIcon from "@mui/icons-material/Notifications";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import HelpIcon from "@mui/icons-material/Help";
import PersonIcon from "@mui/icons-material/Person";
import FolderIcon from "@mui/icons-material/Folder";
import "../style_components/Home.css";
import "../App.css";

import { getAuth } from "firebase/auth";
import appFirebase from "../../src/credentials";
import { dbUrl } from "../DBUrl";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./languageSelector";


// Definir el tipo para los grupos
type Group = {
  id_group: number;
  name: string;
  members: string[];
  memberCount: number;
};
const auth = getAuth(appFirebase);

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // Estado para el menú desplegable del usuario
  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null); // Estado para el menú desplegable de notificaciones

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setGroupName(""); // Limpiar el campo después de cerrar el modal
  };

  const handleHelpOpenModal = () => setIsHelpModalOpen(true);
  const handleHelpCloseModal = () => setIsHelpModalOpen(false);

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
                };
              })
            )
          );
      });
  }, []);

  const handleCreateGroup = () => {
    if (groupName.trim() !== "") {

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
            startDecorator={<GroupAddIcon/>}
            sx={{ mb: 2, color: "black"}}
            variant="outlined"
          >
            {t('Crear nuevo grupo')}
          </Button>
          <Button
            onClick={handleHelpOpenModal}
            startDecorator={<HelpIcon/>}
            sx={{ mb: 2, color: "black"}}
            variant="outlined"
          >
            {t('Ayuda')}
          </Button>
          <Box sx={{ display: "flex", alignItems: "center"}}>
            <LanguageSelector />
            <Button
              onClick={handleNotifMenuOpen}
              sx={{ border: "1px solid grey", mr: 1, color: "#555555"}}
              variant="outlined"
            >
              <NotificationsIcon />
            </Button>
            <Button
              onClick={handleMenuOpen}
              sx={{ border: "1px solid grey", color: "#555555" }}
              variant="outlined"
            >
              <PersonIcon />
              <Typography sx={{ ml: 1, color: "#555555" }}>
                {auth?.currentUser?.email ?? "Usuario"}
              </Typography>
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleSignOut}>{t('Cerrar sesión')}</MenuItem>
            </Menu>
            <Menu
              anchorEl={notifAnchorEl}
              open={Boolean(notifAnchorEl)}
              onClose={handleNotifMenuClose}
            >
              <MenuItem>{t('Notificación 1')}</MenuItem>
              <MenuItem>{t('Notificación 2')}</MenuItem>
              <MenuItem>{t('Notificación 3')}</MenuItem>
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
            <thead >
              <tr>
                <th style={{ borderBottom: "1px solid #e0e0e0", padding: "8px" }} >
                  <FolderIcon className="bg-black"/> {t('Nombre del Grupo')}
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
                bgcolor: "#aaa",
                p: 3,
                borderRadius: "16px",
                boxShadow: 6,
                minWidth: "300px",
                border: "2px solid #333333",
              }}
            >
              <Typography level="h3" sx={{ mb: 1 }}>
                {t('Nuevo grupo')}
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
                <Button onClick={handleCloseModal}>{t('Cancelar')}</Button>
                <Button onClick={handleCreateGroup}>{t('Crear')}</Button>
              </Box>
            </Box>
          </Box>
        )}

        {isHelpModalOpen && (
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
                bgcolor: "#fff",
                p: 3,
                borderRadius: "16px",
                boxShadow: 6,
                minWidth: "300px",
                border: "2px solid #333333",
                color: "black"
              }}
            >
              <Typography level="h3" sx={{ mb: 1 }}>
                {t('Ayuda')}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                {t('Bienvenido a la aplicación de control de gastos Billy. Aquí te mostramos cómo usar la página web:')}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                1. {t("Regístrate con tu nombre, apellido, correo electrónico y contraseña en la página de sign up")}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                2. {t("Inicia sesión con tu correo electrónico y contraseña en la página de log in")}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                3. {t("En la página de inicio, verás tus grupos y podrás crear un nuevo grupo haciendo click en el botón 'crear nuevo grupo'")}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                4. {t("Dentro de un grupo, puedes añadir miembros haciendo click en el botón 'agregar persona' o eliminar un miembro haciendo click en el ícono del cesto. Además, puedes agregar gastos haciendo click en el botón 'agregar gasto'")}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                5. {t("Al añadir un gasto, podrás agregar su nombre, el precio (seleccionando la divisa correspondiente), miembro que lo pagó, categoría y cómo quiere ser divido entre los miembros del grupo")}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                6. {t("La división de gastos puede ser en partes iguales o por porcentajes. Una vez añadido el gasto, las deudas se actualizarán entre los miembros del grupo automáticamente")}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                7. {t("Puedes liquidar los gastos haciendo click en el botón 'liquidar gasto', y las deudas se actualizarán en consecuencia. Si has agregado un gasto erroneamente, puedes eliminarlo haciendo click en el botón 'eliminar gasto'")}
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button onClick={handleHelpCloseModal}>{t('Cerrar')}</Button>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </CssVarsProvider>
  );
};

export default Home;


  /*
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
      }
    });
  };*/


{/* <ListItemButton>
                  <ListItemDecorator>
                    <DeleteIcon/>
                  </ListItemDecorator>
                  </ListItemButton> */}
{/* <td style={{ padding: "8px" }}>{group.id_group}</td> */ }