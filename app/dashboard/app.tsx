// app/dashboard/app.tsx
import React from 'react';
import DashboardLayout from './layout';

const App: React.FC = () => {
  return (
    <DashboardLayout>
      {/* Aquí va el contenido del dashboard */}
      <div>Contenido del Dashboard</div>
    </DashboardLayout>
  );
};

export default App;