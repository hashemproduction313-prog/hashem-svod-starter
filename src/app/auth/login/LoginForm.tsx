// src/app/auth/login/LoginForm.tsx
"use client";
import React from "react";

export default function LoginForm() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border shadow-sm p-6 bg-white/5">
        <h1 className="text-2xl font-semibold mb-1">Connexion</h1>
        <p className="text-sm text-gray-500 mb-6">
          Accède à ton compte Hashem SVOD.
        </p>

        <form action="/api/auth/login" method="post" className="space-y-4">
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input
              id="email" name="email" type="email" required
              className="border rounded px-3 py-2 w-full bg-white/80"
              placeholder="ton@email.com" autoComplete="email"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="password" className="text-sm font-medium">Mot de passe</label>
            <input
              id="password" name="password" type="password" required
              className="border rounded px-3 py-2 w-full bg-white/80"
              placeholder="••••••••" autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl px-4 py-2 font-semibold border hover:bg-black/5 transition"
          >
            Se connecter
          </button>
        </form>

        <div className="text-sm mt-4 text-gray-600">
          Pas de compte ? <a href="/subscribe" className="underline">S’inscrire</a>
        </div>
      </div>
    </main>
  );
}
