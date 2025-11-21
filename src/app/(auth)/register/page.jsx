"use client";

import { useActionState } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { register } from "@/services/auth";
import { useAuth } from "@/context/AuthContext";
import {
  EnvelopeIcon,
  LockClosedIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

export default function Register() {
  const [state, action, isPending] = useActionState(register, undefined);
  const { user } = useAuth();
  const [password, setPassword] = useState("");

  if (user) {
    redirect("/");
  }

  if (state?.redirect) {
    redirect("/");
  }

  const passwordRequirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*]/.test(password),
  };

  const allRequirementsMet = Object.values(passwordRequirements).every(Boolean);

  const RequirementItem = ({ met, text }) => (
    <div className="flex items-center gap-2 text-sm">
      {met ? (
        <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
      ) : (
        <XCircleIcon className="h-4 w-4 text-gray-300 flex-shrink-0" />
      )}
      <span className={met ? "text-gray-700" : "text-gray-500"}>{text}</span>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100">
      <div className="flex flex-col lg:flex-row flex-1 items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-0">
        <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center text-center pr-12">
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-green-700 mb-4">
              Únete a BirdApp
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Comienza tu aventura en la ornitología
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="flex items-start gap-3">
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">Acceso Completo</h3>
                <p className="text-sm text-gray-600">
                  Usa todas las características de la app
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">
                  Historial Sincronizado
                </h3>
                <p className="text-sm text-gray-600">
                  Accede desde cualquier dispositivo
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">Datos Seguros</h3>
                <p className="text-sm text-gray-600">
                  Encriptación de nivel enterprise
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">
                  Comunidad Global
                </h3>
                <p className="text-sm text-gray-600">
                  Conecta con otros ornitólogos
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <div className="w-full max-w-md p-6 sm:p-8 bg-white shadow-lg rounded-2xl border border-gray-100">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                Registrarse
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Crea tu cuenta en segundos
              </p>
            </div>

            <form action={action} className="space-y-4 sm:space-y-5">
              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className="text-gray-700 font-semibold text-sm mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="tu@email.com"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                      transition-all duration-200 bg-gray-50 hover:bg-white"
                    defaultValue={state?.email}
                    disabled={isPending}
                  />
                </div>
                {state?.errors?.email && (
                  <p className="text-red-600 text-sm mt-1 font-medium">
                    {state.errors.email}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="password"
                  className="text-gray-700 font-semibold text-sm mb-2"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                      transition-all duration-200 bg-gray-50 hover:bg-white"
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isPending}
                  />
                </div>

                {password && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-2">
                    <p className="text-xs font-semibold text-gray-700">
                      Requisitos:
                    </p>
                    <RequirementItem
                      met={passwordRequirements.length}
                      text="Mínimo 8 caracteres"
                    />
                    <RequirementItem
                      met={passwordRequirements.uppercase}
                      text="Al menos una mayúscula"
                    />
                    <RequirementItem
                      met={passwordRequirements.lowercase}
                      text="Al menos una minúscula"
                    />
                    <RequirementItem
                      met={passwordRequirements.number}
                      text="Al menos un número"
                    />
                    <RequirementItem
                      met={passwordRequirements.special}
                      text="Un carácter especial: !@#$%^&*"
                    />
                  </div>
                )}

                {state?.errors?.password && (
                  <div className="text-red-600 text-sm mt-2 font-medium p-3 bg-red-50 rounded-lg">
                    <p className="mb-1">Requisitos no cumplidos:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      {state.errors.password.map((err) => (
                        <li key={err}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="confirmPass"
                  className="text-gray-700 font-semibold text-sm mb-2"
                >
                  ✓ Confirmar Contraseña
                </label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPass"
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                      transition-all duration-200 bg-gray-50 hover:bg-white"
                    disabled={isPending}
                  />
                </div>
                {state?.errors?.confirmPass && (
                  <p className="text-red-600 text-sm mt-1 font-medium">
                    {state.errors.confirmPass}
                  </p>
                )}
              </div>

              <div className="flex items-start gap-2 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 mt-1"
                  defaultChecked
                />
                <label
                  htmlFor="terms"
                  className="text-xs sm:text-sm text-gray-600"
                >
                  Acepto los{" "}
                  <a
                    href="#"
                    className="text-green-600 hover:underline font-semibold"
                  >
                    términos de servicio
                  </a>{" "}
                  y la{" "}
                  <a
                    href="#"
                    className="text-green-600 hover:underline font-semibold"
                  >
                    política de privacidad
                  </a>
                </label>
              </div>

              <button
                type="submit"
                disabled={isPending || !allRequirementsMet}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 
                  text-white font-semibold py-3 rounded-lg shadow-md
                  hover:shadow-lg hover:from-green-600 hover:to-emerald-700
                  active:scale-95 transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md
                  text-base sm:text-lg mt-6"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Registrando...
                  </span>
                ) : (
                  "Crear Cuenta"
                )}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-600">o</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 text-sm">
                ¿Ya tienes cuenta?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-green-600 hover:text-green-700 transition-colors"
                >
                  Inicia sesión
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center text-xs text-gray-500">
              <p>Tu contraseña es encriptada end-to-end</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
