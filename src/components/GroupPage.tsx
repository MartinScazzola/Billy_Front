import React from 'react';
import { useParams } from 'react-router-dom';

const GroupPage = () => {
  const { groupName } = useParams(); 

  return (
    <div className="p-4">
      <h1>{`Bienvenido al grupo: ${groupName}`}</h1>
      {/* agregar más detalles y funcionalidades relacionadas con el grupo */}
    </div>
  );
};

export default GroupPage;
