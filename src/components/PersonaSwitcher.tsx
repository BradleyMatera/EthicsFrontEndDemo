'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { GraduationCap, LogOut, Shield, Users, ChevronDown, UserCircle } from 'lucide-react';

const roleConfig = {
  student: { label: 'Student', color: 'bg-blue-100 text-blue-700', icon: GraduationCap },
  instructor: { label: 'Instructor', color: 'bg-indigo-100 text-indigo-700', icon: Users },
  admin: { label: 'Admin', color: 'bg-slate-800 text-white', icon: Shield },
};

export function PersonaSwitcher() {
  const { user, loginAs, logout, demoPersonas } = useAuth();
  const [open, setOpen] = useState(false);

  if (user) {
    const role = roleConfig[user.role];
    const otherPersonas = demoPersonas.filter((p) => p.id !== user.id);
    const initials = user.name.split(' ').map((n) => n[0]).join('');

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
            {initials}
          </div>
          <span className="hidden sm:inline">{user.name}</span>
          <ChevronDown size={14} className="text-slate-400" />
        </button>

        {open && (
          <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
            <div className="border-b border-slate-100 px-3 py-2">
              <p className="text-sm font-medium text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
              <span className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${role.color}`}>
                <role.icon size={12} />
                {role.label}
              </span>
            </div>

            <div className="py-1">
              <p className="px-3 py-1 text-xs font-medium text-slate-400">Switch Persona</p>
              {otherPersonas.map((p) => {
                const pRole = roleConfig[p.role];
                const pInitials = p.name.split(' ').map((n) => n[0]).join('');
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      loginAs(p.id);
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                      {pInitials}
                    </div>
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-slate-500">{pRole.label}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="border-t border-slate-100 pt-1">
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        <UserCircle size={18} className="text-blue-600" />
        <span>Demo Login</span>
        <ChevronDown size={14} className="text-slate-400" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
          <p className="px-3 py-2 text-xs font-medium text-slate-400">Select a Persona</p>
          {demoPersonas.map((p) => {
            const pRole = roleConfig[p.role];
            const pInitials = p.name.split(' ').map((n) => n[0]).join('');
            return (
              <button
                key={p.id}
                onClick={() => {
                  loginAs(p.id);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                  {pInitials}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-slate-500">{pRole.label}</p>
                </div>
                <pRole.icon size={14} className={p.role === 'admin' ? 'text-slate-700' : 'text-slate-400'} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
