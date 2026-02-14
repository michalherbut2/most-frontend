import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-12">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-4 top-0 h-72 w-72 animate-pulse rounded-full bg-most-blue-600/10 blur-3xl"></div>
        <div className="absolute -right-4 bottom-0 h-72 w-72 animate-pulse rounded-full bg-most-blue-600/10 blur-3xl animation-delay-2000"></div>
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-most-blue-600/5 blur-3xl animation-delay-4000"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}