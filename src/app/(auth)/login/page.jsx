"use client";

import { useActionState } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { login } from "@/services/auth";
import { useAuth } from "@/context/AuthContext";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";

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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100">
      <div className="flex flex-col lg:flex-row flex-1 items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-0">
        <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center text-center pr-12">
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-green-700 mb-4">
              BirdApp
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Identifica aves de forma instantánea
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 h-6 w-6 text-green-600 mt-1">✓</div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">
                  Identificación en Tiempo Real
                </h3>
                <p className="text-sm text-gray-600">
                  Usa IA para clasificar aves al instante
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 h-6 w-6 text-green-600 mt-1">✓</div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">
                  Por Imagen o Sonido
                </h3>
                <p className="text-sm text-gray-600">
                  Sube fotos o graba audios de aves
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 h-6 w-6 text-green-600 mt-1">✓</div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">
                  Información Detallada
                </h3>
                <p className="text-sm text-gray-600">
                  Aprende sobre cada especie identificada
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 h-6 w-6 text-green-600 mt-1">✓</div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">
                  Historial de Registros
                </h3>
                <p className="text-sm text-gray-600">
                  Mantén un registro de tus avistamientos
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-2xl font-bold text-green-600">10+</p>
              <p className="text-sm text-gray-600">Especies de aves</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-2xl font-bold text-green-600">100%</p>
              <p className="text-sm text-gray-600">Gratis y Open Source</p>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <div className="w-full max-w-md p-6 sm:p-8 bg-white shadow-lg rounded-2xl border border-gray-100">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                Bienvenido
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Inicia sesión para acceder a tu cuenta
              </p>
            </div>

            {state?.errors?.general && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-medium">
                  {state.errors.general}
                </p>
              </div>
            )}

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
                    disabled={isPending}
                  />
                </div>
                {state?.errors?.password && (
                  <p className="text-red-600 text-sm mt-1 font-medium">
                    {state.errors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
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
                    Iniciando sesión...
                  </span>
                ) : (
                  "Iniciar Sesión"
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
                ¿No tienes cuenta?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-green-600 hover:text-green-700 transition-colors"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center text-xs text-gray-500">
              <p>Tu información está segura y encriptada</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
