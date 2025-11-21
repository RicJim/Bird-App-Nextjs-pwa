"use client";

export function SkeletonCard() {
  return (
    <div className="bg-green-50 p-6 rounded-lg shadow-md animate-pulse">
      <div className="flex flex-col items-center">
        <div className="w-52 h-52 mb-4 rounded-full bg-gray-300 shadow-md border-4 border-green-200" />

        <div className="w-3/4 h-6 bg-gray-300 rounded-md mb-4" />

        <div className="w-1/2 h-4 bg-gray-300 rounded-md mb-6" />

        <div className="w-40 h-10 bg-gray-300 rounded-lg" />
      </div>
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center">
      <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
    </div>
  );
}

export function BouncingDots() {
  return (
    <div className="flex justify-center items-center space-x-2">
      <div
        className="w-3 h-3 bg-green-600 rounded-full animate-bounce"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="w-3 h-3 bg-green-600 rounded-full animate-bounce"
        style={{ animationDelay: "0.1s" }}
      />
      <div
        className="w-3 h-3 bg-green-600 rounded-full animate-bounce"
        style={{ animationDelay: "0.2s" }}
      />
    </div>
  );
}

export function LoadingState({ title = "Cargando...", cardCount = 4 }) {
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
        {title}
      </h2>

      <div className="flex flex-col items-center justify-center min-h-96 space-y-8">
        <BouncingDots />

        <p className="text-gray-600 text-lg">Cargando registros...</p>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {Array.from({ length: cardCount }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function EmptyState({
  emoji = "📭",
  title = "No hay registros disponibles",
  subtitle = "Comienza identificando aves para crear registros.",
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-96">
      <div className="text-6xl mb-4">{emoji}</div>
      <p className="text-center text-gray-600 text-lg">{title}</p>
      <p className="text-center text-gray-500 text-sm mt-2">{subtitle}</p>
    </div>
  );
}

export function ErrorState({
  message = "Algo salió mal. Intenta más tarde.",
  onRetry = null,
}) {
  return (
    <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 text-center">
      <p className="text-red-700 font-semibold text-lg mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Intentar de nuevo
        </button>
      )}
    </div>
  );
}

export function ProgressBar({ percentage = 0 }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
      <div
        className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
