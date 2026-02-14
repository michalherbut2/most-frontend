import Cookies from 'js-cookie';

const TOKEN_KEY = 'most_token'; // Nazwa ciasteczka

export const authCookie = {
  // Zapisz token (np. na 7 dni)
  set: (token: string) => {
    Cookies.set(TOKEN_KEY, token, { 
      expires: 7, 
      secure: process.env.NODE_ENV === 'production', // Na produkcji tylko HTTPS
      sameSite: 'Strict' 
    });
  },

  // Pobierz token
  get: () => {
    return Cookies.get(TOKEN_KEY);
  },

  // Usuń token (Wylogowanie)
  remove: () => {
    Cookies.remove(TOKEN_KEY);
  }
};