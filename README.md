# ♟️ Quarto

Juego de estrategia para 2 jugadores. 16 piezas únicas con 4 atributos. Alinea 4 que compartan algo en común. El twist: tu rival elige qué pieza juegas.

## 🎮 Mecánica

- 16 piezas con 4 atributos binarios: alta/baja, clara/oscura, redonda/cuadrada, hueca/sólida
- Tablero 4×4
- Turno: colocas la pieza que te dieron + eliges una pieza para el rival
- Victoria: 4 en línea (fila, columna o diagonal) que compartan al menos 1 atributo
- Si colocas la pieza que completa la línea, ganas tú

## 🚀 Stack

- **Astro** + **Svelte 5** + **Tailwind CSS v4**
- **PWA** instalable (landscape forzado en móviles)
- **Web Audio API** para efectos de sonido
- Sin backend, 100% local

## 🧞 Comandos

| Comando                 | Acción                                          |
| :---------------------- | :---------------------------------------------- |
| `npm run dev`           | Servidor local en `localhost:4321`              |
| `npm run dev -- --host` | Servidor accesible desde la red local (celular) |
| `npm run build`         | Build de producción en `./dist/`                |
| `npm run preview`       | Preview del build                               |

## 📱 Deploy a Firebase Hosting

1. Instala Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Inicializa (primera vez):

```bash
firebase init hosting
```

- Directorio público: `dist`
- Single-page app: No
- Overwrite index.html: No

4. Build y deploy:

```bash
npm run build
firebase deploy --only hosting
```

## 📱 PWA

El juego es instalable como app. Al instalarlo desde un navegador con HTTPS:

- Se abre siempre en horizontal (landscape forzado)
- Icono en la pantalla de inicio

### Fullscreen en Android

| Navegador    | Instalación              | Fullscreen | Badge en icono      |
| ------------ | ------------------------ | ---------- | ------------------- |
| Chrome       | ✅                       | ❌         | No                  |
| Brave        | ✅                       | ✅         | Sí (badge de Brave) |
| Opera        | ❌ (solo acceso directo) | —          | —                   |
| Safari (iOS) | ✅                       | ❌         | No                  |

## 📁 Estructura

```
src/
├── components/
│   ├── App.svelte              # Router principal
│   ├── PantallaInicio.svelte   # Pantalla de inicio
│   ├── PantallaSetup.svelte    # Nombres de jugadores
│   ├── Juego.svelte            # Orquestador del juego
│   ├── Tablero.svelte          # Grilla 4×4
│   ├── Pieza.svelte            # Pieza individual
│   └── PiezasDisponibles.svelte # Selector de piezas
├── lib/
│   ├── gameLogic.js            # Lógica del juego
│   └── sfx.js                  # Efectos de sonido
├── styles/
│   └── global.css              # Estilos + fuentes
└── pages/
    └── index.astro             # Página principal
```

## 📄 Licencia

MIT
