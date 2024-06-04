import { useEffect, useState } from "react";
import { dbUrl } from "../DBUrl";

type User = {
    id_user: number;
    name: string;
    email: string;
  };

export default function detailExpenseModal({ cancelFunction, expense }: any) {
    const [totalUsers, setTotalUsers] = useState<User[]>([]);

    useEffect(() => {
        fetch(`${dbUrl}/users`)
            .then(response => response.json())
            .then(data => {
                setTotalUsers(data);
            })
            .catch(error => console.error('Error fetching user list:', error));

    }, []);
    console.log(expense);

    return (

        <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-30'>
            <div className="animationTest rounded-3xl bg-white w-[500px] h-[500px] flex flex-col justify-center items-center text-black shadow-2xl gap-5 ">
                <p className="font-overlock text-[#CFBC9C] text-2xl font-black">Detalle del gasto</p>
                <div className="flex flex-col w-full justfiy-center items-center gap-5">
                    {expense.members.map((member: any, index: number) => (
                        <>
                            <div className="flex w-[100%] justify-between px-20 items-center">
                                <div><b>Nombre:</b> {totalUsers.find(user => user.id_user === member)?.name} </div>
                                <div><b>Monto:</b> {expense.expense_distribution[index]}{expense.currency} </div>
                            </div>
                            <div className="w-[70%] border-2 border-[#CFBC9C]"></div>
                        </>
                    ))
                    }
                </div>
                <button className="w-[6rem] bg-[#fffefe] border-2 border-[#e1dfd8] text-sm text-[#CFBC9C] rounded-xl hover:bg-[#CFBC9C] hover:text-[#fffefe] transition duration-500 font-bold py-1" onClick={cancelFunction}>cerrar</button>
            </div>
        </div>
    )
}