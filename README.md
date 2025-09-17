
# 📱 SMS CloudMX Platform

Una plataforma completa de gestión de campañas SMS con módulos avanzados de listas de contactos y segmentación.

## 🚀 Características Principales

### 📋 **Módulo de Listas de Contactos**
- ✅ Creación y gestión de listas personalizadas
- ✅ Segmentación automática de contactos
- ✅ Filtros avanzados por criterios múltiples
- ✅ Listas dinámicas con actualización automática
- ✅ Gestión de suscripciones y opt-out
- ✅ Importación masiva de contactos
- ✅ Estadísticas detalladas por lista

### 📤 **Módulo de Campañas SMS**
- ✅ Creación de campañas personalizadas
- ✅ Programación de envíos
- ✅ Plantillas de mensajes
- ✅ Vista previa antes del envío
- ✅ Seguimiento en tiempo real
- ✅ Estadísticas de entrega y respuesta
- ✅ Gestión de créditos SMS

### 🎯 **Segmentación Avanzada**
- ✅ Filtrado por ubicación geográfica
- ✅ Segmentación por fecha de registro
- ✅ Filtros por actividad del usuario
- ✅ Criterios personalizados
- ✅ Combinación de múltiples filtros

## 🛠️ Tecnologías Utilizadas

- **Frontend:** Next.js 14, React 18, TypeScript
- **Backend:** Next.js API Routes, Prisma ORM
- **Base de Datos:** PostgreSQL
- **Autenticación:** NextAuth.js
- **UI:** Tailwind CSS, Radix UI, Shadcn/ui
- **Estado:** Zustand, React Query
- **Formularios:** React Hook Form + Zod
- **Notificaciones:** React Hot Toast

## 📦 Instalación

### Prerrequisitos
- Node.js 18+
- PostgreSQL
- Yarn package manager

### 1. Clonar el repositorio
```bash
git clone https://github.com/qhosting/sms.git
cd sms
```

### 2. Instalar dependencias
```bash
yarn install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env.local
```
Edita `.env.local` con tus configuraciones:
- `DATABASE_URL`: Conexión a PostgreSQL
- `NEXTAUTH_URL`: URL de tu aplicación
- `NEXTAUTH_SECRET`: Clave secreta para NextAuth
- Otras variables según necesidades

### 4. Configurar la base de datos
```bash
# Generar cliente Prisma
yarn prisma generate

# Ejecutar migraciones
yarn prisma db push

# (Opcional) Poblar con datos de ejemplo
yarn prisma db seed
```

### 5. Ejecutar en desarrollo
```bash
yarn dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🏗️ Estructura del Proyecto

```
├── app/
│   ├── api/                    # API Routes
│   │   └── dashboard/
│   │       ├── campaigns/      # APIs de campañas
│   │       └── lists/          # APIs de listas
│   ├── dashboard/              # Páginas del dashboard
│   │   ├── campaigns/          # Módulo de campañas
│   │   └── lists/              # Módulo de listas
│   └── components/             # Componentes globales
├── lib/                        # Utilidades y configuración
├── prisma/                     # Schema y migraciones
├── public/                     # Archivos estáticos
└── types/                      # Definiciones de TypeScript
```

## 📊 Base de Datos

### Modelos Principales
- `User`: Usuarios del sistema
- `Contact`: Contactos individuales
- `ContactList`: Listas de contactos
- `Campaign`: Campañas de SMS
- `Message`: Mensajes individuales enviados

### Relaciones
- Un usuario puede tener múltiples listas y campañas
- Una lista puede contener múltiples contactos
- Una campaña puede enviar mensajes a múltiples contactos
- Soporte para suscripciones y opt-out por lista

## 🔧 APIs Disponibles

### Listas de Contactos
- `GET /api/dashboard/lists` - Obtener todas las listas
- `POST /api/dashboard/lists` - Crear nueva lista
- `GET /api/dashboard/lists/[id]` - Obtener lista específica
- `PUT /api/dashboard/lists/[id]` - Actualizar lista
- `DELETE /api/dashboard/lists/[id]` - Eliminar lista
- `POST /api/dashboard/lists/[id]/contacts` - Gestionar contactos de la lista
- `POST /api/dashboard/lists/segment` - Aplicar segmentación

### Campañas
- `GET /api/dashboard/campaigns` - Obtener todas las campañas
- `POST /api/dashboard/campaigns` - Crear nueva campaña
- `GET /api/dashboard/campaigns/[id]` - Obtener campaña específica
- `PUT /api/dashboard/campaigns/[id]` - Actualizar campaña
- `POST /api/dashboard/campaigns/[id]/send` - Enviar campaña

## 🎨 Componentes UI

La aplicación utiliza un sistema de componentes reutilizables basado en:
- **Shadcn/ui**: Componentes base accesibles
- **Radix UI**: Primitivos de UI
- **Tailwind CSS**: Estilos utilitarios
- **Lucide React**: Iconos

### Componentes Principales
- `ListsTable`: Tabla de listas con filtros y acciones
- `ListCreationForm`: Formulario de creación de listas
- `CampaignForm`: Formulario de creación de campañas
- `StatsCards`: Tarjetas de estadísticas
- `ContactsManager`: Gestor de contactos

## 🚀 Despliegue

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel
```

### Docker
```bash
# Construir imagen
docker build -t sms-cloudmx .

# Ejecutar contenedor
docker run -p 3000:3000 sms-cloudmx
```

## 🔒 Seguridad

- ✅ Autenticación con NextAuth.js
- ✅ Validación de datos con Zod
- ✅ Sanitización de entradas
- ✅ Protección CSRF
- ✅ Headers de seguridad configurados
- ✅ Variables de entorno para credenciales

## 📈 Funcionalidades Avanzadas

### Segmentación Inteligente
- Filtros dinámicos por múltiples criterios
- Combinación lógica de condiciones (AND/OR)
- Previsualización de segmentos antes de aplicar
- Guardado de criterios de segmentación

### Gestión de Suscripciones
- Sistema completo de opt-in/opt-out
- Respeto a preferencias de contacto
- Historial de cambios de suscripción
- Compliance con regulaciones de marketing

### Analytics y Reportes
- Métricas detalladas por campaña y lista
- Tasas de entrega, apertura y respuesta
- Gráficos interactivos de rendimiento
- Exportación de reportes

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Para soporte técnico o consultas:
- 📧 Email: soporte@smscloudmx.com
- 📱 WhatsApp: +1 (555) 123-4567
- 💬 Discord: [SMS CloudMX Community](https://discord.gg/smscloudmx)

## 🗺️ Roadmap

### 🚧 Próximas Funcionalidades
- [ ] Integración con múltiples proveedores SMS
- [ ] Sistema de plantillas avanzado
- [ ] API REST completa para integraciones
- [ ] Dashboard de analytics avanzado
- [ ] Soporte para MMS y RCS
- [ ] Integración con CRM externos
- [ ] Sistema de webhooks
- [ ] Aplicación móvil

---

Desarrollado con ❤️ para la gestión profesional de campañas SMS.
