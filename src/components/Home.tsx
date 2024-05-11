import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CssVarsProvider, CssBaseline, Typography, Button, Box } from '@mui/joy';
import '../style_components/Home.css';
import { getAuth } from 'firebase/auth';
import appFirebase from '../../src/credentials';

// Definir el tipo para los grupos
type Group = {
    name: string;
    members: string[];
    memberCount: number;
};
const auth = getAuth(appFirebase);

const Home = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groupName, setGroupName] = useState('');
    // Usar el tipo definido al declarar el estado
    const [groups, setGroups] = useState<Group[]>([]);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    const handleGroupNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setGroupName(e.target.value);
    const handleCreateGroup = () => {
        const newGroup = {
            name: groupName,
            members: ["Creador (Ejemplo)"],
            memberCount: 1
        };
        setGroups([...groups, newGroup]);
        setIsModalOpen(false);
        setGroupName('');
    };

    function handleSignOut() {
        auth.signOut().then(() => {
            // Sign-out successful.
            console.log("Sesión cerrada exitosamente.");
            navigate('/billy/login');
        }).catch((error) => {
            // An error happened.
            console.error("Error al cerrar sesión:", error);
        });
        console.log('Cerrar Sesión');
    }
    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            navigate('/billy/login');
        }
        //console.log('Usuario:', user.email);
    },[]);

    return (
        <CssVarsProvider>
            <CssBaseline />
            <Box sx={{ p: 4 }}>
                <Button onClick={handleOpenModal} sx={{ mb: 2 }}>
                    Crear nuevo grupo
                </Button>
                <Button onClick={handleSignOut} sx={{ mb: 2 }}>
                    Cerrar Sesión
                </Button>

                {isModalOpen && (
                    <Box sx={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <Box sx={{
                            bgcolor: 'black',  // Cambiar el color de fondo a negro
                            color: 'white',  // Cambiar el color del texto a blanco para contraste
                            p: 3,
                            pt: 2,
                            borderRadius: '16px',
                            boxShadow: 6,
                            minWidth: '300px',
                            border: '1px solid #bdbdbd',
                        }}>
                            <Typography level="h3" sx={{ mb: 1, color: 'white' }}>Nuevo grupo</Typography>
                            <input
                                type="text"
                                placeholder="Nombre del grupo"
                                value={groupName}
                                onChange={handleGroupNameChange}
                                className="input"
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    marginBottom: '16px',
                                    padding: '8px',
                                    fontSize: '16px',
                                    border: '1px solid #bdbdbd',
                                    borderRadius: '16px',
                                    backgroundColor: '#333',  // Fondo del input para mejorar visibilidad
                                    color: 'white'  // Color del texto del input
                                }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1 }}>
                                <Button onClick={handleCloseModal} sx={{ color: 'white' }}>
                                    Cancelar
                                </Button>
                                <Button onClick={handleCreateGroup} sx={{ color: 'white' }}>
                                    Crear
                                </Button>
                            </Box>
                        </Box>
                    </Box>

                )}

                {groups.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Nombre del Grupo</th>
                                    <th>Administrador</th>
                                    <th>Cantidad de miembros</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groups.map((group, index) => (
                                    <tr key={index}>
                                        <td>
                                            <Link to={`/billy/group/${group.name}`} className="link">
                                                {group.name}
                                            </Link>
                                        </td>
                                        <td>{group.members.join(', ')}</td>
                                        <td>{group.memberCount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Box>
                )}
            </Box>
        </CssVarsProvider>
    );
};

export default Home;
