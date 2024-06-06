import { useEffect, useState } from "react";
import { dbUrl } from "../DBUrl";

type GroupDebt = {
    id_group: number;
    amount_user: number;
    currency: string;
  };




export default function detailExpenseModal({ cancelFunction, id_user }: any) {
    
    const [groupDebts, setGroupDebts] = useState<GroupDebt[]>([]);
    // {
    //     "id_expense": 2,
    //     "id_group": 27,
    //     "id_user": 1,
    //     "name": "Carne",
    //     "amount": 10000,
    //     "currency": "ARS",
    //     "liquidated": true,
    //     "participants": [
    //       3,
    //       2,
    //       1
    //     ],
    //     "expense_distribution": [
    //       3333,
    //       3333,
    //       3333
    //     ],
    //     "category": "alimentos",
    //     "date": "2024-05-27"
    //   },
    useEffect(() => {
        fetch(`${dbUrl}/expenses`)
      .then(response => response.json())
      .then(data => {

        const filtered = data.filter((expense: any) => expense.participants.includes(id_user) && !expense.liquidated);
        console.log(filtered);
        console.log(id_user);

        const groupDebts = filtered.map((expense: any) => {
        let amount_user; 
        
        if (expense.id_user === id_user) {
            amount_user = expense.expense_distribution[expense.participants.indexOf(id_user)] - expense.amount;
            } else {
            amount_user = expense.expense_distribution[expense.participants.indexOf(id_user)];
            }
        return {
            
            id_group: expense.id_group,
            amount_user: amount_user,
            currency: expense.currency
            }
        })
        console.log(groupDebts);
        setGroupDebts(groupDebts);
      })
      .catch(error => console.error('Error fetching expenses list:', error));

    }, []);

    return (

        <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-30'>
            <div className="animationTest rounded-3xl bg-white w-[500px] h-[500px] flex flex-col justify-center items-center text-black shadow-2xl gap-5 ">
                <p className="font-overlock text-[#CFBC9C] text-2xl font-black">Balance de Deudas</p>
                <div className="flex flex-col w-full justfiy-center items-center gap-5">
                    {groupDebts.map((member: any, index: number) => (
                        <>
                            <div className="flex w-[100%] justify-between px-20 items-center">
                                <div><b>Nombre de grupo:</b> {member.id_group} </div>
                                <div><b>Deuda:</b> {member.amount_user}{member.currency} </div>
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