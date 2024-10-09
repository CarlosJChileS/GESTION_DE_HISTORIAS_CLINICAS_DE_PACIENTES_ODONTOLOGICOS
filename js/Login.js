const fs = require('fs');
const path = require('path');

// Función para manejar el login
function login(event) {
    event.preventDefault();
    
    const usuario = document.querySelector('input[name="usuario"]').value;
    const password = document.querySelector('input[name="password"]').value;

    // Leer el archivo JSON
    fetch('../data/usuarios.json')
        .then(response => response.json())
        .then(usuarios => {
            const user = usuarios.find(u => u.usuario === usuario && u.password === password);

            if (user) {
                alert("Inicio de sesión exitoso");
                // Redireccionar al menú o página principal
                window.location.href = "Menu.html";
            } else {
                alert("Usuario o contraseña incorrectos");
            }
        })
        .catch(error => console.error('Error al leer el archivo JSON:', error));
}
