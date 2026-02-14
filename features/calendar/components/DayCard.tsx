import { CalendarEvent, DayGroup } from '@/features/calendar/types/calendar';
import { CalendarIcon, MapPin } from 'lucide-react';
// ... importy ikon ...

interface Props {
  group: DayGroup;
}

export function DayCard({ group }: Props) {

  // Link do Google Calendar (dodawanie wydarzenia)
  const addToGoogleLink = (event: CalendarEvent) => {
    const start = new Date(event.start).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(new Date(event.start).getTime() + 60*60*1000).toISOString().replace(/-|:|\.\d\d\d/g, ""); // +1h
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&location=${encodeURIComponent(event.location || "")}&details=${encodeURIComponent(event.description || "")}`;
  };

  return (
    <div className={`rounded-2xl ... ${group.isToday ? 'border-orange-400' : ''}`}>
      {/* // KARTA DNIA (Kontener dla wszystkich wydarzeń z jednego dnia) */}
                  <div 
                    // key={groupIndex} 
                    className={`rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border 
                      ${group.isToday ? 'bg-white border-orange-400 ring-4 ring-orange-100' : 'bg-white border-gray-100'}
                    `}
                  >
                    
                    {/* NAGŁÓWEK DNIA */}
                    <div className={`px-5 py-3 border-b flex justify-between items-center
                      ${group.isToday ? 'bg-orange-50' : 'bg-gray-50'}
                    `}>
                      <h2 className={`font-bold capitalize text-lg ${group.isToday ? 'text-orange-600' : 'text-[#2573a6]'}`}>
                        {group.dateLabel}
                      </h2>
                      {group.isToday && <span className="text-xs font-bold bg-orange-500 text-white px-2 py-1 rounded-full">DZIŚ</span>}
                    </div>
      
                    {/* LISTA WYDARZEŃ TEGO DNIA */}
                    <div className="divide-y divide-gray-100">
                      {group.events.map((event, idx) => (
                        <div key={idx} className="p-5 hover:bg-gray-50 transition-colors group relative">
                          
                          <div className="flex gap-3">
                            {/* LEWA STRONA: GODZINA */}
                            <div className="flex-shrink-0 w-14 text-right">
                              {!event.allDay ? (
                                <span className="font-mono font-bold text-gray-700 text-lg block">
                                  {new Date(event.start).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              ) : (
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Cały<br/>dzień</span>
                              )}
                            </div>
      
                            {/* PRAWA STRONA: TREŚĆ */}
                            <div className="flex-grow">
                              <h3 className="font-bold text-gray-800 leading-tight mb-1 group-hover:text-[#2573a6] transition-colors">
                                {event.title}
                              </h3>
                              
                              {event.location && (
                                <div className="flex items-center text-xs text-gray-500 mt-1 mb-2">
                                  <MapPin size={12} className="mr-1 text-gray-400" />
                                  {event.location}
                                </div>
                              )}
      
                              {event.description && (
                                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-2 rounded-lg mt-2 border border-gray-100">
                                  {event.description}
                                </p>
                              )}
                            </div>
                          </div>
      
                          {/* PRZYCISK "+" (Pojawia się po najechaniu) */}
                          <a 
                            href={addToGoogleLink(event)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute top-2 right-2 text-gray-300 hover:text-[#2573a6] p-2 opacity-0 group-hover:opacity-100 transition-all"
                            title="Dodaj do kalendarza Google"
                          >
                            <CalendarIcon size={18} />
                          </a>
      
                        </div>
                      ))}
                    </div>
                  </div>
    </div>
  );
}