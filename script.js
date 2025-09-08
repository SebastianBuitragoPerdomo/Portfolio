document.addEventListener("DOMContentLoaded", () => {
  const scene = document.getElementById("scene");
  const overlay = document.getElementById("overlay");
  const resetBtn = document.getElementById("reset");

  // Centrar inicialmente usando coordenadas en píxeles (para facilitar el arrastre)
  function centerOverlay() {
    const sRect = scene.getBoundingClientRect();
    const oRect = overlay.getBoundingClientRect();
    // calcular posición relativa dentro del contenedor
    const left = (sRect.width - oRect.width) / 2;
    const top = (sRect.height - oRect.height) / 2;
    overlay.style.left = `${left}px`;
    overlay.style.top = `${top}px`;
    overlay.style.transform = ""; // quitar el transform usado en CSS para el centrado inicial
  }

  // Ajustar al tamaño del contenedor en cambio de ventana
  window.addEventListener("resize", () => {
    // mantener overlay dentro de los límites
    keepInBounds();
  });

  // Constrain overlay dentro de scene
  function keepInBounds() {
    const sRect = scene.getBoundingClientRect();
    const oRect = overlay.getBoundingClientRect();
    let left = parseFloat(overlay.style.left || 0);
    let top = parseFloat(overlay.style.top || 0);

    // Si overlay está expresado en % o transform, recenter
    if (Number.isNaN(left) || Number.isNaN(top)) {
      centerOverlay();
      return;
    }

    left = Math.max(0, Math.min(left, sRect.width - oRect.width));
    top = Math.max(0, Math.min(top, sRect.height - oRect.height));
    overlay.style.left = `${left}px`;
    overlay.style.top = `${top}px`;
  }

  // Drag con Pointer Events (soporta ratón y táctil)
  let dragging = false;
  let startX = 0, startY = 0;
  let startLeft = 0, startTop = 0;

  overlay.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    overlay.setPointerCapture(e.pointerId);
    dragging = true;
    overlay.classList.add("dragging");

    const sRect = scene.getBoundingClientRect();
    const oRect = overlay.getBoundingClientRect();

    startX = e.clientX;
    startY = e.clientY;
    // coordenadas actuales relativas al contenedor
    startLeft = oRect.left - sRect.left;
    startTop = oRect.top - sRect.top;
  });

  overlay.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const sRect = scene.getBoundingClientRect();
    const oRect = overlay.getBoundingClientRect();

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    let newLeft = startLeft + dx;
    let newTop = startTop + dy;

    // limitar dentro de los bordes del contenedor
    newLeft = Math.max(0, Math.min(newLeft, sRect.width - oRect.width));
    newTop = Math.max(0, Math.min(newTop, sRect.height - oRect.height));

    overlay.style.left = `${newLeft}px`;
    overlay.style.top = `${newTop}px`;
  });

  overlay.addEventListener("pointerup", (e) => {
    if (!dragging) return;
    dragging = false;
    overlay.classList.remove("dragging");
    try { overlay.releasePointerCapture(e.pointerId); } catch (err) {}
  });

  overlay.addEventListener("pointercancel", () => {
    dragging = false;
    overlay.classList.remove("dragging");
  });

  resetBtn.addEventListener("click", () => {
    centerOverlay();
  });

  // inicializar
  // si la imagen tarda en cargar, centrar al cargar la imagen para obtener medidas correctas
  if (overlay.complete) {
    centerOverlay();
  } else {
    overlay.addEventListener("load", centerOverlay);
  }
});