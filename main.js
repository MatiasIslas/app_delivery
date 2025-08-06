// cliente.js

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;

  // Cargar tema desde localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark");
    themeToggle.checked = true;
  }

  // Cambiar tema
  themeToggle.addEventListener("change", () => {
    if (themeToggle.checked) {
      body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  });

  // Simulación de datos (restaurantes y promociones)
  const promociones = [
    { img: "https://via.placeholder.com/300x200", titulo: "Promo 2x1 Pizza", desc: "Sólo por hoy en Pizzería Don Juan" },
    { img: "https://via.placeholder.com/300x200", titulo: "Descuento 20% Sushi", desc: "Envíos gratis toda la semana" }
  ];

  const menus = [
    { img: "https://via.placeholder.com/300x200", nombre: "Combo Hamburguesa", desc: "Hamburguesa + papas + bebida", precio: "$3500" },
    { img: "https://via.placeholder.com/300x200", nombre: "Pizza Muzzarella", desc: "Grande a la piedra", precio: "$4200" },
    { img: "https://via.placeholder.com/300x200", nombre: "Sushi Box 12 piezas", desc: "Mix clásico y vegetariano", precio: "$5200" },
    { img: "https://via.placeholder.com/300x200", nombre: "Ensalada César", desc: "Con pollo y aderezo casero", precio: "$2800" }
  ];

  // Renderizar tarjetas
  const promoContenedor = document.getElementById("promo-contenedor");
  const menuContenedor = document.getElementById("menu-contenedor");

  promociones.forEach(promo => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${promo.img}" alt="${promo.titulo}">
      <div class="card-content">
        <h3>${promo.titulo}</h3>
        <p>${promo.desc}</p>
      </div>`;
    promoContenedor.appendChild(div);
  });

  menus.forEach(menu => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${menu.img}" alt="${menu.nombre}">
      <div class="card-content">
        <h3>${menu.nombre}</h3>
        <p>${menu.desc}</p>
        <strong>${menu.precio}</strong>
      </div>`;
    menuContenedor.appendChild(div);
  });

  // Filtro y búsqueda (básico)
  const inputBusqueda = document.getElementById("inputBusqueda");
  inputBusqueda.addEventListener("input", (e) => {
    const texto = e.target.value.toLowerCase();
    const cards = menuContenedor.querySelectorAll(".card");
    cards.forEach(card => {
      const contenido = card.innerText.toLowerCase();
      card.style.display = contenido.includes(texto) ? "block" : "none";
    });
  });
});
