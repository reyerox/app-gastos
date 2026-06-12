# ZenGastos Pro 🦭🌻

Una aplicación web progresiva (PWA) de finanzas personales y compartidas para parejas, diseñada bajo un enfoque de **privacidad absoluta** (almacenamiento 100% local, sin servidores ni bases de datos externas) y con una interfaz estética *Fintech Premium* totalmente personalizable.

¡Gestiona tu dinero de forma independiente, mantén las cuentas claras con tu pareja y ahorra para vuestros proyectos de futuro sin ceder tus datos a nadie!

---

## 🚀 Características Principales

* 🔒 **Privacidad del 100% (LocalStorage):** Todo el almacenamiento se realiza de forma estrictamente local en la memoria de tu propio navegador web (`LocalStorage`). No hay servidores intermedios, ni Firebase, ni bases de datos en la nube. Tus datos financieros nunca salen de tu dispositivo.
* 👥 **Gestión Híbrida (Personal vs. Común):** Por defecto, cada registro se crea con la etiqueta `👤 Personal` (para tus propios gastos privados). Con un solo toque, puedes convertirlo en un gasto `🏠 Común` (cenas juntos, alquiler, facturas) para balancearlo con tu pareja.
* ⚖️ **Widget "Cuentas Claras":** Olvídate de hacer cuentas de servilleta a final de mes. La app analiza en tiempo real todos los gastos comunes del mes, suma cuánto ha pagado cada miembro de la pareja (**Dani 🦭** y **Nati 🌻**), calcula el 50% exacto y os muestra de forma gigante y cristalina quién le debe dinero a quién y la cantidad exacta al céntimo.
* 📊 **Análisis del Mes y Balance Gráfico:** Widgets minimalistas construidos con animaciones y CSS nativo que muestran vuestros Ingresos totales, Gastos totales y Balance neto del mes de forma visual sin sobrecargar la interfaz.
* 📈 **Tendencias Mes a Mes (MoM):** Etiquetas de rendimiento financiero inteligente que comparan los gastos e ingresos actuales con los del mes anterior, indicando con un porcentaje dinámico y colores de estado (+/- %) si estáis gastando más o ingresando menos.
* ✨ **Metas con Ahorro Automático Global:** Crea tus objetivos a largo plazo (¡como la meta para vuestra futura **Casa** 🏠!). Al activar la opción "Ahorro Automático", la aplicación calculará en segundo plano vuestro sobrante neto acumulado (histórico de todos los meses) y lo inyectará directamente en la barra de progreso de la meta de forma dinámica.
* 🎨 **Doble Interfaz Estética (Modo Oscuro / Modo Amor):** Cambia el aspecto de la aplicación de forma instantánea con el botón superior. Alterna entre el elegante **Modo Oscuro Premium Fintech** y el cremoso y cálido **Modo Amor** (con una paleta fluida en tonos rosados, lavandas, verdes menta y granates cereza adaptados para una lectura óptima y armónica). El móvil recordará vuestra elección de forma independiente.
* 📱 **Instalable como App Móvil (PWA):** Gracias a la configuración del Manifiesto y su Service Worker (`sw.js`), la web es totalmente progresiva. Puedes darle a "Añadir a la pantalla de inicio" en Chrome o Safari e instalarla en tu smartphone iOS o Android como una app nativa. ¡Arranca al instante y funciona perfectamente sin conexión a Internet!
* 📥 **Exportar e Importar CSV/Excel:** Un escudo de seguridad perfecto. Descarga copias de seguridad mensuales de vuestros movimientos en un archivito CSV legible por Excel, o utilízalo para fusionar y sincronizar los datos de forma manual y segura entre tu móvil y tu ordenador.

---

## 🛠️ Estructura del Proyecto

El proyecto está diseñado de forma ultra ligera y eficiente utilizando librerías modernas cargadas directamente desde CDNs de alta velocidad (sin necesidad de instalar Node.js, npm ni pesadas dependencias de compilación):

* `index.html`: El núcleo de la aplicación. Contiene la estructura base, los estilos avanzados en Tailwind CSS y toda la arquitectura reactiva construida en **React 18** y **Babel**.
* `manifest.json`: El archivo de configuración que le enseña a Android e iOS cómo empaquetar e instalar ZenGastos en la pantalla de inicio de tu smartphone.
* `sw.js`: El Service Worker (motor de caché), encargado de clonar los archivos en el disco duro del móvil para permitir el acceso inmediato sin cobertura de red.
* `icon.png`: El icono visual premium de la app (el diseño de la cartera morada minimalista).

---

## 📦 Instalación y Despliegue en 2 minutos

Al ser una aplicación web estática libre de bases de datos, puedes alojarla de forma **gratuita, privada y para siempre** usando GitHub Pages:

1.  Crea un repositorio público o privado en tu cuenta de GitHub (ejemplo: `app-gastos`).
2.  Sube los 4 archivos del proyecto (`index.html`, `manifest.json`, `sw.js` e `icon.png`) directamente a la rama principal (`main`).
3.  Entra en los **Settings** (Ajustes) de tu repositorio en GitHub web.
4.  En el menú lateral izquierdo, haz clic en **Pages**.
5.  En el apartado *Build and deployment*, bajo *Source*, selecciona **Deploy from a branch**.
6.  Elige la rama **`main`** (o `root`) y haz clic en **Save** (Guardar).
7.  ¡Listo! En un par de minutos, GitHub te dará un enlace seguro `https://tu-usuario.github.io/app-gastos/` desde el cual Dani, Nati o cualquier persona que elijáis podrá abrir e instalar su propia app financiera privada.

---

## 💡 Consejos de Uso para Desarrolladores

* **Forzar Actualizaciones (Caché Testaruda):** Los navegadores móviles y de PC cuidan tanto el Service Worker offline que a veces se resisten a mostrar el código nuevo que subes a GitHub.
    * En **PC:** Usa el refresco fuerte presionando `Shift + F5` o `Ctrl + F5`.
    * En **Móvil:** Cierra la app por completo desde la multitarea de tu teléfono, vuelve a abrirla y repite el proceso. A la segunda/tercera apertura, el Service Worker detectará los cambios de GitHub y actualizará la app sola.
    * **Truco Maestro:** Cada vez que actualices el `index.html`, abre el archivo `sw.js` y cámbiale el número de versión en la primera línea (ej: cambia `zengastos-v2` por `zengastos-v3`). Esto obligará a todos los móviles conectados a actualizarse al instante.
* **Copias de Seguridad:** El borrado agresivo del historial del navegador (cookies y datos de sitios web de Chrome/Brave/Safari) puede limpiar el `LocalStorage`. Adquiere el hábito saludable de pulsar el botón **Exportar** una vez al mes para guardar tu archivito Excel de seguridad.

---
Desarrollado con 🤍 por y para Dani & Nati · ZenGastos Pro
