# MOST UI Design System Guidelines

1. **Colors:**
   - Primary: `bg-[#2573a6]`, `text-[#2573a6]`, `border-[#2573a6]` (Brand).
   - Surface: `bg-slate-50` (App Background), `bg-white` (Cards).
   - Text: `text-slate-900` (Headings), `text-slate-500` (Subtitles).
   - Gamification: `text-orange-600`, `bg-orange-50` (Points/Badges).

2. **Components:**
   - **Cards:** `bg-white rounded-xl border border-slate-200 shadow-sm p-6`.
   - **Buttons (Primary):** `bg-[#2573a6] text-white hover:bg-[#1e5f8a] rounded-lg px-4 py-2 font-medium transition-all active:scale-95`.
   - **Buttons (Secondary):** `bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 rounded-lg`.
   - **Inputs:** `bg-white border-slate-200 focus:ring-2 focus:ring-[#2573a6]/20 rounded-lg`.

3. **Layout (Dashboard):**
   - Use `AppLayout` wrapper.
   - Grid system: `grid grid-cols-1 md:grid-cols-3 gap-6`.
   - Widgets strictly follow the Card pattern.

4. **Typography:**
   - Headings: Font-bold, tracking-tight.
   - Body: Inter/Sans-serif, text-sm or text-base.