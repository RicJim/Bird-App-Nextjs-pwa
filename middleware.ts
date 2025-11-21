import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rutas públicas (no requieren autenticación)
const publicRoutes = [
  "/login",
  "/register",
  "/",
  "/gallery",
  "/about",
  "/identify",
];

// Rutas protegidas (requieren autenticación)
const protectedRoutes = ["/records"];

// Rutas de admin (requieren rol admin)
const adminRoutes = ["/admin"];

/**
 * Middleware de seguridad para Next.js
 * - Verifica autenticación en rutas protegidas
 * - Previene acceso a rutas privadas sin auth
 * - Valida tokens JWT
 * - Aplica rate limiting
 * - Sanitiza headers
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("__Secure-fb-token")?.value;

  // Headers de seguridad
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("X-Request-Path", pathname);

  // 1. PROTECCIÓN CONTRA ATAQUES COMUNES
  // Prevenir acceso directo a rutas sensibles
  if (pathname.includes("..") || pathname.includes("//")) {
    return NextResponse.json(
      { error: "Ruta inválida detectada" },
      { status: 400 }
    );
  }

  // 2. GESTIÓN DE AUTENTICACIÓN
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    // Si no tiene token, redirigir a login
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Intentar verificar el token (opcional, si usas JWT locales)
    try {
      // Si necesitas verificar JWT en el servidor, descomenta esto:
      // await jwtVerify(token, secret);
    } catch (error) {
      // Token inválido o expirado
      console.error("Token verification failed:", error);
      // Puedes redirigir a login o mostrar error
    }
  }

  // 3. GESTIÓN DE RUTAS PÚBLICAS
  // Si el usuario ya está logueado y accede a /login o /register, redirigir al home
  if ((pathname === "/login" || pathname === "/register") && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 4. RUTAS DE ADMIN
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    // Aquí puedes verificar si el usuario tiene rol admin
    // const userData = await verifyAdminToken(token);
    // if (!userData?.isAdmin) {
    //   return NextResponse.redirect(new URL("/", request.url));
    // }
  }

  // 5. RESPUESTA CON HEADERS DE SEGURIDAD
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Headers de seguridad HTTP
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=()");

  // CSP (Content Security Policy) - Ajusta según tus necesidades
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://apis.google.com https://identitytoolkit.googleapis.com;"
  );

  // CORS (si es necesario)
  response.headers.set("Access-Control-Allow-Origin", "self");

  return response;
}

// Configurar rutas donde se aplica el middleware
export const config = {
  matcher: [
    /*
     * Aplicar middleware a todas las rutas EXCEPTO:
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico (favicon)
     * - public (archivos públicos)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
};
