import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "new group": "Create New Group",
      "notifications": "Notifications",
      "logout": "Sign Out",
      "new member": "New Member",
      "select user": "Select User",
      "add member": "Add Member",
      "expenses": "Expenses",
      "add expense": "Add Expense",
      "delete expense": "Delete Expense",
      "settle expense": "Settle Expense",
      "settled": "Settled",
      "name": "Name",
      "paid by": "Paid By",
      "amount": "Amount",
      "currency": "Currency",
      "member": "Member",
      "members": "Members",
      "liquidated": "Liquidated",
      "liquidate": "Liquidate",
      "delete": "Delete",
      "create": "Create",
      "cancel": "Cancel",
      "submit": "Submit",
      "edit": "Edit",
      "save": "Save",
      "close": "Close",
      "delete group": "Delete Group",
      // Add more translations as needed
    },
  },
  es: {
    translation: {
      "new group": "Crear nuevo grupo",
      "notifications": "Notificaciones",
      "logout": "Cerrar sesión",
      "new member": "Nuevo miembro",
      "select user": "Seleccione nuevo usuario",
      "add member": "Agregar",
      "expenses": "Gastos",
      "add expense": "Añadir Gasto",
      "delete expense": "Eliminar Gasto",
      "settle expense": "Liquidar",
      "settled": "Liquidado",
      "name": "Nombre",
      "paid by": "Pagado por",
      "amount": "Monto",
      "currency": "Moneda",
      "member": "Miembro",
      "members": "Miembros",
      "liquidated": "Liquidado",
      "liquidate": "Liquidar",
      "delete": "Eliminar",
      "create": "Crear",
      "cancel": "Cancelar",
      "submit": "Enviar",
      "edit": "Editar",
      "save": "Guardar",
      "close": "Cerrar",
      "delete group": "Eliminar Grupo",
      // Add more translations as needed

    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
