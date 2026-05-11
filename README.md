# Bot Ofertas ML — WhatsApp

## Estructura del proyecto
```
ofertas-bot/
├── api/
│   └── search.js      ← Servidor seguro (guarda tus credenciales)
├── public/
│   └── index.html     ← La app que usas
└── vercel.json        ← Configuración de Vercel
```

## Cómo subir a GitHub y Vercel

### PASO 1 — Subir a GitHub
1. Ve a github.com → clic en "+" → "New repository"
2. Nombre: `ofertas-bot`
3. Déjalo en **Public**
4. Clic en "Create repository"
5. Sube los 3 archivos (api/search.js, public/index.html, vercel.json)

### PASO 2 — Crear cuenta en Vercel
1. Ve a vercel.com
2. Clic en "Sign Up" → "Continue with GitHub"
3. Autoriza Vercel

### PASO 3 — Conectar tu repo
1. En Vercel → "Add New Project"
2. Selecciona tu repo `ofertas-bot`
3. Clic en "Deploy" (sin cambiar nada)

### PASO 4 — Agregar tus credenciales (LO MÁS IMPORTANTE)
1. En Vercel → tu proyecto → "Settings" → "Environment Variables"
2. Agrega estas dos variables:

| Nombre | Valor |
|--------|-------|
| ML_CLIENT_ID | 4500152024385299 |
| ML_CLIENT_SECRET | (tu client secret de ML Developers) |

3. Clic en "Save"
4. Ve a "Deployments" → clic en los 3 puntos → "Redeploy"

### PASO 5 — Abrir tu app
Vercel te da una URL tipo:
`https://ofertas-bot.vercel.app`

¡Esa es tu app funcionando!

## Notas
- El Client Secret NUNCA aparece en el código — está seguro en Vercel
- Si el token expira, Vercel lo renueva automáticamente
- Puedes usar la app desde cualquier dispositivo con esa URL
