// js/account.js

import { auth } from './firebase-init.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Usuario autenticado, ejecutamos la lógica de la página de cuenta
            console.log("Acceso a cuenta autorizado para:", user.uid);
            initAccountPage(user); // Pasamos el objeto 'user'
        } else {
            // No hay usuario, lo expulsamos a login.html
            window.location.href = 'login.html';
        }
    });
});

function initAccountPage(user) {
    const accountForm = document.getElementById('accountForm');
    
    // --- Cargar Datos Existentes (Próximamente desde Firestore) ---
    // Por ahora, seguimos usando localStorage para los datos del perfil
    const existingData = JSON.parse(localStorage.getItem('foodie_user_data'));
    if (existingData) {
        document.getElementById('name').value = existingData.name || '';
        document.getElementById('phone').value = existingData.phone || '';
        document.getElementById('address').value = existingData.address || '';
    }

    // --- Guardar Datos ---
    accountForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const userData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
        };

        // Guardamos este objeto en localStorage. 
        // En el siguiente paso lo guardaremos en Firestore asociado al user.uid
        localStorage.setItem('foodie_user_data', JSON.stringify(userData));
        
        alert('¡Tus datos han sido guardados con éxito!');
        window.location.href = 'main.html';
    });
}
