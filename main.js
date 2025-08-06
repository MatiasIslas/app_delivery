// Esperar a que cargue todo
document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.querySelector(".start-btn");

  // Animación de entrada
  document.querySelector(".welcome-container").classList.add("animate");

  // Si ya entró antes, podemos redirigir directamente a selección de rol
  if (localStorage.getItem("firstVisit") === "false") {
    setTimeout(() => {
      window.location.href = "roles.html"; // o el archivo donde selecciona cliente/restaurante/repartidor
    }, 2000);
  } else {
    localStorage.setItem("firstVisit", "false");
  }

  // Acción al hacer clic en "Empezar"
  startBtn.addEventListener("click", () => {
    startBtn.disabled = true;
    startBtn.textContent = "Cargando...";

    // Efecto de sonido (opcional)
    const audio = new Audio("assets/success.mp3"); // debes agregar tu propio archivo
    audio.volume = 0.4;
    audio.play();

    // Animación de salida y redirección
    setTimeout(() => {
      document.body.classList.add("fade-out");
    }, 300);

    setTimeout(() => {
      window.location.href = "roles.html";
    }, 1200);
  });
});
