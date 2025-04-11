"use client";

import { useActionState } from "react";
import { redirect } from "next/navigation";
import { login } from "@/services/auth";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [state, action, isPending] = useActionState(login, undefined);
  const { user } = useAuth();

  if (user) {
    redirect("/");
  }

  if (state?.success) {
    redirect("/");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto my-10 w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-700">
          Login
        </h1>
        <form action={action} className="space-y-5">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-600 font-medium mb-1">
              Email
            </label>
            <input
              type="text"
              name="email"
              className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              defaultValue={state?.email}
            />
            {state?.errors?.email && (
              <p className="error">{state.errors.email}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="text-gray-600 font-medium mb-1"
            >
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {state?.errors?.password && (
              <p className="error">{state.errors.password}</p>
            )}
          </div>

          <div className="flex items-end gap-4">
            <button
              disabled={isPending}
              className="w-full bg-blue-500 text-white p-2 rounded-md font-semibold hover:bg-blue-600 transition"
            >
              {isPending ? "Procesando..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
