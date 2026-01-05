import React from 'react';
import { TrendingUp } from 'lucide-react';

const BudgetsView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-gray-900">Presupuestos</h1>
        <TrendingUp className="w-8 h-8 text-emerald-500" />
      </div>

      <div className="bg-white p-8 rounded-xl shadow-lg">
        <p className="text-gray-500 text-center py-12">
          Vista de Presupuestos - En desarrollo
        </p>
      </div>
    </div>
  );
};

export default BudgetsView;
