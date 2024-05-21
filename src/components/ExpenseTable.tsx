import Button from '@mui/material/Button';
import DoneIcon from '@mui/icons-material/Done';

export default function ClientsTable({ items, deleteFunction, liquidatedFunction }: any) {
    console.log("ITEMS -> ", items)

    return (
        <table className="table mt-0">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Pagado Por</th>
                    <th>Monto</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {
                    items.map((item: any, index: number) => (
                        <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.memberWhoPaidName}</td>
                            <td>${item.amount} {item.currency}</td>
                            <td><button className='bg-red-400 p-2 rounded-xl text-white hover:bg-red-600 transition duration-300'onClick={() => deleteFunction(item.id)}>Eliminar Gasto</button></td>
                            <td>
                                <Button
                                    variant="contained"
                                    color={item.liquidated ? "success" : "primary"}
                                    onClick={() => liquidatedFunction(item)}
                                    disabled={item.liquidated}
                                    startIcon={<DoneIcon />}
                                    sx={{
                                        transition: 'background-color 0.3s',
                                        backgroundColor: item.liquidated ? 'green' : 'grey',
                                        '&:hover': {
                                            backgroundColor: item.liquidated ? 'darkgreen' : 'darkgrey',
                                        },
                                    }}
                                >
                                    {item.liquidated ? 'Liquidado' : 'Liquidar'}
                                </Button>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}