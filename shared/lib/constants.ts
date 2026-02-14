export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  users: {
    list: '/users',
    detail: (id: string) => `/users/${id}`,
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
  },
} as const;

export const COOKIE_NAMES = {
  TOKEN: process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || 'auth_token',
} as const;

// export const ROUTES = {
//   public: {
//     home: '/',
//     login: '/login',
//     register: '/register',
//     points: '/points',
//     calendar: '/calendar',
//     calendar: '/calendar',
//   },
//   protected: {
//     profile: '/profile',
//     admin: '/admin',
//     games: '/games',
//   },
// } as const;

export const ROUTES = {
  public: {
    home: '/',
    login: '/login',
    register: '/register',
    points: '/points', // Nowa trasa automatycznie trafi do public!
    calendar: '/calendar', // Nowa trasa automatycznie trafi do public!
    team: '/team', // Nowa trasa automatycznie trafi do public!
    songs: '/songs', // Nowa trasa automatycznie trafi do public!
  },
  protected: {
    dashboard: '/dashboard',
    profile: '/profile',
    games: '/games',
  },
  admin: {
    settings: '/admin',
  }
} as const;

export const ROLE_ROUTES = {
  USER: ['/', '/points', '/profile', '/games'],
  LEADER: ['/', '/points', '/profile', '/games'],
  ADMIN: ['/', '/points', '/profile', '/admin'],
} as const;