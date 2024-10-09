// Validación de cédula (solo permite números y valida longitud)
function validarCedula(event) {
    const cedulaInput = document.getElementById("buscarCedula");
    const cedula = cedulaInput.value;

    // Evitar que el usuario escriba letras o caracteres no numéricos
    if (isNaN(event.key) && event.key !== "Backspace" && event.key !== "Delete") {
        event.preventDefault();
    }

    // Validar si la cédula tiene 10 dígitos cuando presiona Enter
    if (event.key === "Enter") {
        if (cedula.length === 10) {
            buscarPaciente();
        } else {
            alert("La cédula debe tener 10 dígitos.");
        }
    }
}

// Función para registrar el paciente en localStorage
function registrarPaciente(event) {
    event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

    const form = document.getElementById('pacienteForm');
    const nuevoPaciente = {
        nombre: form.nombre.value.trim(),
        apellido: form.apellido.value.trim(),
        cedula: form.cedula.value.trim(),
        email: form.email.value.trim(),
        telefono: form.telefono.value.trim(),
        sexo: form.sexo.value
    };

    // Validar si la cédula tiene 10 dígitos
    if (nuevoPaciente.cedula.length !== 10) {
        alert("La cédula debe tener 10 dígitos.");
        return;
    }

    // Verifica si hay pacientes almacenados en localStorage
    let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];

    // Verificar si ya existe un paciente con esa cédula
    const pacienteExistente = pacientes.find(paciente => paciente.cedula === nuevoPaciente.cedula);
    if (pacienteExistente) {
        alert("Un paciente con esta cédula ya está registrado.");
        return;
    }

    // Agrega el nuevo paciente al array de pacientes
    pacientes.push(nuevoPaciente);

    // Guarda el array actualizado en localStorage
    localStorage.setItem('pacientes', JSON.stringify(pacientes));

    // Limpia el formulario después de guardar
    form.reset();

    alert('Paciente registrado exitosamente.');

    // Recargar la lista de pacientes
    cargarPacientes();
}

// Función para buscar un paciente por cédula
function buscarPaciente() {
    const cedula = document.getElementById("buscarCedula").value.trim();
    const listaPacientes = document.getElementById("listaPacientes");
    listaPacientes.innerHTML = ''; // Limpiar la lista antes de mostrar resultados

    if (cedula.length !== 10) {
        alert("La cédula debe tener 10 dígitos.");
        return;
    }

    let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    const pacienteEncontrado = pacientes.find(paciente => paciente.cedula === cedula);

    if (pacienteEncontrado) {
        const li = document.createElement('li');
        li.innerHTML = `
            ${pacienteEncontrado.nombre} ${pacienteEncontrado.apellido} - ${pacienteEncontrado.cedula} - ${pacienteEncontrado.telefono}
            <button class="eliminar-btn" onclick="eliminarPaciente('${pacienteEncontrado.cedula}')">Eliminar</button>
        `;
        listaPacientes.appendChild(li);
    } else {
        listaPacientes.innerHTML = '<li>No se encontró ningún paciente con esa cédula.</li>';
    }
}

// Función para mostrar todos los pacientes
function mostrarTodos() {
    cargarPacientes();
}

// Función para cargar los últimos 10 pacientes desde localStorage
function cargarPacientes() {
    let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    const listaPacientes = document.getElementById('listaPacientes');

    // Limpiar la lista antes de agregar nuevos elementos
    listaPacientes.innerHTML = '';

    // Obtener los últimos 10 pacientes
    const ultimosPacientes = pacientes.slice(-10).reverse();

    // Añadir los pacientes al listado
    ultimosPacientes.forEach(paciente => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${paciente.nombre} ${paciente.apellido} - ${paciente.cedula} - ${paciente.telefono}
            <button class="eliminar-btn" onclick="eliminarPaciente('${paciente.cedula}')">Eliminar</button>
        `;
        listaPacientes.appendChild(li);
    });
}

// Función para eliminar un paciente del localStorage
function eliminarPaciente(cedula) {
    let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];

    // Filtrar los pacientes para eliminar el que tenga la cédula dada
    pacientes = pacientes.filter(paciente => paciente.cedula !== cedula);

    // Guardar el array actualizado en localStorage
    localStorage.setItem('pacientes', JSON.stringify(pacientes));

    alert('Paciente eliminado con éxito');

    // Recargar la lista de pacientes
    cargarPacientes();
}

// Cargar la lista de pacientes al cargar la página
window.onload = cargarPacientes;
