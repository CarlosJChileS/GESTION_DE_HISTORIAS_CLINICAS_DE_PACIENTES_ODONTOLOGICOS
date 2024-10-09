// Función para validar que solo se puedan ingresar números en los campos de cédula y teléfono
function validarSoloNumeros(event) {
    if (isNaN(event.key) && event.key !== "Backspace" && event.key !== "Delete") {
        event.preventDefault();
    }
}

// Función para registrar un paciente
function registrarPaciente(event) {
    event.preventDefault(); // Evita el envío tradicional del formulario

    // Obtener los valores del formulario
    const nombre = document.querySelector('input[name="nombre"]').value.trim();
    const apellido = document.querySelector('input[name="apellido"]').value.trim();
    const cedula = document.querySelector('input[name="cedula"]').value.trim();
    const email = document.querySelector('input[name="email"]').value.trim();
    const telefono = document.querySelector('input[name="telefono"]').value.trim();
    const sexo = document.querySelector('select[name="sexo"]').value.trim();

    // Validar que no se ingresen campos vacíos
    if (!nombre || !apellido || !cedula || !email || !telefono || !sexo) {
        alert('Por favor, completa todos los campos antes de registrar al paciente.');
        return;
    }

    if (cedula.length !== 10) {
        alert("La cédula debe tener 10 dígitos.");
        return;
    }

    if (telefono.length !== 10) {
        alert("El teléfono debe tener 10 dígitos.");
        return;
    }

    if (!validarEmail(email)) {
        alert("Por favor, ingrese un correo válido.");
        return;
    }

    // Crear un objeto paciente
    const paciente = { nombre, apellido, cedula, email, telefono, sexo };

    // Obtener los pacientes existentes de localStorage
    let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];

    // Verificar si el paciente ya está registrado
    const pacienteExistente = pacientes.find(paciente => paciente.cedula === cedula);
    if (pacienteExistente) {
        alert('Un paciente con esa cédula ya está registrado.');
        return;
    }

    // Agregar el nuevo paciente al array
    pacientes.push(paciente);

    // Guardar el array actualizado en localStorage
    localStorage.setItem('pacientes', JSON.stringify(pacientes));

    alert('Paciente registrado con éxito');
    
    // Limpiar el formulario
    document.getElementById('pacienteForm').reset();
}

// Función para validar el formato de email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
