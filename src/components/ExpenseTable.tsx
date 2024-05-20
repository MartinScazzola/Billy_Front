export default function ClientsTable({ items, deleteFunction }: any) {
    console.log("ITEMS -> ", items)

    return (
        <table className="table mt-0">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Pagado Por</th>
                    <th>Monto</th>
                    <th>Eliminar</th>
                </tr>
            </thead>
            <tbody>
                {
                    items.map((item: any, index: number) => (
                        <tr key={index}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.memberWhoPaidName}</td>
                            <td>${item.amount} {item.currency}</td>
                            <td><button className='bg-red-400 p-2 rounded-xl text-white hover:bg-red-600 transition duration-300'onClick={() => deleteFunction(item.id)}>Eliminar Gasto</button></td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}