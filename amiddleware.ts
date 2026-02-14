// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { decodeJwt } from 'jose'; // ✅ Lekka biblioteka idealna do Edge Runtime
// import { COOKIE_NAMES, ROUTES, ROLE_ROUTES } from '@/shared/lib/constants';

// // Definicje tras
// // const PUBLIC_ROUTES = [ROUTES.public.login, ROUTES.public.register, ROUTES.public.home];
// // const AUTH_ROUTES = [ROUTES.public.login, ROUTES.public.register];
// // Automatycznie wyciąga wszystkie wartości z obiektu ROUTES.public
// const PUBLIC_ROUTES = Object.values(ROUTES.public); 

// // Automatycznie wyciąga login i register
// const AUTH_ROUTES = [ROUTES.public.login, ROUTES.public.register];

// // Helper: Sprawdza czy ścieżka pasuje do wzorca
// const matchesRoute = (pathname: string, routes: string[]) => {
//   return routes.some(route => pathname === route || pathname.startsWith(`${route}/`));
// };

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const token = request.cookies.get(COOKIE_NAMES.TOKEN)?.value;

//   // 1. Dekodujemy token RAZ (jeśli istnieje)
//   let decodedToken = null;
//   let isExpired = true;

//   if (token) {
//     try {
//       // ✅ Używamy biblioteki jose - bezpieczniej i działa w Edge
//       decodedToken = decodeJwt(token);
      
//       // Sprawdzamy exp (czas wygaśnięcia)
//       if (decodedToken && decodedToken.exp) {
//         const currentTime = Math.floor(Date.now() / 1000);
//         isExpired = decodedToken.exp < currentTime;
//       }
//     } catch (e) {
//       // Jeśli token jest uszkodzony, traktujemy jak brak tokena
//       decodedToken = null;
//       isExpired = true;
//     }
//   }

//   const isAuthenticated = token && !isExpired;

//   // 2. SCENARIUSZ: Użytkownik zalogowany wchodzi na Login/Register
//   // Chcemy go wyrzucić na Dashboard/Home, żeby nie logował się 2 razy
//   if (isAuthenticated && matchesRoute(pathname, AUTH_ROUTES)) {
//     return NextResponse.redirect(new URL(ROUTES.public.home, request.url));
//   }

//   // 3. SCENARIUSZ: Trasy Publiczne (np. Home, Landing Page)
//   // Jeśli nie jest to trasa auth (obsłużona wyżej), a jest publiczna -> wpuszczamy
//   if (matchesRoute(pathname, PUBLIC_ROUTES)) {
//     return NextResponse.next();
//   }

//   // --- STREFA CHRONIONA (Wszystko co nie jest publiczne) ---

//   // 4. SCENARIUSZ: Brak autoryzacji w strefie chronionej
//   if (!isAuthenticated) {
//     // Usuwamy ew. uszkodzone ciastko
//     const response = NextResponse.redirect(new URL(ROUTES.public.login, request.url));
//     if (token) {
//       response.cookies.delete(COOKIE_NAMES.TOKEN);
//     }
//     return response;
//   }

//   // 5. SCENARIUSZ: Role Based Access Control (RBAC)
//   const userRole = decodedToken?.role as string; // Upewnij się, że w JWT pole to 'role'

//   // A. Ochrona Admina
//   if (pathname.startsWith(ROUTES.protected.admin) && userRole !== 'ADMIN') {
//     return NextResponse.redirect(new URL(ROUTES.public.home, request.url));
//   }

//   // B. Ochrona Specyficznych Tras (Sprawdzenie czy rola ma dostęp do tej ścieżki)
//   // Funkcja hasRouteAccess przeniesiona inline lub zaimportowana, ale logika uproszczona:
//   const allowedRoutesForRole = ROLE_ROUTES[userRole as keyof typeof ROLE_ROUTES] || [];
//   const hasAccess = allowedRoutesForRole.some(route => pathname.startsWith(route));

//   // Jeśli user jest zalogowany, ale nie ma prawa tu wejść (np. USER wchodzi na /leader)
//   // UWAGA: Tu musisz uważać, żeby nie zablokować wspólnych tras (np. /profile)
//   // Zakładam, że ROLE_ROUTES definiuje WSZYSTKIE dozwolone ścieżki dla roli.
//   if (!hasAccess && !pathname.startsWith('/profile')) { // Przykład wyjątku dla wspólnej trasy
//      return NextResponse.redirect(new URL(ROUTES.public.home, request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   // Ten matcher jest OK - filtruje pliki statyczne
//   matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)'],
// };