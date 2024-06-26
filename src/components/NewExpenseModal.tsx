import { dbUrl } from "../DBUrl";
import { useState } from 'react';
import { useParams } from "react-router-dom";
import { Tabs, Tab, TextField, } from '@mui/material';
import { useTranslation } from "react-i18next";

export default function NewExpenseModal({ groupUsers, cancelFunction, addFunction }: any) {
    const { t } = useTranslation();
    const { groupid } = useParams();
    const [tabValue, setTabValue] = useState(0);
    const [percentages, setPercentages] = useState(groupUsers.map(() => 100/groupUsers.length));

    const currencies = ['ARS', 'BRL', 'CLP', 'COP', 'EUR', 'PEN', 'USD'];
    
    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTabValue(newValue);
    };

    const handlePercentageChange = (index: number, value: number) => {
        const newPercentages = [...percentages];
        newPercentages[index] = value;
        setPercentages(newPercentages);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);

        const newExpense = {
            id: null,
            name: formData.get('expenseName'),
            amount: formData.get('amount'),
            currency: formData.get('currency'),
            memberWhoPaid: formData.get('memberWhoPaid'),
            memberWhoPaidName: groupUsers.find((member: any) => member.id_user === formData.get('memberWhoPaid'))?.name ?? '',
            members: groupUsers.map((member: { id_user: any; }) => member.id_user),
            liquidated: false,
            expense_distribution: percentages.map((percentage: number) => Math.trunc(percentage * parseInt(formData.get('amount') as string) / 100)),
            date: formData.get('date')?.toString() ?? '',
            category: formData.get('category'),
        };

        addFunction(newExpense, percentages);
        cancelFunction();
    };

    return (
        <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-30'>
            <div className="animationTest rounded-3xl bg-white w-[500px] h-[800px] flex flex-col justify-center items-center text-black shadow-2xl gap-5 ">
                <p className="font-overlock text-[#CFBC9C] text-2xl font-black">{t('Nuevo Pago')}</p>
                <form onSubmit={handleSubmit} method='post' name='contact-form'>
                    <div className='flex flex-col justify-content items-center gap-4'>
                        <input type="text" name="expenseName" id="expenseName" placeholder={t("Nombre del pago")} className="w-[20rem] bg-[#fffefe] text-[#80958B] text-sm transition duration-700 border-b-2 outline-0"></input>
                        <input type="number" name="amount" id="amount" placeholder={t("Ingrese un Monto")} className="w-[20rem] bg-[#fffefe] text-[#80958B] text-sm transition duration-700 border-b-2 outline-0"></input>
                        <select id="currency" name="currency" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option selected>{t('Elige una moneda')}</option>
                            {

                                currencies.map((currency: any) => (
                                    <option key={currency} value={currency}>{currency}</option>
                                ))
                            }
                        </select>
                        <label htmlFor="memberWhoPaid" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('¿Quién Pagó?')}</label>
                        <select id="memberWhoPaid" name="memberWhoPaid" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option selected>{t('Elige a una persona')}</option>
                            {

                                groupUsers.map((member: any) => (
                                    <option key={member.id_user} value={member.id_user}>{member.name}</option>
                                ))
                            }
                        </select>
                        <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('Categoria')}</label>
                        <select id="category" name="category" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option selected>{t('Selecciona una categoria')}</option>
                            <option key="viaje" value="viaje">{t('Viajes')}</option>
                            <option key="alimentos" value="alimentos">{t('Alimentos')}</option>
                            <option key="educacion" value="educacion">{t('Educacion')}</option>
                            <option key="salud" value="salud">{t('Salud')}</option>
                            <option key="transporte" value="transporte">{t('Transporte')}</option>
                            <option key="general" value="general">{t('Otros')}</option>
                        </select>
                        <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('Fecha')}</label>
                        <input type="date" name="date" id="date" className="w-[20rem] bg-[#fffefe] text-[#80958B] text-sm transition duration-700 border-b-2 outline-0"></input>

                        <Tabs value={tabValue} onChange={handleTabChange} aria-label="expense division method" textColor="#CFBC9C" >
                            <Tab label="Equal Parts" />
                            <Tab label="Percentages" />
                        </Tabs>
                        {tabValue === 1 && (
                            <div className='w-full'>
                                {groupUsers.map((member: any, index: number) => (
                                    <div key={member.id_user} className='flex items-center my-2'>
                                        <TextField
                                            label={member.name}
                                            type="number"
                                            value={percentages[index]}
                                            onChange={(e) => handlePercentageChange(index, parseFloat(e.target.value))}
                                            variant="outlined"
                                            fullWidth
                                            inputProps={{ min: 0, max: 100 }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className='flex no-wrap justify-center items-center gap-4'>
                            <button className="w-[8rem] bg-[#fffefe] border-2 border-[#e1dfd8] text-[#CFBC9C] rounded-xl hover:bg-[#CFBC9C] hover:text-[#fffefe] text-sm transition duration-500 font-bold ">{t('Enviar')}</button>
                            <button className="w-[6rem] bg-[#fffefe] border-2 border-[#e1dfd8] text-sm text-[#CFBC9C] rounded-xl hover:bg-[#CFBC9C] hover:text-[#fffefe] transition duration-500 font-bold" onClick={cancelFunction}>{t('Cancelar')}</button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
}