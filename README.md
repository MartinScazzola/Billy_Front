# Billy - Aplicación de Gestión de Pagos
![Billy Logo](public/billy_logo.jpg)
Billy es una aplicación de gestión de pagos diseñada para ayudar a los usuarios a gestionar sus gastos y pagos grupales. La aplicación incluye funcionalidades como autenticación de usuarios, creación de grupos y seguimiento de gastos.

## Características

- Autenticación de usuarios (Registro, Inicio de Sesión)
- Creación y gestión de grupos
- Seguimiento de gastos para grupos
- Balance general de deudas
- Modal de detalles de gastos
- Interfaz de usuario intuitiva y amigable
- Navegación fácil y accesible
- Tabla de gastos detallada
- Modal para añadir nuevos gastos
- Soporte para múltiples idiomas

## Estructura del Proyecto

### Componentes

- **detailExpenseModal.tsx**: Componente para mostrar detalles de un gasto en un modal.
- **ExpenseTable.tsx**: Componente para mostrar una tabla con los gastos.
- **GeneralBalanceDebtsModal.tsx**: Componente para mostrar el balance general de deudas en un modal.
- **GoogleIcon.tsx**: Componente de ícono personalizado para la autenticación con Google.
- **GroupPage.tsx**: Componente para mostrar y gestionar los gastos de un grupo.
- **Home.tsx**: Componente para la página de inicio, mostrando los grupos del usuario y permitiendo la creación de grupos.
- **languageSelector.tsx**: Componente para seleccionar el idioma.
- **LanguageSwitcher.tsx**: Componente para cambiar el idioma de la aplicación.
- **Layout.tsx**: Componente de diseño para estructurar la aplicación.
- **Login.tsx**: Componente para el inicio de sesión de usuarios.
- **NavigationLeft.tsx**: Componente para la navegación lateral izquierda.
- **Navigation.tsx**: Componente para la navegación entre diferentes partes de la aplicación.
- **NewExpenseModal.tsx**: Componente para añadir un nuevo gasto en un modal.
- **Signup.tsx**: Componente para el registro de usuarios.

## Dependencias

Se debe instalar las siguentes dependencias:

```shell
npm install i18next react-i18next i18next-browser-languagedetector
```

Para correr el sitio web ejecutar en la terminal:
```shell
npm install
```

```shell
npm run dev
```

## Contribuciones

- Hacer un fork del repositorio.
- Crear una nueva rama (git checkout -b feature-branch).
- Hacer commit de tus cambios (git commit -m 'Agregar nueva funcionalidad').
- Hacer push a la rama (git push origin feature-branch).
- Abrir un Pull Request.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT.

