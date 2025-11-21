# 🌐 BirdYi App – Guía de Instalación Rápida

Bienvenido a **BirdYi App**, una aplicación web progresiva (PWA) para la identificación de aves usando inteligencia artificial con TensorFlow.js.

## ⚙️ Requisitos Previos

Asegúrate de tener instalado:

- 🟢 [Node.js](https://nodejs.org/) – Recomendado: v18 o superior
- 🛠️ [Git](https://git-scm.com/)
- 📦 Uno de los siguientes gestores de paquetes:
  - [`pnpm`](https://pnpm.io/) (recomendado) ⭐
  - [`npm`](https://www.npmjs.com/)
  - [`yarn`](https://yarnpkg.com/)

> 💡 Para instalar `pnpm` globalmente:
>
> ```bash
> npm install -g pnpm
> ```

---

## 📥 Paso 1 – Clonar el Repositorio

```bash
git clone https://github.com/RicJim/Bird-App-Nextjs-pwa.git
cd Bird-App-Nextjs-pwa
```

---

## 📦 Paso 2 – Instalar Dependencias

Ejecuta uno de los siguientes comandos según el gestor que utilices:

```bash
pnpm install     # o
npm install      # o
yarn install
```

---

## 🔐 Paso 3 – Configurar Variables de Entorno

Copia el archivo de ejemplo y configura tus credenciales:

```bash
cp .env.local.example .env.local
```

Edita `.env.local` con:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# MongoDB
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/birdbookdb

# Seguridad
NEXT_PUBLIC_JWT_SECRET=$(openssl rand -hex 32)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🚀 Paso 4 – Iniciar el Servidor de Desarrollo

Lanza el entorno local con:

```bash
pnpm dev         # o
npm run dev      # o
yarn dev
```

Luego abre tu navegador en: [http://localhost:3000](http://localhost:3000)

---

## ✨ Características Principales

### 🎨 Interfaz Responsiva

- ✅ Diseño mobile-first (360px a 1920px)
- ✅ Componentes React 19 modernos
- ✅ Tailwind CSS + @heroicons/react
- ✅ Totalmente accesible

### 🔐 Seguridad Enterprise

- ✅ Middleware de Next.js con route protection
- ✅ 13 funciones de seguridad reutilizables
- ✅ Rate limiting en memoria
- ✅ CSRF protection
- ✅ Security headers (CSP, X-Frame-Options, etc)
- ✅ Validación Zod en dos capas
- ✅ Sanitización de entrada y logs

### 🤖 Inteligencia Artificial

- ✅ Predicción de imagen (TensorFlow.js)
- ✅ Predicción de audio (TensorFlow.js)
- ✅ Modelos pre-entrenados optimizados
- ✅ Procesamiento en navegador (sin servidor)

### 📱 Progressive Web App

- ✅ Instalable en dispositivos
- ✅ Funciona offline
- ✅ Service Workers configurados
- ✅ Manifest.json actualizado

### 🗄️ Backend

- ✅ Firebase Authentication
- ✅ MongoDB para almacenamiento
- ✅ API Routes con Next.js
- ✅ Rate limiting por IP/usuario

---

## 🤖 Código para Entrenamiento de Modelos IA

Si deseas entrenar tus propios modelos de inteligencia artificial para la identificación de aves, visita el siguiente repositorio con todo el código y recursos necesarios:

🔗 [Repositorio de Entrenamiento IA]

---

## 📊 Estructura del Proyecto

```
Bird-App-Nextjs-pwa/
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/            # Routes: login, register
│   │   ├── identify/          # Predicciones (imagen/audio)
│   │   ├── gallery/           # Galería de fotos
│   │   └── api/               # API routes
│   ├── components/            # Componentes React reutilizables
│   ├── lib/
│   │   ├── security.ts
│   │   ├── rules.js           # Validación Zod
│   │   └── firebase/          # Configuración Firebase
│   └── services/              # Servicios (TensorFlow.js, auth)
├── middleware.ts
└── public/                    # Static files + modelos ML
```

---

## 🔧 Stack Tecnológico

```
Frontend:
├── Next.js 15 (App Router)
├── React 19
├── TypeScript
├── Tailwind CSS
└── @heroicons/react

Backend:
├── Firebase Authentication
├── Firebase Admin SDK
├── MongoDB 6.16.0
├── Next.js API Routes
└── TensorFlow.js 4.22.0

DevOps:
├── pnpm (package manager)
├── Next.js PWA
├── ESLint
└── TypeScript strict mode
```

---

## 🧩 Scripts Disponibles

| Tarea              | Comando `pnpm` | Comando `npm`   | Comando `yarn` |
| ------------------ | -------------- | --------------- | -------------- |
| Instalar deps      | `pnpm install` | `npm install`   | `yarn install` |
| Iniciar dev server | `pnpm dev`     | `npm run dev`   | `yarn dev`     |
| Build producción   | `pnpm build`   | `npm run build` | `yarn build`   |
| Ejecutar build     | `pnpm start`   | `npm start`     | `yarn start`   |
| Ejecutar linter    | `pnpm lint`    | `npm run lint`  | `yarn lint`    |

## 📝 Contribuir

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

---

## 🐛 Reportar Problemas

Si encuentras bugs o tienes sugerencias, abre un issue en:
https://github.com/RicJim/Bird-App-Nextjs-pwa/issues

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver [LICENSE](./LICENSE)

---

## 👥 Autores

- **Ricardo Jiménez** - Desarrollo principal
- Contribuidores: [Ver aquí](https://github.com/RicJim/Bird-App-Nextjs-pwa/graphs/contributors)

---

## 🎓 Recursos Adicionales

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TensorFlow.js Guide](https://www.tensorflow.org/js)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com)

---

**🎉 ¡Gracias por usar BirdYi App!**

© 2025 – Proyecto BirdYi App
