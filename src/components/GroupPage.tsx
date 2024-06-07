import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Button, Box } from '@mui/joy';
import '../style_components/Home.css';

import List from '@mui/joy/List';
import ListSubheader from '@mui/joy/ListSubheader';
import ListItem from '@mui/joy/ListItem';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';

import { dbUrl } from "../DBUrl";
import ExpenseTable from './ExpenseTable';
import { getAuth } from 'firebase/auth';
import appFirebase from '../credentials';
import NavigationLeft from './NavigationLeft';
import NewExpenseModal from './NewExpenseModal';
import { useTranslation } from 'react-i18next';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CSVLink } from 'react-csv';

export type Expense = {
  id: number;
  name: string;
  amount: number;
  currency: string;
  memberWhoPaid: number;
  memberWhoPaidName: string;
  members: number[];
  liquidated: boolean;
  expense_distribution: number[];
  date: string;
  category: string;
};

type Debts = {
  id_user: number;
  amount: number;
  currency: string;
}

type User = {
  id_user: number;
  name: string;
  email: string;
};

type Group = {
  id_group: number;
  name: string;
};

const GroupPage = () => {
  const { t } = useTranslation();
  const auth = getAuth(appFirebase);
  const user = auth.currentUser;
  const { groupid } = useParams();
  const [debts, setDebts] = useState<Debts[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [_expenseName, setExpenseName] = useState('');
  const [_amount, setAmount] = useState(0);
  const [_memberWhoPaid, setMemberWhoPaid] = useState(0);
  const [expenseModal, setExpenseModal] = useState(false);
  const [newUser, setNewUser] = useState(0);
  const [groupUsers, setGroupUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState<User[]>([]);
  const [group, setGroup] = useState<Group>({ id_group: 0, name: '' });
  const [_memberName, setMemberName] = useState('');
  const [errorMemberName, setErrorMemberName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setErrorMemberName('');
    setMemberName('');
  };

  const [_errorExpense, setErrorExpense] = useState('');
  const [_currency, setCurrency] = React.useState('ARG');

  const closeExpenseModal = () => {
    setExpenseModal(false);
  };

  const handleDownloadReport = () => {
    const doc = new jsPDF();
    doc.text('Informe de Gastos del Grupo: ' + group.name , 20, 10);

    const tableColumn = ["Nombre", "Monto", "Moneda", "Pagador", "Fecha", "Categoría", "Liquidado"];
    const tableRows = expenses.map(expense => [
      expense.name,
      expense.amount,
      expense.currency,
      expense.memberWhoPaidName,
      expense.date,
      expense.category,
      expense.liquidated ? 'Sí' : 'No'
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
    });

    doc.save('reporte_gastos.pdf');
  };

  const csvData = expenses.map(expense => ({
    Grupo: group.name,
    Nombre: expense.name,
    Monto: expense.amount,
    Moneda: expense.currency,
    Pagador: expense.memberWhoPaidName,
    Fecha: expense.date,
    Categoría: expense.category,
    Liquidado: expense.liquidated ? 'Sí' : 'No'
  }));

  const updateDebts = (expenses: Expense[]) => {
    const debts = groupUsers.map(user => {
      return expenses.map((expense) => expense.currency).filter((item: any,
        index: any, arr: any) => arr.indexOf(item) === index).map((currency) => ({ id_user: user.id_user, amount: 0, currency: currency }))
    }).flat();

    expenses.forEach(expense => {
      if (expense.liquidated) {

        return;
      }

      expense.members.forEach((id, index) => {
        const memberDebt = debts.find(debt => debt.id_user === id && debt.currency === expense.currency);
        if (id === expense.memberWhoPaid) {
          if (memberDebt !== undefined) {
            memberDebt.amount -= (expense.amount - expense.expense_distribution[index]);
          }
        } else {
          if (memberDebt !== undefined) {
            memberDebt.amount += expense.expense_distribution[index];
          }
        }
      });
    });

    setDebts(debts);
  };

  const handleAddExpense = (newExpense: Expense) => {
    const expense_post = {
      id_expense: null,
      id_group: groupid,
      id_user: newExpense.memberWhoPaid,
      name: newExpense.name,
      amount: newExpense.amount,
      currency: newExpense.currency,
      participants: newExpense.members,
      liquidated: false,
      expense_distribution: newExpense.expense_distribution,
      date: newExpense.date,
      category: newExpense.category,
    };

    const data = new URL(`${dbUrl}/expenses`);
    fetch(data, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expense_post)
    })
      .then(response => response.json())
      .then(_data => {
        setExpenses([...expenses, newExpense]);
        updateDebts(expenses);
      })
      .catch(error => console.error('Error fetching user list:', error));

    setExpenseName('');
    setAmount(0);
    setCurrency('ARG');
    setMemberWhoPaid(groupUsers[0].id_user);
    setErrorExpense('');
  };

  const handleDeleteExpense = (id: number) => {
    const api = new URL(`${dbUrl}/expenses/${id}`);

    fetch(api, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.status === 204) {
          setExpenses(expenses.filter(expense => expense.id !== id));
        } else {
          console.error('Failed to remove expense:', response.status);
        }
      })
      .catch(error => console.error('Error removing expense from group:', error));
  };

  const handleLiquidateExpense = (expense: Expense) => {
    const api = new URL(`${dbUrl}/expenses/${expense.id}`);

    const expense_put = {
      id_expense: expense.id,
      id_group: parseInt(groupid ?? ''),
      id_user: expense.memberWhoPaid,
      name: expense.name,
      amount: expense.amount,
      currency: expense.currency,
      participants: expense.members,
      liquidated: true,
      expense_distribution: expense.expense_distribution,
      category: expense.category,
      date: expense.date
    };

    fetch(api, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expense_put)
    })
      .then(response => {
        if (response.status === 200) {
          setExpenses(expenses.map(exp => {
            if (exp.id === expense.id) {
              exp.liquidated = true;
            }
            return exp;
          }));
          updateDebts(expenses);
        } else {
          console.error('Failed to liquidate expense:', response.status);
        }
      })
      .catch(error => console.error('Error liquidating expense from group:', error));
  };

  const handleAddGroupMember = () => {
    if (newUser === 0) {
      setErrorMemberName('El nombre del miembro es requerido');
      return;
    }

    const data = new URL(`${dbUrl}/groups/${groupid}/users`);
    data.searchParams.append('id_group', groupid ?? '');
    data.searchParams.append('id_user', newUser.toString());

    fetch(data, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        const newUserObject = totalUsers.find(user => user.id_user === newUser);

        if (newUserObject) {
          setGroupUsers([...groupUsers, { ...newUserObject }]);
          setDebts([...debts, { id_user: newUserObject.id_user, amount: 0, currency: 'ARS' }]);
        }

        setMemberName('');
        setErrorMemberName('');
        setIsModalOpen(false);
      })
      .catch(error => console.error('Error adding user to group:', error));
  };

  const handleDeleteGroupUser = (id_user: number) => {
    const api = new URL(`${dbUrl}/groups/${groupid}/users`);
    api.searchParams.append('id_group', groupid ?? '');
    api.searchParams.append('id_user', id_user.toString());

    fetch(api, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.status === 204) {
          setGroupUsers(groupUsers.filter(member => member.id_user !== id_user));
        } else {
          console.error('Failed to remove user:', response.status);
        }
      })
      .catch(error => console.error('Error removing user from group:', error));
  };

  useEffect(() => {
    fetch(`${dbUrl}/groups/${groupid}/users`)
      .then(response => response.json())
      .then(data => {
        setGroupUsers(data);
      })
      .catch(error => console.error('Error fetching group:', error));

    fetch(`${dbUrl}/groups/${groupid}`)
      .then(response => response.json())
      .then(data => {
        setGroup(data);
      })
      .catch(error => console.error('Error fetching groups list:', error));

    fetch(`${dbUrl}/users`)
      .then(response => response.json())
      .then(data => {
        setTotalUsers(data);
      })
      .catch(error => console.error('Error fetching user list:', error));

    fetch(`${dbUrl}/expenses`)
      .then(response => response.json())
      .then(data => {
        const filtered = data.filter((expense: any) => expense.id_group == groupid);
        const mapped = filtered.map((expense: any) => {
          return {
            id: expense.id_expense,
            name: expense.name,
            amount: expense.amount,
            currency: expense.currency,
            memberWhoPaid: expense.id_user,
            memberWhoPaidName: groupUsers.find((member: any) => member.id_user === expense.id_user)?.name ?? '',
            members: expense.participants,
            liquidated: expense.liquidated,
            expense_distribution: expense.expense_distribution,
            category: expense.category,
            date: expense.date
          };
        });
        setExpenses(mapped);
        updateDebts(mapped);
      })
      .catch(error => console.error('Error fetching expenses list:', error));
  }, [groupid, groupUsers.length, expenses.length]);

  if (group.name === '') {
    return (
      <div className="flex flex-col gap-5 justify-center items-center h-[100vh]" role="status">
        <svg aria-hidden="true" className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
        </svg>
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <aside className='mt-10 mx-5'>
      <div className='w-50 ml-64 h-40 bg-gradient-to-b from-blue-200 to-blue-400 flex items-center rounded-2xl shadow-2xl'>
        <h1 className="text-4xl ml-20 font-bold text-gray-800 leading-tight mb-2 border-b-2 border-gray-700 pb-2">
          {group.name}
        </h1>
        <div className='w-full h-16 p-0 flex items-center px-10 font-semibold rounded-xl justify-end'>
          <button className='bg-green-400 p-2 rounded-xl text-white hover:bg-green-600 transition duration-300 mr-4 flex items-center' onClick={handleDownloadReport}>
            <svg fill="#000000" height="20px" width="20px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 321.492 321.492" xml:space="preserve" className="mr-2">
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <g>
                  <path d="M296.635,165.204h-26.861V9c0-4.971-4.029-9-9-9H84.409c-2.599,0-5.072,1.124-6.781,3.082L18.076,71.315 c-1.431,1.64-2.219,3.742-2.219,5.918v235.259c0,4.971,4.029,9,9,9h235.917c4.971,0,9-4.029,9-9v-25.778h26.861 c4.971,0,9-4.029,9-9v-103.51C305.635,169.233,301.606,165.204,296.635,165.204z M287.635,268.714H94.497v-85.51h193.139V268.714z M75.409,32.999v35.234H44.657L75.409,32.999z M251.774,303.492H33.857V86.233h50.552c4.971,0,9-4.029,9-9V18h158.365v147.204 H85.497c-4.971,0-9,4.029-9,9v103.51c0,4.971,4.029,9,9,9h166.277V303.492z"></path>
                  <path d="M146.867,200.112h-23.854v52.216h10.909v-18.835h12.508c14.036,0,16.654-11.927,16.654-16.654 C163.084,206.585,156.975,200.112,146.867,200.112z M144.03,224.475h-10.108v-15.344h8.654c6.764,0,9.6,2.108,9.6,7.199 C152.175,218.657,152.175,224.475,144.03,224.475z"></path>
                  <path d="M194.577,200.112h-23.053v52.216h22.617c17.235,0,21.671-16.145,21.671-27.344 C215.812,215.094,212.176,200.112,194.577,200.112z M192.832,243.311h-10.618v-34.18h10.472c4.654,0,12,1.236,12,16.653 C204.686,234.365,201.704,243.311,192.832,243.311z"></path>
                  <polygon points="224.033,200.112 224.033,252.328 234.942,252.328 234.942,230.365 257.922,230.365 257.922,221.13 234.942,221.13 234.942,209.349 261.195,209.349 261.195,200.112 "></polygon>
                  <path d="M122.439,154.654h95.757c2.432,0,4.66-1.357,5.775-3.518s0.932-4.763-0.475-6.745l-47.878-67.439 c-1.219-1.717-3.194-2.737-5.3-2.737s-4.081,1.021-5.3,2.737l-47.878,67.439c-1.407,1.982-1.591,4.585-0.475,6.745 S120.007,154.654,122.439,154.654z M170.317,91.943l35.292,49.711h-70.585L170.317,91.943z"></path>
                </g>
              </g>
            </svg>
            {t('Descargar Informe PDF')}
          </button>
          <CSVLink data={csvData} filename={"reporte_gastos.csv"}>
            <button className='bg-green-400 p-2 rounded-xl text-white hover:bg-green-600 transition duration-300 flex items-center'>
              <svg fill="#000000" height="20px" width="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" className="mr-2">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <g>
                    <g>
                      <path d="M499.677,426.489c4.428,0,8.017-3.589,8.017-8.017V84.977c0-2.1-0.862-4.183-2.347-5.668l-76.96-76.96
                C426.899,0.863,424.818,0,422.716,0H106.324C92.473,0,81.205,11.268,81.205,25.119v9.086H12.261
                c-6.987,0-10.615,8.738-5.669,13.685l62.741,62.741L6.592,173.371c-4.946,4.947-1.319,13.685,5.669,13.685h68.944v299.825
                c0,13.851,11.268,25.119,25.119,25.119h376.251c13.851,0,25.119-11.268,25.119-25.119v-34.205
                c0-4.427-3.588-8.017-8.017-8.017c-4.428,0-8.017,3.589-8.017,8.017v34.205c0,5.01-4.076,9.086-9.086,9.086H106.324
                c-5.01,0-9.086-4.076-9.086-9.086V187.056h51.841c4.428,0,8.017-3.589,8.017-8.017s-3.588-8.017-8.017-8.017H31.615l54.724-54.724
                c3.131-3.131,3.131-8.207,0-11.337L31.615,50.238h348.88v120.785H183.284c-4.428,0-8.017,3.589-8.017,8.017s3.588,8.017,8.017,8.017
                h205.228c4.428,0,8.017-3.589,8.017-8.017V42.221c0-4.427-3.588-8.017-8.017-8.017H97.238v-9.086c0-5.01,4.076-9.086,9.086-9.086H414.7
                v51.841c0,13.851,11.268,25.119,25.119,25.119h51.841v325.478C491.66,422.9,495.248,426.489,499.677,426.489z M439.819,76.96
                c-5.01,0-9.086-4.076-9.086-9.086V27.37l49.589,49.59H439.819z"></path>
                    </g>
                  </g>
                  <g>
                    <g>
                      <path d="M191.835,128.267h-17.637V92.994h17.637c4.428,0,8.017-3.589,8.017-8.017s-3.588-8.017-8.017-8.017h-25.653
                c-4.428,0-8.017,3.589-8.017,8.017v51.307c0,4.427,3.588,8.017,8.017,8.017h25.653c4.428,0,8.017-3.589,8.017-8.017
                S196.264,128.267,191.835,128.267z"></path>
                    </g>
                  </g>
                  <g>
                    <g>
                      <path d="M243.142,102.614h-17.637v-9.62h17.637c4.428,0,8.017-3.589,8.017-8.017s-3.588-8.017-8.017-8.017h-25.653
                c-4.428,0-8.017,3.589-8.017,8.017v25.653c0,4.427,3.588,8.017,8.017,8.017h17.637v9.62h-17.637
                c-4.428,0-8.017,3.589-8.017,8.017s3.588,8.017,8.017,8.017h25.653c4.428,0,8.017-3.589,8.017-8.017V110.63
                C251.159,106.203,247.571,102.614,243.142,102.614z"></path>
                    </g>
                  </g>
                  <g>
                    <g>
                      <path d="M305.536,77.372c-4.145-1.382-8.76,0.925-10.141,5.071l-9.497,28.49l-9.497-28.49c-1.401-4.201-5.939-6.472-10.141-5.071
                c-4.201,1.4-6.47,5.94-5.07,10.141l17.102,51.307c1.09,3.273,4.154,5.481,7.605,5.481c3.451,0,6.515-2.208,7.605-5.481l17.102-51.307
                C311.986,83.368,309.68,78.754,305.536,77.372z"></path>
                    </g>
                  </g>
                  <g>
                    <g>
                      <path d="M414.165,213.779H174.733c-9.136,0-16.568,7.432-16.568,16.568v222.33h0c0,9.136,7.432,16.568,16.568,16.568h239.432
                c9.136,0,16.568-7.432,16.568-16.568v-222.33C430.733,221.211,423.301,213.779,414.165,213.779z M414.7,452.676
                c0,0.295-0.24,0.534-0.534,0.534H174.733c-0.294,0-0.534-0.239-0.534-0.534v-222.33c0-0.295,0.24-0.534,0.534-0.534h239.432
                c0.294,0,0.534,0.239,0.534,0.534V452.676z"></path>
                    </g>
                  </g>
                  <g>
                    <g>
                      <path d="M243.142,256.534h-34.205c-4.428,0-8.017,3.589-8.017,8.017s3.588,8.017,8.017,8.017h34.205
                c4.428,0,8.017-3.589,8.017-8.017S247.571,256.534,243.142,256.534z"></path>
                    </g>
                  </g>
                  <g>
                    <g>
                      <path d="M379.961,256.534H277.347c-4.428,0-8.017,3.589-8.017,8.017s3.588,8.017,8.017,8.017h102.614
                c4.428,0,8.017-3.589,8.017-8.017S384.389,256.534,379.961,256.534z"></path>
                    </g>
                  </g>
                  <g>
                    <g>
                      <path d="M243.142,307.841h-34.205c-4.428,0-8.017,3.589-8.017,8.017s3.588,8.017,8.017,8.017h34.205
                c4.428,0,8.017-3.589,8.017-8.017S247.571,307.841,243.142,307.841z"></path>
                    </g>
                  </g>
                  <g>
                    <g>
                      <path d="M379.961,307.841H277.347c-4.428,0-8.017,3.589-8.017,8.017s3.588,8.017,8.017,8.017h102.614
                c4.428,0,8.017-3.589,8.017-8.017S384.389,307.841,379.961,307.841z"></path>
                    </g>
                  </g>
                  <g>
                    <g>
                      <path d="M243.142,359.148h-34.205c-4.428,0-8.017,3.589-8.017,8.017c0,4.427,3.588,8.017,8.017,8.017h34.205
                c4.428,0,8.017-3.589,8.017-8.017C251.159,362.738,247.571,359.148,243.142,359.148z"></path>
                    </g>
                  </g>
                  <g>
                    <g>
                      <path d="M303,359.148h-25.653c-4.428,0-8.017,3.589-8.017,8.017c0,4.427,3.588,8.017,8.017,8.017H303
                c4.428,0,8.017-3.589,8.017-8.017C311.017,362.738,307.429,359.148,303,359.148z"></path>
                    </g>
                  </g>
                  <g>
                    <g>
                      <path d="M243.142,410.455h-34.205c-4.428,0-8.017,3.589-8.017,8.017c0,4.427,3.588,8.017,8.017,8.017h34.205
                c4.428,0,8.017-3.589,8.017-8.017C251.159,414.044,247.571,410.455,243.142,410.455z"></path>
                    </g>
                  </g>
                  <g>
                    <g>
                      <path d="M303,410.455h-25.653c-4.428,0-8.017,3.589-8.017,8.017c0,4.427,3.588,8.017,8.017,8.017H303
                c4.428,0,8.017-3.589,8.017-8.017C311.017,414.044,307.429,410.455,303,410.455z"></path>
                    </g>
                  </g>
                  <g>
                    <g>
                      <path d="M369.018,392.818l17.101-20.522c2.834-3.401,2.374-8.456-1.026-11.291c-3.4-2.833-8.455-2.374-11.291,1.026
                l-15.219,18.263l-15.219-18.263c-2.835-3.402-7.89-3.861-11.291-1.026c-3.401,2.835-3.86,7.89-1.026,11.291l17.101,20.522
                l-17.101,20.522c-2.573,3.087-2.422,7.759,0.357,10.667c3.263,3.413,8.937,3.225,11.96-0.402l15.219-18.263l15.219,18.263
                c3.023,3.628,8.697,3.815,11.96,0.402c2.78-2.907,2.93-7.578,0.357-10.667L369.018,392.818z"></path>
                    </g>
                  </g>
                </g>
              </svg>
              {t('Descargar Informe CSV')}
            </button>
          </CSVLink>
        </div>




      </div>

      <div>
        {isModalOpen && (
          <React.Fragment>
            <Box
              sx={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 9999,
              }}
            />
            <Box
              sx={{
                position: 'fixed',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000,
              }}
            >
              <Box
                sx={{
                  bgcolor: 'black',
                  color: 'white',
                  p: 3,
                  pt: 2,
                  borderRadius: '16px',
                  boxShadow: 6,
                  minWidth: '300px',
                  border: '1px solid #bdbdbd',
                }}
              >
                <Typography level="h3" sx={{ mb: 1, color: 'white' }}>{t('Nuevo miembro')}</Typography>
                <Select
                  // Poner un placeholder que se agregar nuevo usuario
                  placeholder="Seleccione nuevo usuario"
                  variant="plain"
                  value={newUser}
                  onChange={(_, value) => setNewUser(value!)}
                  slotProps={{
                    listbox: {
                      variant: 'outlined',
                      sx: {
                        zIndex: 20000,
                      },
                    },
                  }}
                  sx={{ mr: -1.5, '&:hover': { bgcolor: '#DDDDDD' }, width: 300, zIndex: 20000 }}
                >
                  {totalUsers.map((member, key) => (
                    <Option key={key} value={member.id_user}>{member.name}</Option>
                  ))}
                </Select>
                <List>
                  <ListItem nested sx={{ display: 'flex' }}>
                    <ListSubheader sx={{ fontWeight: '800' }}>
                      {errorMemberName && <p style={{ color: 'red' }}>{errorMemberName}</p>}
                    </ListSubheader>
                  </ListItem>
                </List>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1 }}>
                  <Button onClick={handleCloseModal} sx={{ color: 'white' }}>
                    {t('Cancelar')}
                  </Button>
                  <Button onClick={handleAddGroupMember} sx={{ color: 'white' }}>
                    {t('Agregar')}
                  </Button>
                </Box>
              </Box>
            </Box>
          </React.Fragment>
        )}

      </div>
      <div className='grid grid-cols-12'>
        <div className='col-span-1'>
          <NavigationLeft groupUsers={groupUsers} user={user} debts={debts} modal={setIsModalOpen} handleDeleteGroupUser={handleDeleteGroupUser} groupName={group.name} />
        </div>
        <div className='col-span-11 py-0 ml-[100px] flex flex-col justify-center items-center'>
          <div className='w-full h-16 bg-white p-0 flex items-center px-10 font-semibold rounded-xl justify-between'>
            <p className='text-xl'>{t('Gastos')}</p>
            <button className='bg-blue-400 p-2 rounded-xl text-white hover:bg-blue-600 transition duration-300' onClick={() => setExpenseModal(true)}>{t('Añadir Gasto')}</button>
          </div>
          <ExpenseTable expenses={expenses} deleteFunction={handleDeleteExpense} liquidatedFunction={handleLiquidateExpense} />
        </div>
      </div>
      {expenseModal && (
        <NewExpenseModal cancelFunction={closeExpenseModal} groupUsers={groupUsers} expenses={expenses} setExpenses={setExpenses} addFunction={handleAddExpense} />
      )}
    </aside>
  );
}

export default GroupPage;
