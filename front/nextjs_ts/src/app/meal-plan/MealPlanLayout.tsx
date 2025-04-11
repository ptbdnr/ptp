import "../globals.css";

export function MealPlanLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="min-h-screen max-w-md mx-auto flex flex-col bg-white">
        <div className="h-12 bg-primary px-5 flex items-center justify-between">
          <span className="text-white text-base font-medium">9:41</span>
          <div className="flex items-center gap-2 text-white">
            <span>📶</span>
            <span>📊</span>
            <span>🔋</span>
          </div>
        </div>
  
        <div className="h-15 bg-primary px-5 flex items-center justify-between">
          <div className="text-white text-2xl font-semibold tracking-tight">
            palatable
          </div>
          <div className="bg-white/20 px-3 py-1.5 rounded-full text-white text-sm font-medium">
            Wed, Apr 9
          </div>
        </div>
  
        {children}
  
        <nav className="h-[83px] bg-white border-t border-gray-200 grid grid-cols-5 pt-2">
          {[
            { icon: "🏠", label: "Home" },
            { icon: "🥕", label: "Pantry" },
            { icon: "🍽️", label: "Discover" },
            { icon: "📅", label: "Plan", active: true },
            { icon: "💬", label: "Assistant" }
          ].map((item, index) => (
            <button
              key={index}
              className="flex flex-col items-center"
            >
              <span className={`text-2xl mb-1 ${
                item.active ? "text-primary" : "text-gray-400"
              }`}>
                {item.icon}
              </span>
              <span className={`text-xs ${
                item.active ? "text-primary font-medium" : "text-gray-400"
              }`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>
      </div>
    );
  }