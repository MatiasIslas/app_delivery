// js/login.js

// 1. Importamos las funciones que necesitamos de Firebase
import { auth } from './firebase-init.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    
    // 2. Seleccionamos los elementos del formulario y los NUEVOS botones
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');

    // --- LÓGICA PARA EL BOTÓN DE "INGRESAR" ---
    loginBtn.addEventListener('click', async () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        try {
            // Usamos la función específica para iniciar sesión
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('Inicio de sesión exitoso:', userCredential.user);
            alert(`¡Bienvenido de nuevo, ${userCredential.user.email}!`);
            window.location.href = 'main.html';

        } catch (error) {
            console.error('Error de inicio de sesión:', error.code, error.message);
            // Damos feedback específico al usuario
            if (error.code === 'auth/user-not-found') {
                alert('No se encontró ninguna cuenta con este correo. ¿Quieres registrarte?');
            } else if (error.code === 'auth/wrong-password') {
                alert('La contraseña es incorrecta.');
            } else {
                alert('Ocurrió un error al iniciar sesión: ' + error.message);
            }
        }
    });

    // --- LÓGICA PARA EL BOTÓN DE "REGISTRARSE" ---
    registerBtn.addEventListener('click', async () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            alert('Por favor, completa todos los campos para registrarte.');
            return;
        }
        
        // Firebase requiere contraseñas de al menos 6 caracteres
        if (password.length < 6) {
            alert("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        try {
            // Usamos la función específica para crear un nuevo usuario
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('Registro exitoso:', userCredential.user);
            alert(`¡Cuenta creada! Bienvenido a DelyGo, ${userCredential.user.email}`);
            window.location.href = 'main.html';

        } catch (error) {
            console.error('Error de registro:', error.code, error.message);
            // Damos feedback específico al usuario
            if (error.code === 'auth/email-already-in-use') {
                alert('Este correo electrónico ya está registrado. Intenta iniciar sesión.');
            } else {
                alert('Ocurrió un error al registrar la cuenta: ' + error.message);
            }
        }
    });
    
    // Prevenimos el envío tradicional del formulario, ya que manejamos todo con los botones.
    loginForm.addEventListener('submit', (e) => e.preventDefault());
});
