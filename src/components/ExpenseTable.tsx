import Button from '@mui/material/Button';
import DoneIcon from '@mui/icons-material/Done';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

// ExpenseTable component
export default function ClientsTable({expenses, deleteFunction, liquidatedFunction }: any) {

    const { t } = useTranslation();
    const [filters, setFilters] = useState({ name: '', amount: '', member: '', date: '', category: '' });
    
    function capitalizeFirstLetter(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function handleFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFilters({
            ...filters,
            [name]: value,
        });
    }

    const filteredExpenses = expenses.filter((expense: any) => {
        return (
            (!filters.name || expense.name.toLowerCase().startsWith(filters.name.toLowerCase())) &&
            (!filters.amount || expense.amount >= parseFloat(filters.amount)) &&
            (!filters.member || expense.memberWhoPaidName.toLowerCase().startsWith(filters.member.toLowerCase())) &&
            (!filters.date || expense.date === filters.date) &&
            (!filters.category || expense.category.toLowerCase().startsWith(filters.category.toLowerCase()))
        );
    });

    return (
        <div style={{ width: '100%', overflowX: 'auto' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', marginBottom: '0px', width: '100%', marginTop: '4px' }}>
                <input
                    type="text"
                    name="name"
                    placeholder={t('Nombre')}
                    value={filters.name}
                    onChange={handleFilterChange}
                    style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', flex: '1 1 200px'}}
                />
                <input
                    type="text"
                    name="member"
                    placeholder={t('Pagado por')}
                    value={filters.member}
                    onChange={handleFilterChange}
                    style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', flex: '1 1 50px' }}
                />
                <input
                    type="number"
                    name="amount"
                    placeholder={t('Monto mayor a')}
                    value={filters.amount}
                    onChange={handleFilterChange}
                    style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', flex: '1 1 200px' }}
                />
                <input
                    type="text"
                    name="category"
                    placeholder={t('Categoria')}
                    value={filters.category}
                    onChange={handleFilterChange}
                    style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', flex: '1 1 200px' }}
                />
                <input
                    type="date"
                    name="date"
                    placeholder={t('Fecha')}
                    value={filters.date}
                    onChange={handleFilterChange}
                    style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', flex: '1 1 200px' }}
                />
            </div>

            <table className="table mt-0">
                <thead>
                    <tr>
                        <th></th>
                        <th>{t('Nombre')}</th>
                        <th>{t('Pagado Por')}</th>
                        <th>{t('Monto')}</th>
                        <th>{t('Categoria')}</th>
                        <th>{t('Fecha')}</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        filteredExpenses.map((expense: any, index: number) => (
                            <tr key={index}>
                                <td>
                                <img className='max-h-8' src={"/" + expense.category + ".png"} alt="Icono Avión" />
                                </td>
                                <td>{expense.name}</td>
                                <td>{expense.memberWhoPaidName}</td>
                                <td>${expense.amount} {expense.currency}</td>
                                <td>{t(capitalizeFirstLetter(expense.category))}</td>
                                <td>{expense.date}</td>
                                <td><button className='bg-red-400 p-2 rounded-xl text-white hover:bg-red-600 transition duration-300'onClick={() => deleteFunction(expense.id)}>{t('Eliminar Gasto')}</button></td>
                                <td>
                                    <Button
                                        variant="contained"
                                        color={expense.liquidated ? "success" : "primary"}
                                        onClick={() => liquidatedFunction(expense)}
                                        disabled={expense.liquidated}
                                        startIcon={<DoneIcon />}
                                        sx={{
                                            transition: 'background-color 0.3s',
                                            backgroundColor: expense.liquidated ? 'green' : 'grey',
                                            '&:hover': {
                                                backgroundColor: expense.liquidated ? 'darkgreen' : 'darkgrey',
                                            },
                                        }}
                                    >
                                        {expense.liquidated ? t('Liquidado') : t('Liquidar')}
                                    </Button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}