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
    const [groups, setGroups] = useState<Group[]>([]);
    const [showGroups, setShowGroups] = useState(false);  // Estado para mostrar/ocultar la tabla de grupos

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setGroupName('');  // Limpiar el campo después de cerrar el modal
    };
    const handleGroupNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setGroupName(e.target.value);
    
    const handleCreateGroup = () => {
        if (groupName.trim() !== '') {
            const newGroup = {
                name: groupName,
                members: ["Creador (Ejemplo)"],
                memberCount: 1
            };
            setGroups([...groups, newGroup]);  // Agregar el nuevo grupo al estado
            handleCloseModal();  // Cerrar el modal y limpiar el formulario
        }
    };

    const toggleGroups = () => {
        setShowGroups(!showGroups);  // Cambiar estado para mostrar/ocultar grupos
    };

    function handleSignOut() {
        auth.signOut().then(() => {
            console.log("Sesión cerrada exitosamente.");
            navigate('/billy/login');
        }).catch((error) => {
            console.error("Error al cerrar sesión:", error);
        });
    }
    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            navigate('/billy/login');
        }
    }, []);

    return (
        <CssVarsProvider>
            <CssBaseline />
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, alignItems: 'flex-start' }}>
                <Box sx={{ width: '50%' }}>
                    <Button onClick={handleOpenModal} sx={{ mb: 2 }}>
                        Crear nuevo grupo
                    </Button>
                    {/* Botón "Mis grupos" centrado */}
                    <Box sx={{ justifyContent: 'center', textAlign: 'center', mt: 4 }}>
                        <Button onClick={toggleGroups} sx={{}}>
                            <Typography level="h4">Grupos</Typography>
                        </Button>
                    </Box>
                    {showGroups && (
                        <Box sx={{ overflowY: 'auto' }}>
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

                <Box>
                    <Button onClick={handleSignOut} sx={{ mb: 2 }}>
                        Cerrar Sesión
                    </Button>
                </Box>

                {isModalOpen && (
                    <Box sx={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <Box sx={{
                            bgcolor: 'background.paper',
                            p: 3,
                            borderRadius: '16px',
                            boxShadow: 6,
                            minWidth: '300px',
                            border: '1px solid grey'  // Agregar borde gris alrededor del modal
                        }}>
                            <Typography level="h3" sx={{ mb: 1 }}>Nuevo grupo</Typography>
                            <input
                                type="text"
                                placeholder="Nombre del grupo"
                                value={groupName}
                                onChange={handleGroupNameChange}
                                style={{ width: '100%', marginBottom: '16px', padding: '8px', border: '1px solid #bdbdbd', borderRadius: '16px' }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button onClick={handleCloseModal}>
                                    Cancelar
                                </Button>
                                <Button onClick={handleCreateGroup}>
                                    Crear
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                )}
            </Box>
        </CssVarsProvider>
    );
};

export default Home;
