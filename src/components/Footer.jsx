export default function Footer() {
  return (
    <footer className="bg-green-800 text-white py-6">
      <div className="container mx-auto text-center space-y-4">
        <p>
          &copy; {new Date().getFullYear()} BirdApp. Todos los
          derechosreservados.
        </p>
        <p className="text-xs text-green-300">Diseñado por Atychís</p>
      </div>
    </footer>
  );
}
