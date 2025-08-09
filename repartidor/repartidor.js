document.addEventListener('DOMContentLoaded', () => {
    // --- ESTADO Y DATOS DE EJEMPLO ---
    let isDarkTheme = localStorage.getItem('foodie_darkTheme') === 'true';
    let isAvailable = true;
    let currentJob = null; // Puede ser null, {status: 'offered', ...}, o {status: 'accepted', ...}

    const mockJobOffer = {
      id: 501,
      pickup: { name: 'Pizza Palace', address: 'Av. Siempre Viva 742', phone: '555-1234' },
      dropoff: { client: 'Homero Simpson', address: 'Calle Falsa 123' }
    };

    // --- SELECTORES DE ELEMENTOS ---
    const optionsBtn = document.getElementById('optionsBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const deliveryDetails = document.getElementById('deliveryDetails');
    const deliveryActions = document.getElementById('deliveryActions');
    const availabilityBtn = document.getElementById('availabilityBtn');
    const availabilityText = document.getElementById('availabilityText');

    // --- FUNCIONES DE RENDERIZADO ---
    const renderDeliveryView = () => {
        deliveryDetails.innerHTML = '';
        deliveryActions.innerHTML = '';

        if (currentJob) {
            // Renderizar detalles del pedido
            deliveryDetails.innerHTML = `
                <div class="info-card">
                    <h3><i class="fas fa-store"></i> Retirar en</h3>
                    <p><strong>Local:</strong> ${currentJob.pickup.name}</p>
                    <p><strong>Dirección:</strong> ${currentJob.pickup.address}</p>
                    <p><strong>Teléfono:</strong> ${currentJob.pickup.phone}</p>
                </div>
                <div class="info-card">
                    <h3><i class="fas fa-user"></i> Entregar a</h3>
                    <p><strong>Cliente:</strong> ${currentJob.dropoff.client}</p>
                    <p><strong>Dirección:</strong> ${currentJob.dropoff.address}</p>
                </div>
            `;

            if (currentJob.status === 'offered') {
                // Renderizar botones Aceptar/Rechazar
                deliveryActions.innerHTML = `
                    <div class="action-buttons">
                        <button class="btn btn-reject" data-action="reject">Rechazar</button>
                        <button class="btn btn-accept" data-action="accept">Aceptar</button>
                    </div>
                `;
            } else if (currentJob.status === 'accepted') {
                // Renderizar botones de estado
                deliveryActions.innerHTML = `
                    <div class="status-buttons">
                        <button class="btn" data-action="picking_up"><i class="fas fa-box"></i> Retirando el pedido</button>
                        <button class="btn" data-action="on_way"><i class="fas fa-motorcycle"></i> Pedido en camino</button>
                        <button class="btn" data-action="delivered"><i class="fas fa-check-double"></i> Pedido entregado</button>
                    </div>
                `;
            }

        } else {
            // Renderizar mensaje de espera
            deliveryDetails.innerHTML = `
                <div class="waiting-message">
                    <i class="fas fa-box-open"></i>
                    <h2>Esperando pedidos...</h2>
                    <p>Tu estado es: <strong class="${isAvailable ? 'status-active' : 'status-inactive'}">${isAvailable ? 'Activo' : 'Inactivo'}</strong></p>
                </div>
            `;
        }
    };

    // --- LÓGICA DE LA APLICACIÓN ---
    const handleAction = (e) => {
        const action = e.target.dataset.action;
        if (!action) return;

        switch (action) {
            case 'accept':
                currentJob.status = 'accepted';
                renderDeliveryView();
                break;
            case 'reject':
                alert('Pedido rechazado.');
                currentJob = null;
                renderDeliveryView();
                // Simular que llega otra oferta después de un tiempo
                setTimeout(simulateNewOffer, 5000);
                break;
            case 'picking_up':
            case 'on_way':
            case 'delivered':
                // Desactivar todos los botones de estado y activar el actual
                document.querySelectorAll('.status-buttons .btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');

                if(action === 'delivered') {
                    alert('¡Pedido entregado con éxito!');
                    currentJob = null;
                    renderDeliveryView();
                    setTimeout(simulateNewOffer, 5000);
                }
                break;
        }
    };
    
    const toggleAvailability = () => {
        isAvailable = !isAvailable;
        const icon = availabilityBtn.querySelector('i');
        if (isAvailable) {
            availabilityText.textContent = 'Desactivar';
            icon.className = 'fas fa-toggle-on';
            alert('Ahora estás disponible para recibir pedidos.');
            renderDeliveryView();
        } else {
            availabilityText.textContent = 'Activar';
            icon.className = 'fas fa-toggle-off';
            alert('Te has desactivado. No recibirás nuevos pedidos.');
            if (currentJob && currentJob.status === 'offered') {
                currentJob = null;
            }
            renderDeliveryView();
        }
    };
    
    // Función para simular una nueva oferta de pedido
    const simulateNewOffer = () => {
        if(isAvailable && !currentJob) {
            console.log('Simulando nueva oferta de pedido...');
            currentJob = { ...mockJobOffer, status: 'offered' };
            renderDeliveryView();
        }
    };

    // --- INICIALIZACIÓN Y EVENT LISTENERS ---
    const initRepartidorApp = () => {
        // Tema oscuro/claro
        if (isDarkTheme) {
            document.body.setAttribute('data-theme', 'dark');
            document.getElementById('toggleSwitch').classList.add('active');
        }
        document.getElementById('themeToggle').onclick = () => {
            isDarkTheme = !isDarkTheme;
            document.body.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
            document.getElementById('toggleSwitch').classList.toggle('active', isDarkTheme);
            localStorage.setItem('foodie_darkTheme', isDarkTheme);
        };

        // Sidebar
        document.getElementById('menuBtn').onclick = () => {
            document.getElementById('sidebar').classList.add('active');
            document.getElementById('overlay').classList.add('active');
        };
        document.getElementById('overlay').onclick = () => {
            document.getElementById('sidebar').classList.remove('active');
            document.getElementById('overlay').classList.remove('active');
        };

        // Menú de opciones
        optionsBtn.addEventListener('click', () => dropdownMenu.classList.toggle('active'));
        document.addEventListener('click', (e) => {
            if (!optionsBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('active');
            }
        });

        // Botones de acción del pedido
        deliveryActions.addEventListener('click', handleAction);
        
        // Opciones del dropdown
        availabilityBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleAvailability();
            dropdownMenu.classList.remove('active');
        });
        document.getElementById('historyBtn').addEventListener('click', (e) => {
            e.preventDefault();
            alert('Historial de entregas próximamente disponible.');
            dropdownMenu.classList.remove('active');
        });
        
        // Renderizado inicial
        renderDeliveryView();
        
        // Simular que llega una oferta después de 5 segundos al cargar la página
        setTimeout(simulateNewOffer, 5000);
    };

    initRepartidorApp();
});
