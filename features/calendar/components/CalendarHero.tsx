export function CalendarHero() {
  return (
    <div className="bg-[#2573a6] text-white py-14 px-4 text-center shadow-lg mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-wider mb-3">
            Terminarz
          </h1>
          <p className="opacity-90 text-lg font-light">
            Plan spotkań i wydarzeń wspólnoty MOST
          </p>
        </div>
        {/* Dekoracyjne kółka w tle */}
        <div className="absolute top-[-50%] left-[-10%] w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-50%] right-[-10%] w-96 h-96 bg-orange-400 opacity-10 rounded-full blur-3xl"></div>
      </div>
  ) 
}