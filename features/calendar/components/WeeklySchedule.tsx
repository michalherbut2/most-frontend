
// --- DANE PLANU TYGODNIA (Możesz to trzymać w osobnym pliku constant) ---
const weeklyPlan = [
  {
    day: 'Niedziela',
    dayId: 0, // 0 = Niedziela w JS Date()
    events: [
      { time: '18:00', title: 'Próba scholi', loc: 'Salka kaflowa' },
      { time: '18:30', title: 'Spotkanie LSO', loc: 'Salka wężowa' },
      { time: '19:25', title: 'Didascalia', loc: 'Kościół NSJ' },
      { time: '19:30', title: 'Msza święta', loc: 'Kościół NSJ' },
      { time: '20:30', title: 'Kolacja', loc: 'Stolarnia' },
    ]
  },
  {
    day: 'Poniedziałek',
    dayId: 1,
    events: [
      { time: '18:30', title: 'Próba scholi', loc: 'Salka kaflowa' },
      { time: '18:40', title: 'Różaniec', loc: 'Kościół NSJ' },
      { time: '19:00', title: 'Msza święta', loc: 'Kościół NSJ' },
      { time: '20:00', title: 'Lectio Divina', loc: 'Salka MOSTu' },
    ]
  },
  {
    day: 'Wtorek',
    dayId: 2,
    events: [
      { time: '18:30', title: 'Próba scholi', loc: 'Salka kaflowa' },
      { time: '18:40', title: 'Różaniec', loc: 'Kościół NSJ' },
      { time: '19:00', title: 'Msza święta', loc: 'Kościół NSJ' },
      { time: '19:45', title: 'Adoracja', loc: 'Kościół NSJ' },
      { time: '20:15', title: 'Spotkania Formacyjne', loc: '' },
    ]
  },
  {
    day: 'Środa',
    dayId: 3,
    events: [
      { time: '17:00', title: 'Dziewczyny zza płota', loc: '' },
      { time: '18:30', title: 'Próba scholi', loc: 'Salka kaflowa' },
      { time: '19:00', title: 'Msza święta', loc: 'Kościół NSJ' },
      { time: '20:00', title: 'Iloraz', loc: 'Salka kaflowa' },
    ]
  },
  {
    day: 'Czwartek',
    dayId: 4,
    events: [
      { time: '17:30', title: 'Gitara', loc: 'Salka kaflowa' },
      { time: '18:30', title: 'Próba scholi', loc: 'Salka kaflowa' },
      { time: '19:00', title: 'Msza święta', loc: 'Kościół NSJ' },
      { time: '20:00', title: 'Wyjścia / Imprezy', loc: 'Stolarnia' },
    ]
  },
  {
    day: 'Piątek',
    dayId: 5,
    events: [
      { time: '18:30', title: 'Próba scholi', loc: 'Salka kaflowa' },
      { time: '19:00', title: 'Msza święta', loc: 'Kościół NSJ' },
      { time: '20:00', title: 'Tabor', loc: 'Salka kaflowa' },
      { time: '22:00', title: 'Salka z MOSTem', loc: 'Salezjańska Szkoła Podstawowa' },
    ]
  },
];

// --- KOMPONENT WIDOKU ---
export function WeeklySchedule() {
  const currentDayId = new Date().getDay(); // 0-6 (0 = Niedziela)

  return (
    <div className="mt-20 border-t border-gray-200 pt-16">
      
      {/* NAGŁÓWEK SEKCJI */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-widest mb-3">
          Stały Plan Tygodnia
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Schemat naszych regularnych spotkań. Tutaj zawsze wiesz, co się dzieje.
        </p>
      </div>

      {/* GRID KART */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
        {weeklyPlan.map((day) => {
          const isToday = currentDayId === day.dayId;

          return (
            <div 
              key={day.day} 
              className={`
                rounded-xl p-6 transition-all duration-300 border
                ${isToday 
                  ? 'bg-white border-orange-400 shadow-md ring-1 ring-orange-100 transform scale-105 md:scale-100' 
                  : 'bg-white border-gray-100 shadow-sm hover:shadow-md'
                }
              `}
            >
              {/* NAZWA DNIA */}
              <h3 className={`
                text-lg font-bold uppercase tracking-wider mb-4 pb-2 border-b
                ${isToday ? 'text-orange-600 border-orange-100' : 'text-[#2573a6] border-gray-100'}
              `}>
                {day.day}
                {isToday && <span className="ml-2 text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full align-middle">DZIŚ</span>}
              </h3>

              {/* LISTA ZDARZEŃ */}
              <ul className="space-y-3">
                {day.events.map((event, idx) => (
                  <li key={idx} className="flex items-start group">
                    {/* GODZINA */}
                    <span className="font-mono text-sm font-bold text-gray-500 w-14 pt-0.5 shrink-0 group-hover:text-[#2573a6] transition-colors">
                      {event.time}
                    </span>
                    
                    {/* TREŚĆ */}
                    <div>
                      <p className="text-gray-800 font-medium text-sm leading-tight">
                        {event.title}
                      </p>
                      {event.loc && (
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                          {event.loc}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}