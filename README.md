# ☯ I-Ching Clock · Reloj del I Ching

> *"El movimiento del cielo es poderoso. Así el hombre noble se hace fuerte e incansable."*  
> — **Hexagrama 1: Ch'ien (El Creador)**

Una experiencia interactiva y contemplativa que armoniza el transcurso del tiempo con la sabiduría milenaria del **I Ching (易經, El Libro de las Mutaciones)** y el arte clásico del paisaje tradicional chino de tinta y agua (**Shan Shui, 山水**).

---

## 🌟 Características Principales

### 🕰️ Reloj Analógico en Tiempo Real
- Diseño minimalista inspirado en la estética zen y la relojería clásica.
- Segundero rojo lacado que marca el pulso continuo del presente.
- Completamente accesible para lectores de pantalla (`aria-live`, etiquetas semánticas y marcas de tiempo).

### 🔮 Oráculo del I Ching
- Motor de consulta y adivinación que calcula el **Hexagrama Principal**, las **Líneas Cambiantes** y el **Hexagrama Derivado (Muta en)**.
- Base de datos completa con los **64 hexagramas**: nombre, trigrama superior, trigrama inferior, **El Juicio** y **La Imagen**.
- **Tirada inmutable:** Al consultar el oráculo, el hexagrama permanece fijo e inmutable en el historial; cambiar de idioma traduce instantáneamente sus textos sin volver a lanzar la tirada.
- Historial dinámico de consultas con opción de limpieza.

### 🌐 Internacionalización Completa en 14 Idiomas (i18n)
Soporte lingüístico nativo tanto para la interfaz de usuario como para **la totalidad de los 64 hexagramas** en:
- 🇪🇸 **Castellano / Español** (`es`)
- 🌾 **Galego** (`gl`)
- ⛰️ **Euskara** (`eu`)
- 🌊 **Català** (`ca`)
- 🇬🇧 **English** (`en`)
- 🇫🇷 **Français** (`fr`)
- 🇮🇹 **Italiano** (`it`)
- 🇷🇴 **Română** (`ro`)
- 🇵🇹 **Português** (`pt`)
- 🇩🇪 **Deutsch** (`de`)
- 🇬🇷 **Ελληνικά** (`el`)
- 🇳🇱 **Nederlands** (`nl`)
- 🇵🇱 **Polski** (`pl`)
- 🇸🇪 **Svenska** (`sv`)

- **Autodetección inteligente:** Detecta automáticamente el idioma de tu sistema operativo y navegador al primer uso sin llamadas a servidores externos.
- **Persistencia en LocalStorage:** Guarda tu idioma y tema preferido de forma persistente entre sesiones.

### 🎨 Paisaje Procedural Shan-Shui (山水)
- Generación de paisajes procedurales mediante algoritmos matemáticos vectoriales en SVG (montañas lejanas entre brumas, cordilleras escarpadas, pabellones eruditos, pagodas, pinos y barca solitaria).
- Textura táctil que emula el grano del auténtico papel chino *Xuan* (宣紙).
- **Ciclo Yin / Yang (Modos Claro y Oscuro):**
  - **Modo Claro (Yang 陽):** Paisaje diurno en tinta china sobre papel marfil.
  - **Modo Oscuro (Yin 陰):** Paisaje nocturno místico con firmamento estrellado y una **serena luna llena** envuelta en suave aureola de bruma (*Guohua* / 國畫).

---

## 🛠️ Tecnologías y Arquitectura

- **Frontend:** [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Internacionalización:** `i18next`, `react-i18next` e `i18next-browser-languagedetector`
- **Estilos:** CSS puro modular con variables CSS para adaptación de temas e iconografía SVG
- **Pruebas y Calidad:** [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/) con 70+ tests unitarios exhaustivos siguiendo el patrón estricto **AAA (Arrange-Act-Assert)** y pruebas parametrizadas (`it.each`)
- **Linter:** ESLint 9 con soporte para React Hooks v7

---

## 🚀 Instalación y Desarrollo Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/vinjatovix/iching-clock.git
   cd iching-clock
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Ejecutar la suite de pruebas unitarias:**
   ```bash
   npm test
   ```

5. **Construir el proyecto para producción:**
   ```bash
   npm run build
   ```

6. **Verificar el código con ESLint:**
   ```bash
   npm run lint
   ```

---

## 📜 Licencias y Atribuciones

### Licencia del Proyecto
Este proyecto está distribuido bajo la **Licencia MIT**. Consulta el archivo [LICENSE](./LICENSE) para conocer los términos completos.  
Copyright (c) 2026 vinjatovix <vinjadevix@gmail.com>.

### Atribuciones de Terceros
- **Generador de Paisajes Shan-Shui (山水):** El motor procedural de paisajes en tinta está basado e inspirado en la obra de código abierto de **Lingdong Huang** (Copyright © 2018 Lingdong Huang), licenciado bajo la **Licencia MIT**. Puedes consultar los términos originales en [src/components/shanshui/LICENSE](./src/components/shanshui/LICENSE).
- **Motor del I Ching:** Cálculos matemáticos y trigramas basados en la librería `i-ching`.
