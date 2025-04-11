export function WeekSelector() {
    return (
      <div className="grid grid-cols-7 gap-2">
        {[
          { day: "M", date: "1" },
          { day: "T", date: "2" },
          { day: "W", date: "3", active: true },
          { day: "T", date: "4" },
          { day: "F", date: "5" },
          { day: "S", date: "6" },
          { day: "S", date: "7" }
        ].map((item, index) => (
          <button
            key={index}
            className={`flex flex-col items-center justify-center p-3 rounded-xl ${
              item.active 
                ? "bg-primary text-white" 
                : "bg-gray-100 text-gray-500"
            }`}
          >
            <span className="text-sm font-medium">{item.day}</span>
            <span className={`text-xs ${
              item.active ? "text-white/80" : "text-gray-400"
            }`}>
              {item.date}
            </span>
          </button>
        ))}
      </div>
    );
  }