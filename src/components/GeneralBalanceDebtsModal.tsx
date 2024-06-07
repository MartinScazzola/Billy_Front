import { useEffect, useState } from "react";
import { dbUrl } from "../DBUrl";

type GroupDebt = {
    id_group: number;
    amount_user: number;
    currency: string;
};




export default function detailExpenseModal({ cancelFunction, id_user }: any) {

    const [groupDebts, setGroupDebts] = useState<GroupDebt[]>([]);
    const [groups, setGroups] = useState<any[]>([]);
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

                const groupedDebts: GroupDebt[] = groupDebts.reduce((acc: any, debt: any) => {
                    const key = `${debt.id_group}-${debt.currency}`;
                    if (!acc[key]) {
                        acc[key] = { ...debt };
                    } else {
                        acc[key].amount_user += debt.amount_user;
                    }
                    return acc;
                }, {});

                const finalGroupDebts = Object.values(groupedDebts);
                console.log(finalGroupDebts);
                setGroupDebts(finalGroupDebts);
            })
            .catch(error => console.error('Error fetching expenses list:', error));
        fetch(`${dbUrl}/users/${id_user}/groups`, {
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
                            name: group.name
                        };
                    })
                )
            );
    }, []);

    return (

        <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-30'>
            <div className="animationTest rounded-3xl bg-white w-[500px] h-[500px] flex flex-col justify-center items-center text-black shadow-2xl gap-5 ">
                <p className="font-overlock text-[#CFBC9C] text-2xl font-black">Balance de Deudas</p>
                <div className="flex flex-col w-full justfiy-center items-center gap-5">
                    {groupDebts.map((totalExpense: any, index: number) => (
                        <>
                            <div className="flex w-[100%] justify-between px-20 items-center">
                                <div><b>Grupo:</b> {groups.find(group=>group.id_group == totalExpense.id_group ).name} </div> 
                                <div><b>Deuda:</b> {totalExpense.amount_user}{totalExpense.currency} </div>
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