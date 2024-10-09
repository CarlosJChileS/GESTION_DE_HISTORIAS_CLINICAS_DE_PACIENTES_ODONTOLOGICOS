document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');

    // Inicializar el calendario de FullCalendar
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth', // Vista inicial: mes
        locale: 'es', // Configura el idioma a español
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay' // Agrega opciones de vista
        },
        events: function(fetchInfo, successCallback, failureCallback) {
            try {
                // Cargar las citas desde localStorage, agrupadas por cédula
                const citasPorPaciente = JSON.parse(localStorage.getItem('citasPorPaciente')) || {};

                // Convertir todas las citas de todos los pacientes en eventos de FullCalendar
                let eventos = [];
                for (let cedula in citasPorPaciente) {
                    const citas = citasPorPaciente[cedula];

                    eventos = eventos.concat(citas.map(cita => {
                        return {
                            id: cita.idCita,
                            title: cita.cedula,  // Mostrar solo la cédula del paciente como título del evento
                            start: `${cita.fecha}T${cita.hora}`,
                            extendedProps: {
                                descripcion: cita.descripcion,
                                ubicacion: cita.ubicacion
                            }
                        };
                    }));
                }

                successCallback(eventos);
            } catch (error) {
                console.error('Error al cargar las citas:', error);
                failureCallback(error);
            }
        },
        // Al hacer clic en un día, cambia a la vista detallada de ese día
        dateClick: function(info) {
            calendar.changeView('timeGridDay', info.dateStr);
        },
        eventClick: function(info) {
            // Mostrar detalles del evento con confirmación para eliminar la cita
            const detallesCita = `Detalles de la cita:\n\nCédula: ${info.event.title}\nDescripción: ${info.event.extendedProps.descripcion}`;
            const confirmarEliminar = confirm(`${detallesCita}\n\n¿Deseas eliminar esta cita?`);

            if (confirmarEliminar) {
                eliminarCita(info.event.id, info.event.title); // Llamar a la función de eliminación
                info.event.remove(); // Eliminar del calendario visualmente
                alert('Cita eliminada con éxito');
            }
        },
        eventDidMount: function(info) {
            // Asegurar que los eventos se muestren correctamente
            if (info.el && info.el.querySelector('.fc-event-title')) {
                const titleElement = info.el.querySelector('.fc-event-title');
                titleElement.style.whiteSpace = 'normal'; // Asegura que el texto del evento se ajuste
            }
        }
    });

    // Renderizar el calendario
    calendar.render();

    // Forzar la actualización del tamaño del calendario después de un breve retardo
    setTimeout(function() {
        calendar.updateSize();
    }, 500);
});

// Función para eliminar la cita del localStorage
function eliminarCita(idCita, cedula) {
    let citasPorPaciente = JSON.parse(localStorage.getItem('citasPorPaciente')) || {};

    if (citasPorPaciente[cedula]) {
        // Filtrar las citas para eliminar la que coincide con el ID
        citasPorPaciente[cedula] = citasPorPaciente[cedula].filter(cita => cita.idCita !== idCita);

        // Guardar las citas actualizadas en localStorage
        localStorage.setItem('citasPorPaciente', JSON.stringify(citasPorPaciente));

        alert('Cita eliminada con éxito');
    }
}
