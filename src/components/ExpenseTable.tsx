import Button from '@mui/material/Button';
import DoneIcon from '@mui/icons-material/Done';
import FlightIcon from '@mui/icons-material/Flight';


// export type Expense = {
//     id: number;
//     name: string;
//     amount: number;
//     currency: string;
//     memberWhoPaid: number;
//     memberWhoPaidName: string;
//     members: number[];
//     liquidated: boolean;
//   };

// ExpenseTable component
export default function ClientsTable({expenses, deleteFunction, liquidatedFunction }: any) {
    function capitalizeFirstLetter(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return (
        <table className="table mt-0">
            <thead>
                <tr>
                    <th></th>
                    <th>Nombre</th>
                    <th>Pagado Por</th>
                    <th>Monto</th>
                    <th>Categoria</th>
                    <th>Fecha</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {
                    expenses.map((expense: any, index: number) => (
                        <tr key={index}>
                            <td>
                            <img className='max-h-8' src={"/" + expense.category + ".png"} alt="Icono Avión" />
                            </td>
                            <td>{expense.name}</td>
                            <td>{expense.memberWhoPaidName}</td>
                            <td>${expense.amount} {expense.currency}</td>
                            <td>{capitalizeFirstLetter(expense.category)}</td>
                            <td>{expense.date}</td>
                            <td><button className='bg-red-400 p-2 rounded-xl text-white hover:bg-red-600 transition duration-300'onClick={() => deleteFunction(expense.id)}>Eliminar Gasto</button></td>
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
                                    {expense.liquidated ? 'Liquidado' : 'Liquidar'}
                                </Button>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}