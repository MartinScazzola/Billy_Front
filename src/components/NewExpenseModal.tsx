import { dbUrl } from "../DBUrl";
import { useParams } from "react-router-dom";

export default function NewExpenseModal({ groupUsers, cancelFunction, addFunction }: any) {
    const { groupid } = useParams();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);

        const expense_post = {
            id_expense: null,
            id_group: groupid,
            id_user: formData.get('memberWhoPaid'),
            name: formData.get('expenseName'),
            amount: formData.get('amount'),
            currency: 'ARS',
            participants: groupUsers.map((member: { id_user: any; }) => member.id_user),
        }

        const data = new URL(`${dbUrl}/expenses`);
        
        fetch(data, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(expense_post)
        })
            .then(response => response.json())
            .then(data => {
                const newExpense = {
                    id: data.id_expense,
                    name: expense_post.name,
                    amount: expense_post.amount,
                    currency: expense_post.currency,
                    memberWhoPaid: expense_post.id_user,
                    memberWhoPaidName: groupUsers.find((member: any) => member.id_user === expense_post.id_user)?.name ?? '',
                    members: expense_post.participants,
                    liquidated: false
                };
                //addExpenseToState(newExpense);
                //setExpenses([...expenses, newExpense])
                addFunction(newExpense);
                cancelFunction();
            })
            .catch(error => console.error('Error adding expense:', error));
    };

    return (
        <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-30'>
            <div className="animationTest rounded-3xl bg-white w-96 h-96 flex flex-col justify-center items-center text-black shadow-2xl gap-5 ">
                <p className="font-overlock text-[#CFBC9C] text-2xl font-black">Nuevo Pago</p>
                <form onSubmit={handleSubmit} method='post' name='contact-form'>
                    <div className='flex flex-col justify-content items-center gap-4'>
                        <input type="text" name="expenseName" id="expenseName" placeholder="Nombre del pago" className="w-[20rem] bg-[#fffefe] text-[#80958B] text-sm transition duration-700 border-b-2 outline-0"></input>
                        <input type="number" name="amount" id="amount" placeholder="Ingrese un Monto" className="w-[20rem] bg-[#fffefe] text-[#80958B] text-sm transition duration-700 border-b-2 outline-0"></input>
                        <label htmlFor="memberWhoPaid" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">¿Quién Pagó?</label>
                        <select id="memberWhoPaid" name="memberWhoPaid" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option selected>Elige a una persona</option>
                            {

                                groupUsers.map((member: any) => (
                                    <option key={member.id_user} value={member.id_user}>{member.name}</option>
                                ))
                            }
                        </select>
                        <div className='flex no-wrap justify-center items-center gap-4'>
                            <button className="w-[8rem] bg-[#fffefe] border-2 border-[#e1dfd8] text-[#CFBC9C] rounded-xl hover:bg-[#CFBC9C] hover:text-[#fffefe] text-sm transition duration-500 font-bold ">Enviar</button>
                            <button className="w-[6rem] bg-[#fffefe] border-2 border-[#e1dfd8] text-sm text-[#CFBC9C] rounded-xl hover:bg-[#CFBC9C] hover:text-[#fffefe] transition duration-500 font-bold" onClick={cancelFunction}>Cancelar</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );


}
