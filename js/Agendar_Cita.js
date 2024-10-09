// Función para manejar el envío del formulario y guardar la cita en localStorage
function guardarCita(event) {
    event.preventDefault(); // Evita el envío tradicional del formulario

    const form = document.getElementById('citaForm');

    // Obtener los valores del formulario y eliminar espacios innecesarios
    const cedula = form.cedula.value.trim();
    const fecha = form.fecha.value.trim();
    const hora = form.hora.value.trim();
    const ubicacion = form.ubicacion.value.trim();
    const descripcion = form.descripcion.value.trim();

    // Validar que todos los campos requeridos estén completos
    if (!cedula || !fecha || !hora || !ubicacion || !descripcion) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    // Crear un objeto para la nueva cita
    const nuevaCita = {
        cedula: cedula,
        fecha: fecha,
        hora: hora,
        ubicacion: ubicacion,
        descripcion: descripcion,
        idCita: Date.now() // Usamos la fecha actual como ID único
    };

    // Obtener las citas almacenadas en localStorage, agrupadas por cédula de paciente
    let citasPorPaciente = JSON.parse(localStorage.getItem('citasPorPaciente')) || {};

    // Si no hay citas previas para este paciente, crear un nuevo array de citas
    if (!citasPorPaciente[nuevaCita.cedula]) {
        citasPorPaciente[nuevaCita.cedula] = [];
    }

    // Agregar la nueva cita al array de citas del paciente
    citasPorPaciente[nuevaCita.cedula].push(nuevaCita);

    // Guardar las citas actualizadas en localStorage
    localStorage.setItem('citasPorPaciente', JSON.stringify(citasPorPaciente));

    alert('Cita guardada con éxito');
    form.reset(); // Limpiar el formulario
}

// Asignar la función al evento submit del formulario si aún no está asignada
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('citaForm');
    
    // Verificar si el formulario existe antes de agregar el evento
    if (form && !form.dataset.submitAttached) {
        form.addEventListener('submit', guardarCita);
        form.dataset.submitAttached = true; // Marcamos que el evento ya está asignado
    } else {
        console.error("No se encontró el formulario 'citaForm' o el evento ya fue asignado.");
    }
});
