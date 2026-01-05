import React from 'react';
import { CreditCard } from 'lucide-react';

const AccountsView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-gray-900">Cuentas</h1>
        <CreditCard className="w-8 h-8 text-emerald-500" />
      </div>

      <div className="bg-white p-8 rounded-xl shadow-lg">
        <p className="text-gray-500 text-center py-12">
          Vista de Cuentas - En desarrollo
        </p>
      </div>
    </div>
  );
};

export default AccountsView;
