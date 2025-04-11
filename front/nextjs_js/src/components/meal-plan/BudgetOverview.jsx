export function BudgetOverview({ 
    current, 
    total, 
    percentage 
  }) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Budget Overview
        </h2>
        <div className="h-2 bg-gray-100 rounded-full mb-3 overflow-hidden">
          <div 
            className="h-full bg-green-500 rounded-full" 
            style={{ width: `${percentage}%` }} 
          />
        </div>
        <div className="flex justify-between text-gray-500 text-sm">
          <span>Current: ${current.toFixed(2)}</span>
          <span>Budget: ${total.toFixed(2)}</span>
        </div>
      </div>
    );
  }