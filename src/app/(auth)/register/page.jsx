"use client";

import { useActionState } from "react";
import { register } from "@/services/auth";

export default function Register() {
  const [state, action, isPending] = useActionState(register, undefined);
  const { user } = useAuth();

  if (user) {
    redirect("/");
  }

  if (state?.redirect) {
    redirect("/");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto my-10 w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-700">
          Registro
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
              <div className="error">
                <p>Requisitos:</p>
                <ul className="list-disc list-inside ml-4">
                  {state.errors.password.map((err) => (
                    <li key={err}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="ConfirmPass"
              className="text-gray-600 font-medium mb-1"
            >
              Confirmar Contraseña
            </label>
            <input
              type="password"
              name="confirmPass"
              className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {state?.errors?.confirmPass && (
              <p className="error">{state.errors.confirmPass}</p>
            )}
          </div>

          <div className="flex items-end gap-4">
            <button
              disabled={isPending}
              className="w-full bg-blue-500 text-white p-2 rounded-md font-semibold hover:bg-blue-600 transition"
            >
              {isPending ? "Procesando..." : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
