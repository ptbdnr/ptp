export function MealCard({ 
    icon, 
    name, 
    type, 
    time, 
    price, 
    uses 
  }: {
    icon: string;
    name: string;
    type: string;
    time: string;
    price: number;
    uses: string[];
  }) {
    return (
      <div className="bg-white rounded-2xl flex overflow-hidden shadow-sm">
        <div className="w-20 bg-gray-50 flex items-center justify-center text-3xl">
          {icon}
        </div>
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-gray-800 font-semibold mb-2">{name}</h4>
              <div className="flex items-center gap-2 text-sm">
                <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
                  {type}
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-500">{time}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-500">${price.toFixed(2)}</span>
              </div>
            </div>
            <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
              ⋮
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Uses: {uses.join(", ")}
          </p>
        </div>
      </div>
    );
  }