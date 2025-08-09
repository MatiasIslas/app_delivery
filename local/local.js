document.addEventListener('DOMContentLoaded', () => {
    // --- ESTADO Y DATOS (Idealmente cargados desde una 'db' central) ---
    let mockOrders = [
        { id: 1, client: 'Juan Pérez', status: 'new', items: [{ name: 'Pizza Margherita', qty: 1 }, { name: 'Coca-Cola', qty: 2 }] },
        { id: 2, client: 'Ana Gómez', status: 'new', items: [{ name: 'Tacos al Pastor', qty: 3 }] },
        { id: 3, client: 'Carlos Ruiz', status: 'pending', items: [{ name: 'Hamburguesa Clásica', qty: 1 }] },
        { id: 4, client: 'Sofía Castro', status: 'completed', items: [{ name: 'Combinado de Sushi', qty: 1 }] },
    ];
    let mockProducts = [
        { id: 101, name: 'Pizza Margherita', description: 'Clásica pizza italiana.', price: 12.50, category: 'comida', image: 'https://via.placeholder.com/50' },
        { id: 201, name: 'Hamburguesa Clásica', description: 'Carne de res premium.', price: 10.99, category: 'comida', image: 'https://via.placeholder.com/50' },
        { id: 301, name: 'Coca-Cola', description: 'Bebida refrescante.', price: 2.50, category: 'bebida', image: 'https://via.placeholder.com/50' },
    ];
    let originalOrders = [...mockOrders]; // Para la búsqueda

    // --- SELECTORES DE ELEMENTOS ---
    const plusBtn = document.getElementById('plusBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    // Modales y overlays
    const productModal = document.getElementById('productModal');
    const productListModal = document.getElementById('productListModal');
    const settingsModal = document.getElementById('settingsModal');
    // Botones de menú
    const addProductBtn = document.getElementById('addProductBtn');
    const listProductsBtn = document.getElementById('listProductsBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    // Botones para cerrar modales
    const closeProductModalBtn = document.getElementById('closeProductModalBtn');
    const closeProductListModalBtn = document.getElementById('closeProductListModalBtn');
    const closeSettingsModalBtn = document.getElementById('closeSettingsModalBtn');
    // Columnas de pedidos
    const newOrdersColumn = document.getElementById('newOrdersColumn');
    const pendingOrdersColumn = document.getElementById('pendingOrdersColumn');
    const completedOrdersColumn = document.getElementById('completedOrdersColumn');
    // Contenedores y formularios
    const productListContainer = document.getElementById('productListContainer');
    const productForm = document.getElementById('productForm');
    const settingsForm = document.getElementById('settingsForm'); // **NUEVO**
    const modalTitle = document.getElementById('modalTitle');
    const searchInput = document.querySelector('.local-header .search-input'); // **NUEVO**

    // --- FUNCIONES DE RENDERIZADO ---
    const renderOrders = (ordersToRender = mockOrders) => { // Modificado para aceptar una lista filtrada
        newOrdersColumn.innerHTML = '';
        pendingOrdersColumn.innerHTML = '';
        completedOrdersColumn.innerHTML = '';
        ordersToRender.forEach(order => {
            const orderCard = document.createElement('div');
            orderCard.className = 'order-card';
            orderCard.innerHTML = `
                <h4>Pedido #${order.id} - ${order.client}</h4>
                <ul>${order.items.map(item => `<li>${item.qty}x ${item.name}</li>`).join('')}</ul>
                <div class="order-card-actions">
                    ${order.status === 'new' ? `<button class="btn-primary" data-id="${order.id}" data-action="accept">Aceptar</button>` : ''}
                    ${order.status === 'pending' ? `<button class="btn-primary btn-success" data-id="${order.id}" data-action="complete">Finalizar</button>` : ''}
                </div>`;
            if (order.status === 'new') newOrdersColumn.appendChild(orderCard);
            else if (order.status === 'pending') pendingOrdersColumn.appendChild(orderCard);
            else if (order.status === 'completed') completedOrdersColumn.appendChild(orderCard);
        });
    };
    
    const renderProducts = () => {
        productListContainer.innerHTML = '';
        if (mockProducts.length === 0) {
            productListContainer.innerHTML = '<p>No hay productos agregados.</p>';
            return;
        }
        mockProducts.forEach(product => {
            const item = document.createElement('div');
            item.className = 'product-list-item';
            item.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="product-list-details">
                    <strong>${product.name}</strong>
                    <p>${product.price.toFixed(2)} € - Cat: ${product.category}</p>
                </div>
                <div class="product-list-actions">
                    <button class="edit-btn" data-id="${product.id}"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" data-id="${product.id}"><i class="fas fa-trash"></i></button>
                </div>`;
            productListContainer.appendChild(item);
        });
    };

    // --- MANEJO DE MODALES (CON MEJORA DE UX) ---
    const openModal = (modal) => modal.classList.remove('hidden');
    const closeModal = (modal) => modal.classList.add('hidden');
    
    // **NUEVO**: Cerrar modales al hacer clic en el overlay
    [productModal, productListModal, settingsModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // --- LÓGICA DE EVENTOS ---
    plusBtn.addEventListener('click', () => dropdownMenu.classList.toggle('active'));
    document.addEventListener('click', (e) => {
        if (!plusBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove('active');
        }
    });

    addProductBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modalTitle.textContent = 'Agregar Nuevo Producto';
        productForm.reset();
        productForm.dataset.mode = 'add';
        delete productForm.dataset.editId;
        openModal(productModal);
        dropdownMenu.classList.remove('active');
    });
    listProductsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        renderProducts();
        openModal(productListModal);
        dropdownMenu.classList.remove('active');
    });
    settingsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(settingsModal);
        dropdownMenu.classList.remove('active');
    });
    
    closeProductModalBtn.addEventListener('click', () => closeModal(productModal));
    closeProductListModalBtn.addEventListener('click', () => closeModal(productListModal));
    closeSettingsModalBtn.addEventListener('click', () => closeModal(settingsModal));

    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const productData = {
            name: document.getElementById('productName').value,
            description: document.getElementById('productDescription').value,
            price: parseFloat(document.getElementById('productPrice').value),
            category: document.getElementById('productCategory').value,
            image: 'https://via.placeholder.com/50'
        };
        
        if (productForm.dataset.mode === 'edit') {
            const id = parseInt(productForm.dataset.editId);
            const index = mockProducts.findIndex(p => p.id === id);
            mockProducts[index] = { id, ...productData };
            alert('Producto actualizado con éxito');
        } else {
            productData.id = Date.now();
            mockProducts.push(productData);
            alert('Producto agregado con éxito');
        }
        productForm.reset();
        closeModal(productModal);
    });

    // **NUEVO**: Lógica para guardar los ajustes del local
    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const settingsData = {
            name: document.getElementById('localName').value,
            description: document.getElementById('localDescription').value,
            address: document.getElementById('localAddress').value,
            phone: document.getElementById('localPhone').value,
            hours: document.getElementById('localHours').value,
        };
        // En una app real, guardarías esto en la base de datos. Aquí lo guardamos en localStorage.
        localStorage.setItem('delygo_local_settings', JSON.stringify(settingsData));
        alert('Ajustes guardados con éxito');
        closeModal(settingsModal);
    });
    
    productListContainer.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;
        const id = parseInt(target.dataset.id);
        if (target.classList.contains('delete-btn')) {
            if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
                mockProducts = mockProducts.filter(p => p.id !== id);
                renderProducts();
            }
        } else if (target.classList.contains('edit-btn')) {
            const product = mockProducts.find(p => p.id === id);
            if (product) {
                modalTitle.textContent = 'Editar Producto';
                document.getElementById('productName').value = product.name;
                document.getElementById('productDescription').value = product.description;
                document.getElementById('productPrice').value = product.price;
                document.getElementById('productCategory').value = product.category;
                productForm.dataset.mode = 'edit';
                productForm.dataset.editId = product.id;
                closeModal(productListModal);
                openModal(productModal);
            }
        }
    });

    document.querySelector('.order-board').addEventListener('click', (e) => {
        const target = e.target.closest('button[data-action]');
        if (!target) return;
        const id = parseInt(target.dataset.id);
        const action = target.dataset.action;
        const order = mockOrders.find(o => o.id === id);
        if (order) {
            if (action === 'accept') order.status = 'pending';
            if (action === 'complete') order.status = 'completed';
            renderOrders();
        }
    });

    // **NUEVO**: Lógica para el buscador de pedidos
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        if (searchTerm === '') {
            mockOrders = [...originalOrders];
        } else {
            mockOrders = originalOrders.filter(order => 
                order.client.toLowerCase().includes(searchTerm) ||
                String(order.id).includes(searchTerm)
            );
        }
        renderOrders();
    });

    // --- INICIALIZACIÓN DE LA APP DEL LOCAL ---
    const initLocalApp = () => {
        // La lógica de la sidebar y el tema oscuro se movería a 'common-ui.js'
        renderOrders();

        // **NUEVO**: Cargar ajustes guardados al iniciar
        const savedSettings = JSON.parse(localStorage.getItem('delygo_local_settings'));
        if(savedSettings) {
            document.getElementById('localName').value = savedSettings.name;
            document.getElementById('localDescription').value = savedSettings.description;
            document.getElementById('localAddress').value = savedSettings.address;
            document.getElementById('localPhone').value = savedSettings.phone;
            document.getElementById('localHours').value = savedSettings.hours;
        }
    };

    initLocalApp();
});
