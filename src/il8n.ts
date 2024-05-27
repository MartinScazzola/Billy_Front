import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
        "Crear nuevo grupo": "Create new group",
        "Notificaciones": "Notifications",
        "Notificación 1": "Notification 1",
        "Notificación 2": "Notification 2",
        "Notificación 3": "Notification 3",
        "Nombre del grupo": "Group name",
        "Miembros del grupo": "Group members",
        "Cerrar sesión": "Sign out",
        "Nuevo miembro": "New member",
        "Nuevo grupo": "New group",
        "Descripción": "Description",
        "Fecha": "Date",
        "Categoría": "Category",
        "Agregar Persona": "Add person",
        "Deuda": "Debt",
        "Seleccione nuevo usuario": "Select new user",
        "Agregar": "Add",
        "Gastos": "Expenses",
        "Añadir Gasto": "Add Expense",
        "Eliminar Gasto": "Delete Expense",
        "Liquidar": "Settle",
        "Liquidado": "Settled",
        "Nombre": "Name",
        "Pagado Por": "Paid by",
        "Monto": "Amount",
        "Moneda": "Currency",
        "Miembro": "Member",
        "Miembros": "Members",
        "Eliminar": "Delete",
        "Crear": "Create",
        "Cancelar": "Cancel",
        "Enviar": "Send",
        "Editar": "Edit",
        "Guardar": "Save",
        "Cerrar": "Close",
        "Eliminar Grupo": "Delete Group",
        "Elige a una persona": "Choose a person",
        "Viaje": "Travel",  
        "Comida": "Food",
        "Entretenimiento": "Entertainment",
        "Educación": "Education",
      
      // Add more translations as needed
    },
  },
  es: {
    translation: {
      "Crear nuevo grupo": "Crear nuevo grupo",
      "Notificaciones": "Notificaciones",
      "Notificación 1": "Notificación 1",
      "Notificación 2": "Notificación 2",
      "Notificación 3": "Notificación 3",
      "Nombre del grupo": "Nombre del grupo",
      "Miembros del grupo": "Miembros del grupo",
      "Cerrar sesión": "Cerrar sesión",
      "Nuevo miembro": "Nuevo miembro",
      "Nuevo grupo": "Nuevo grupo",
      "Descripción": "Descripción",
      "Fecha": "Fecha",
      "Categoría": "Categoría",
      "Agregar Persona": "Agregar persona",
      "Deuda": "Deuda",
      "Seleccione nuevo usuario": "Seleccione nuevo usuario",
      "Agregar": "Agregar",
      "Gastos": "Gastos",
      "Añadir Gasto": "Añadir Gasto",
      "Eliminar Gasto": "Eliminar Gasto",
      "Liquidar": "Liquidar",
      "Liquidado": "Liquidado",
      "Nombre": "Nombre",
      "Pagado Por": "Pagado por",
      "Monto": "Monto",
      "Moneda": "Moneda",
      "Miembro": "Miembro",
      "Miembros": "Miembros",
      "Eliminar": "Eliminar",
      "Crear": "Crear",
      "Cancelar": "Cancelar",
      "Enviar": "Enviar",
      "Editar": "Editar",
      "Guardar": "Guardar",
      "Cerrar": "Cerrar",
      "Eliminar Grupo": "Eliminar Grupo",
      "Elige a una persona": "Elige a una persona",
      "Viaje": "Viaje",
      "Comida": "Comida",
      "Entretenimiento": "Entretenimiento",
      "Educación": "Educación",
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
