// js/main.js

// 1. IMPORTAMOS LOS MÓDULOS DE FIREBASE
import { auth } from './firebase-init.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

// Toda la lógica se inicia una vez que el DOM está cargado
document.addEventListener('DOMContentLoaded', () => {

    // 2. VERIFICAMOS EL ESTADO DE AUTENTICACIÓN DEL USUARIO
    // onAuthStateChanged es un "oyente" que se ejecuta cada vez que el estado de login cambia.
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Si el objeto 'user' existe, significa que el usuario ha iniciado sesión.
            console.log('Usuario autenticado:', user.email);
            // Ejecutamos la lógica principal de la aplicación.
            initApp(user); 
        } else {
            // Si 'user' es null, el usuario no ha iniciado sesión.
            console.log('No hay usuario. Redirigiendo al login.');
            // Lo redirigimos a la página de login para que no pueda acceder al contenido.
            window.location.href = 'login.html';
        }
    });
});

// 3. ENCAPSULAMOS TODA LA LÓGICA DE LA APP EN UNA FUNCIÓN
// Esta función solo se llamará después de que Firebase haya verificado que el usuario está logueado.
function initApp(user) {
    
    // --- SECCIÓN DE DATOS Y ESTADO DE LA APP ---
    // (En el próximo paso, moveremos 'restaurants' desde aquí hacia la base de datos de Firestore)
    const restaurants = [
        { id: 1, name: "Pizza Palace", type: "Pizzería Italiana", rating: 4.8, reviews: 245, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop", specialties: ["Margherita", "Pepperoni", "Cuatro Quesos"], deliveryTime: "25-35 min", deliveryTimeMinutes: 30, deliveryFee: 2.50, category: "pizza", menu: [
            { dishId: 101, name: "Pizza Margherita", description: "Clásica pizza con salsa de tomate San Marzano, mozzarella fresca, albahaca y aceite de oliva virgen extra.", price: 12.50, image: "https://images.unsplash.com/photo-1604382354936-07c5d9983d34?w=400&h=300&fit=crop", prepTime: 15 }
        ]},
        { id: 2, name: "Burger House", type: "Comida Rápida Gourmet", rating: 4.6, reviews: 189, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop", specialties: ["Classic", "BBQ Bacon", "Veggie"], deliveryTime: "20-30 min", deliveryTimeMinutes: 25, deliveryFee: 2.00, category: "burger", menu: [
            { dishId: 201, name: "Hamburguesa Clásica", description: "Carne de res premium, queso cheddar, lechuga, tomate, cebolla y nuestra salsa secreta en pan brioche.", price: 10.99, image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop", prepTime: 10 }
        ]},
        { id: 3, name: "Sushi Zen", type: "Restaurante Japonés", rating: 4.9, reviews: 312, image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop", specialties: ["Sashimi", "Maki", "Tempura"], deliveryTime: "35-45 min", deliveryTimeMinutes: 40, deliveryFee: 3.50, category: "sushi", menu: [
            { dishId: 301, name: "Combinado de Sushi", description: "Selección de 16 piezas del chef, incluyendo nigiris y makis variados con pescado fresco del día.", price: 22.00, image: "https://images.unsplash.com/photo-1592891398299-a416a216e919?w=400&h=300&fit=crop", prepTime: 20 }
        ]},
        { id: 4, name: "Tacos Locos", type: "Cocina Mexicana", rating: 4.7, reviews: 156, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop", specialties: ["Tacos al Pastor", "Quesadillas", "Burritos"], deliveryTime: "20-30 min", deliveryTimeMinutes: 25, deliveryFee: 2.20, category: "mexican", menu: [
             { dishId: 401, name: "Tacos al Pastor (3 uds)", description: "Tradicionales tacos de cerdo marinado en achiote, servidos con piña, cebolla y cilantro en tortillas de maíz.", price: 9.50, image: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=400&h=300&fit=crop", prepTime: 12 }
        ]}
    ];

    // Variables de estado de la aplicación
    let favorites = JSON.parse(localStorage.getItem('foodie_favorites')) || [];
    let cartItems = JSON.parse(localStorage.getItem('foodie_cartItems')) || [];
    let currentFilter = 'all';
    let isDarkTheme = localStorage.getItem('foodie_darkTheme') === 'true';

    // Selectores del DOM
    const restaurantsGrid = document.getElementById('restaurantsGrid');
    const cartCountEl = document.getElementById('cartCount');
    const productDetailScreen = document.getElementById('productDetailScreen');
    const cartScreen = document.getElementById('cartScreen');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    // --- FUNCIONES PRINCIPALES DE LA APP (sin cambios) ---
    // Aquí se mantienen tus funciones: generateStars, showNotification, renderRestaurants, etc.
    // Pegamos el resto de las funciones aquí sin modificarlas por ahora.
    
    function generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) stars += '<i class="fas fa-star star"></i>';
            else if (i - 0.5 <= rating) stars += '<i class="fas fa-star-half-alt star"></i>';
            else stars += '<i class="far fa-star star"></i>';
        }
        return stars;
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        if (type === 'error') notification.style.background = 'var(--danger-color)';
        else if (type === 'info') notification.style.background = 'var(--info-color)';
        else notification.style.background = 'var(--success-color)';
        notification.innerHTML = message;
        document.body.appendChild(notification);
        notification.classList.add('show');
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    function saveAndNotify(message, type) {
        localStorage.setItem('foodie_cartItems', JSON.stringify(cartItems));
        updateCartCount();
        showNotification(message, type);
    }
    
    function renderRestaurants(restaurantList = restaurants) {
        const createSkeletonCard = () => {
            const skeleton = document.createElement('div');
            skeleton.className = 'skeleton-card';
            skeleton.innerHTML = `<div class="skeleton-image"></div><div class="skeleton-content"><div class="skeleton-line medium"></div><div class="skeleton-line short"></div></div>`;
            return skeleton;
        };
        restaurantsGrid.innerHTML = '';
        for (let i = 0; i < 6; i++) {
            restaurantsGrid.appendChild(createSkeletonCard());
        }
        setTimeout(() => {
            restaurantsGrid.innerHTML = '';
            let filteredList = restaurantList;
            if (restaurantList === restaurants && currentFilter !== 'all') {
                filteredList = restaurants.filter(r => r.category === currentFilter);
            }
            if (filteredList.length === 0) {
                restaurantsGrid.innerHTML = `<p>No se encontraron restaurantes para el filtro seleccionado.</p>`;
                return;
            }
            filteredList.forEach((r, index) => {
                const card = document.createElement('div');
                card.className = 'restaurant-card';
                card.dataset.id = r.id;
                card.style.animation = `fadeInUp 0.5s ease-out forwards`;
                card.style.animationDelay = `${index * 60}ms`;
                card.innerHTML = `<img src="${r.image}" alt="${r.name}" class="card-image" loading="lazy"><div class="card-content"><h3 class="restaurant-name">${r.name}</h3><p class="restaurant-type">${r.type}</p><div class="rating"><div class="stars">${generateStars(r.rating)}</div><span class="rating-text">${r.rating} (${r.reviews} reseñas)</span></div><div class="specialties">${r.specialties.map(s => `<span class="specialty-tag">${s}</span>`).join('')}</div><div class="card-footer"><span class="delivery-info"><i class="fas fa-clock"></i> ${r.deliveryTime}</span><button class="favorite-btn ${favorites.includes(r.id) ? 'active' : ''}" data-id="${r.id}"><i class="fas fa-heart"></i></button></div></div>`;
                card.addEventListener('click', (e) => {
                    if (e.target.closest('.favorite-btn')) {
                        toggleFavorite(r.id, e.target.closest('.favorite-btn'));
                    } else {
                        showProductDetail(r.id);
                    }
                });
                restaurantsGrid.appendChild(card);
            });
        }, 500);
    }
    
    function hideProductDetail() {
        productDetailScreen.classList.remove('active');
        document.body.classList.remove('body-no-scroll');
    }

    function showProductDetail(restaurantId) {
        const restaurant = restaurants.find(r => r.id === restaurantId);
        if (!restaurant || !restaurant.menu || restaurant.menu.length === 0) return;
        const dish = restaurant.menu[0];
        let quantity = 1;
        const now = new Date();
        const arrivalTime = new Date(now.getTime() + (dish.prepTime + restaurant.deliveryTimeMinutes) * 60000);
        const arrivalTimeString = arrivalTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        const isInCart = cartItems.some(item => item.dishId === dish.dishId);

        productDetailScreen.innerHTML = `<div class="detail-header"><button class="back-btn" id="detailBackBtn"><i class="fas fa-arrow-left"></i></button></div><div class="detail-content"><img src="${dish.image}" alt="${dish.name}" class="detail-image"><div style="margin-bottom: 1rem; border-bottom: 1px solid var(--gray-200); padding-bottom: 1rem;"><p style="font-weight: 600; font-size: 1.1rem;">Vendido por: <span style="color: var(--primary-color);">${restaurant.name}</span></p><div class="rating" style="margin-top: 0.5rem;"><div class="stars">${generateStars(restaurant.rating)}</div><span class="rating-text">${restaurant.rating} (${restaurant.reviews} reseñas del restaurante)</span></div></div><h2 class="detail-title">${dish.name}</h2><p class="detail-description">${dish.description}</p><div class="rating" style="margin-bottom: 1.5rem;"><div class="stars">${generateStars(4.5)}</div><span class="rating-text">4.5 (32 reseñas del plato)</span></div><div class="detail-info-grid"><div class="info-item"><i class="fas fa-utensils"></i><h4>Preparación</h4><p>${dish.prepTime} min</p></div><div class="info-item"><i class="fas fa-motorcycle"></i><h4>Llegada Aprox.</h4><p>${arrivalTimeString}</p></div></div><div class="quantity-selector"><button class="quantity-btn" id="decreaseQtyBtn" aria-label="Disminuir cantidad">-</button><span class="quantity-display" id="quantityDisplay">${quantity}</span><button class="quantity-btn" id="increaseQtyBtn" aria-label="Aumentar cantidad">+</button></div><div class="pickup-option"><i class="fas fa-store"></i> También disponible para retiro en local</div></div><div class="detail-footer"><div style="text-align: right; margin-bottom: 1rem;"><p>Costo del delivery: <strong>${restaurant.deliveryFee.toFixed(2)} €</strong></p></div><button class="add-to-cart-btn ${isInCart ? 'in-cart' : ''}" id="addToCartBtn" ${isInCart ? 'disabled' : ''}><span>${isInCart ? 'En tu pedido' : 'Agregar al pedido'}</span><span id="totalPriceDisplay">${(dish.price * quantity).toFixed(2)} €</span></button></div>`;

        productDetailScreen.classList.add('active');
        document.body.classList.add('body-no-scroll');

        document.getElementById('detailBackBtn').onclick = hideProductDetail;
        const qtyDisplay = document.getElementById('quantityDisplay');
        const priceEl = document.getElementById('totalPriceDisplay');
        const updatePrice = () => priceEl.textContent = `${(dish.price * quantity).toFixed(2)} €`;

        document.getElementById('increaseQtyBtn').onclick = () => {
            quantity++;
            qtyDisplay.textContent = quantity;
            updatePrice();
        };
        document.getElementById('decreaseQtyBtn').onclick = () => {
            if (quantity > 1) {
                quantity--;
                qtyDisplay.textContent = quantity;
                updatePrice();
            }
        };
        if (!isInCart) {
            document.getElementById('addToCartBtn').onclick = () => {
                addToCart(dish, restaurant, quantity);
                hideProductDetail();
            };
        }
    }

    function renderCart() {
        const cartContent = document.getElementById('cartContent');
        const cartFooter = document.getElementById('cartFooter');
        if (cartItems.length === 0) {
            cartContent.innerHTML = `<div class="empty-cart"><i class="fas fa-shopping-cart"></i><h3>Tu pedido está vacío</h3></div>`;
            cartFooter.innerHTML = '';
            return;
        }
        let subtotal = 0;
        let highestDeliveryFee = 0;
        const restaurantIdsInCart = [...new Set(cartItems.map(item => item.restaurantId))];
        restaurantIdsInCart.forEach(id => {
            const restaurant = restaurants.find(r => r.id === id);
            if (restaurant && restaurant.deliveryFee > highestDeliveryFee) {
                highestDeliveryFee = restaurant.deliveryFee;
            }
        });
        cartContent.innerHTML = cartItems.map(item => {
            subtotal += item.price * item.quantity;
            return `<div class="cart-item" data-id="${item.dishId}"><img src="${item.image}" alt="${item.name}" class="cart-item-image"><div class="cart-item-details"><p class="cart-item-name">${item.name}</p><p class="cart-item-price">${item.quantity} x ${item.price.toFixed(2)} €</p></div><div class="cart-item-actions"><button class="remove-item-btn"><i class="fas fa-trash-alt"></i></button></div></div>`;
        }).join('');

        const total = subtotal + highestDeliveryFee;
        const userData = JSON.parse(localStorage.getItem('foodie_user_data'));
        const areUserDataComplete = userData && userData.name && userData.address;

        cartFooter.innerHTML = `<div class="summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)} €</span></div><div class="summary-row"><span>Envío</span><span>${highestDeliveryFee.toFixed(2)} €</span></div><div class="payment-methods" style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--gray-200);"><p style="font-weight: 600; margin-bottom: 0.5rem;">Forma de Pago</p><p style="color: var(--gray-600);"><i class="fas fa-money-bill-wave"></i> Pago en efectivo al recibir.</p><p style="color: var(--gray-400); font-size: 0.8rem;">(Próximamente más opciones de pago)</p></div><div class="summary-row total"><span>Total</span><span>${total.toFixed(2)} €</span></div><button class="checkout-btn" id="delyGoBtn" ${!areUserDataComplete ? 'disabled' : ''}>DelyGo</button>${!areUserDataComplete ? `<p style="color: var(--danger-color); font-size: 0.8rem; text-align: center; margin-top: 0.5rem;">Completa tus datos en "Mi Cuenta" para poder finalizar la compra.</p>` : ''}`;
        
        document.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.onclick = () => removeFromCart(parseInt(btn.closest('.cart-item').dataset.id));
        });

        const delyGoBtn = document.getElementById('delyGoBtn');
        if (delyGoBtn && areUserDataComplete) {
            delyGoBtn.addEventListener('click', () => {
                alert('¡Pedido realizado con éxito! Gracias por usar DelyGo.');
                cartItems = [];
                saveAndNotify('Pedido completado', 'success');
                renderCart();
                cartScreen.classList.remove('active');
                document.body.classList.remove('body-no-scroll');
            });
        }
    }

    function addToCart(dish, restaurant, quantity) {
        const existingItem = cartItems.find(item => item.dishId === dish.dishId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cartItems.push({ dishId: dish.dishId, restaurantId: restaurant.id, name: dish.name, price: dish.price, image: dish.image, quantity: quantity });
        }
        saveAndNotify('¡Plato añadido!', 'success');
    }

    function removeFromCart(dishId) {
        cartItems = cartItems.filter(item => item.dishId !== dishId);
        saveAndNotify('Plato eliminado', 'info');
        renderCart();
    }
    
    function updateCartCount() {
        const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCountEl.textContent = count;
        cartCountEl.style.display = count > 0 ? 'flex' : 'none';
    }

    function toggleFavorite(id, btn) {
        const index = favorites.indexOf(id);
        if (index > -1) {
            favorites.splice(index, 1);
            btn.classList.remove('active');
        } else {
            favorites.push(id);
            btn.classList.add('active');
        }
        localStorage.setItem('foodie_favorites', JSON.stringify(favorites));
    }

    function toggleTheme() {
        isDarkTheme = !isDarkTheme;
        document.body.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
        document.getElementById('toggleSwitch').classList.toggle('active', isDarkTheme);
        localStorage.setItem('foodie_darkTheme', isDarkTheme);
    }
    
    // --- SECCIÓN DE INICIALIZACIÓN Y EVENT LISTENERS ---
    
    // Restaurar el tema (claro/oscuro) desde localStorage
    if (isDarkTheme) {
        document.body.setAttribute('data-theme', 'dark');
        document.getElementById('toggleSwitch').classList.add('active');
    }
    
    // Renderizado inicial de la UI
    renderRestaurants();
    updateCartCount();

    // -- Event Listeners para la UI principal --
    document.getElementById('menuBtn').onclick = () => {
        sidebar.classList.add('active');
        overlay.classList.add('active');
    };
    overlay.onclick = () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    };
    document.getElementById('themeToggle').onclick = toggleTheme;
    
    document.getElementById('searchInput').oninput = (e) => {
        const term = e.target.value.toLowerCase();
        const results = restaurants.filter(r => r.name.toLowerCase().includes(term) || r.type.toLowerCase().includes(term) || r.specialties.some(s => s.toLowerCase().includes(term)));
        renderRestaurants(results);
    };
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.filter-btn.active').classList.remove('active');
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderRestaurants();
        };
    });
    
    document.getElementById('cartBtn').onclick = () => {
        renderCart();
        cartScreen.classList.add('active');
        document.body.classList.add('body-no-scroll');
    };
    
    document.querySelector('#cartScreen .back-btn').onclick = () => {
        cartScreen.classList.remove('active');
        document.body.classList.remove('body-no-scroll');
    };

    // -- Event Listeners para la Sidebar --
    document.getElementById('accountLink').onclick = (e) => { e.preventDefault(); window.location.href = 'account.html'; };
    document.getElementById('localLink').onclick = (e) => { e.preventDefault(); window.location.href = 'local_login.html'; };
    document.getElementById('deliveryLink').onclick = (e) => { e.preventDefault(); window.location.href = 'repartidor_login.html'; };
    document.getElementById('favoritesLink').onclick = (e) => { e.preventDefault(); showNotification('Función de favoritos próximamente', 'info'); };
    
    // 4. AÑADIMOS LA FUNCIÓN DE CERRAR SESIÓN
    // Para que esto funcione, es ideal tener un enlace en main.html como este:
    // <li><a href="#" id="signOutLink"><i class="fas fa-sign-out-alt"></i> Cerrar Sesión</a></li>
    // Como no lo tenemos, lo creamos y añadimos dinámicamente para que no tengas que editar el HTML.
    if (!document.getElementById('signOutLink')) {
        const signOutLi = document.createElement('li');
        signOutLi.innerHTML = `<a href="#" id="signOutLink"><i class="fas fa-sign-out-alt"></i> Cerrar Sesión</a>`;
        document.querySelector('.sidebar-menu').appendChild(signOutLi);
    }
    
    document.getElementById('signOutLink').addEventListener('click', (e) => {
        e.preventDefault();
        
        signOut(auth).then(() => {
            // Cierre de sesión exitoso.
            console.log('Usuario cerró la sesión.');
            // El 'listener' onAuthStateChanged detectará el cambio y redirigirá automáticamente.
        }).catch((error) => {
            // Ocurrió un error.
            console.error('Error al cerrar sesión:', error);
            alert('No se pudo cerrar la sesión.');
        });
    });
}
