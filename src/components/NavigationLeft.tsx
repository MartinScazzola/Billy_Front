import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

export default function NavigationLeft({ groupUsers, user, debts, modal}: any) {

    const handlerModal = () => {
        modal(true)
    }

    return (
        <aside id="default-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidenav">
            <div className="overflow-y-auto py-5 px-3 h-full bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <ul className="space-y-2">
                    <li>
                        <a href="#" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                            <svg aria-hidden="true" className="w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
                            <span className="ml-3">{user?.email}</span>
                        </a>
                    </li>
                </ul>
                <ul className="pt-5 mt-5 space-y-2 border-t border-gray-200 dark:border-gray-700">
                    <li>
                        <span>Miembros del grupo</span>
                    </li>
                    {
                        groupUsers.map((member: { id_user: Key | null | undefined; name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }) => (
                            <div key={member.id_user} className='hover:bg-gray-200 rounded-r-2xl pl-1'>
                                <svg aria-hidden="true" className=" inline flex-shrink-0 w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path><path fill-rule="evenodd" d="M3 10a7 7 0 1114 0 7 7 0 01-14 0zm7-7a1 1 0 00-1 1v1a1 1 0 102 0V4a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                                <div className='inline'><span className="ml-3">{member.name}</span></div>
                                <div><span>Deuda: ${debts.find((debt: any) => debt.id_user === member.id_user)?.amount || 0}</span></div>
                            </div>
                        ))
                    }
                    <button className='bg-green-400 p-2 rounded-xl text-white hover:bg-green-600 transition duration-300' onClick={handlerModal}>Agregar Persona</button>
                </ul>

            </div>
        </aside>

    )
}