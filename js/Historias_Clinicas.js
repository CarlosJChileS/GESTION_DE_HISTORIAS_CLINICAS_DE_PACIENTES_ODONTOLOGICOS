// Validar que solo se puedan ingresar números en los campos de cédula
function validarSoloNumeros(event) {
    const key = event.key;
    // Permitir números, teclas de borrado y retroceso
    if (!/^\d+$/.test(key) && key !== "Backspace" && key !== "Delete") {
        event.preventDefault();
    }
}

// Cargar las últimas 10 historias clínicas de todos los pacientes
function cargarHistorias() {
    let historiasPorPaciente = JSON.parse(localStorage.getItem('historiasPorPaciente')) || {};
    const listaHistorias = document.getElementById('listaHistorias');
    listaHistorias.innerHTML = ''; // Limpiar la lista antes de mostrar

    for (let cedula in historiasPorPaciente) {
        const ultimasHistorias = historiasPorPaciente[cedula].slice(-10).reverse();

        ultimasHistorias.forEach(historia => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span onclick="mostrarDetallesHistoria('${historia.idHistoriaClinica}', '${historia.cedula}')">
                    Cédula: ${historia.cedula} - Motivo: ${historia.motivoConsulta}
                </span>
                <button class="eliminar-btn" onclick="eliminarHistoria('${historia.idHistoriaClinica}', '${historia.cedula}')">Eliminar</button>
            `;
            listaHistorias.appendChild(li);
        });
    }
}

// Crear una nueva historia clínica
function crearHistoriaClinica(event) {
    event.preventDefault(); // Evita el envío tradicional del formulario

    const form = document.getElementById('historiaForm');
    const nuevaHistoria = {
        idHistoriaClinica: Date.now(), // ID único basado en el tiempo
        cedula: form.cedula.value.trim(),
        idCita: form.idCita.value.trim(),
        motivoConsulta: form.motivoConsulta.value.trim(),
        enfermedadActual: form.enfermedadActual.value.trim(),
        antecedentesPatoPersonales: form.antecedentesPatoPersonales.value.trim(),
        antecedentesPatoFamiliares: form.antecedentesPatoFamiliares.value.trim(),
        constantesVitales: form.constantesVitales.value.trim(),
        sistemaEstomatognatico: form.sistemaEstomatognatico.value.trim(),
        odontograma: form.odontograma.value.trim(),
        indicadoresSaludBucal: form.indicadoresSaludBucal.value.trim(),
        indicesCPO: form.indicesCPO.value.trim(),
        diagnostico: form.diagnostico.value.trim(),
        procedimientos: form.procedimientos.value.trim(),
        evolucion: form.evolucion.value.trim()
    };

    // Validar que todos los campos estén completos
    if (Object.values(nuevaHistoria).some(value => value === "")) {
        alert('Por favor, complete todos los campos antes de guardar la historia clínica.');
        return;
    }

    // Validar que la cédula del paciente exista
    let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    const pacienteExiste = pacientes.some(paciente => paciente.cedula === nuevaHistoria.cedula);

    if (!pacienteExiste) {
        alert('Error: La cédula ingresada no corresponde a ningún paciente registrado.');
        return;
    }

    // Obtener las historias almacenadas
    let historiasPorPaciente = JSON.parse(localStorage.getItem('historiasPorPaciente')) || {};

    // Si no hay historias previas para este paciente, crear una nueva entrada
    if (!historiasPorPaciente[nuevaHistoria.cedula]) {
        historiasPorPaciente[nuevaHistoria.cedula] = [];
    }

    // Agregar la nueva historia clínica
    historiasPorPaciente[nuevaHistoria.cedula].push(nuevaHistoria);

    // Guardar las historias en localStorage
    localStorage.setItem('historiasPorPaciente', JSON.stringify(historiasPorPaciente));

    alert('Historia clínica guardada con éxito');
    form.reset(); // Limpiar el formulario
    ocultarFormulario(); // Ocultar el formulario
    cargarHistorias(); // Recargar la lista de historias clínicas
}

// Mostrar detalles de una historia clínica
function mostrarDetallesHistoria(idHistoriaClinica, cedula) {
    let historiasPorPaciente = JSON.parse(localStorage.getItem('historiasPorPaciente')) || {};
    const historia = historiasPorPaciente[cedula].find(historia => historia.idHistoriaClinica === parseInt(idHistoriaClinica));

    if (historia) {
        // Mostrar detalles en un modal o en una sección específica
        let detallesHTML = `
            <h3>Detalles de la Historia Clínica</h3>
            <p><strong>Cédula:</strong> ${historia.cedula}</p>
            <p><strong>Motivo de la Consulta:</strong> ${historia.motivoConsulta}</p>
            <p><strong>Enfermedad Actual:</strong> ${historia.enfermedadActual}</p>
            <p><strong>Antecedentes Patológicos Personales:</strong> ${historia.antecedentesPatoPersonales}</p>
            <p><strong>Constantes Vitales:</strong> ${historia.constantesVitales}</p>
            <p><strong>Sistema Estomatognático:</strong> ${historia.sistemaEstomatognatico}</p>
            <p><strong>Odontograma:</strong> ${historia.odontograma}</p>
            <p><strong>Indicadores de Salud Bucal:</strong> ${historia.indicadoresSaludBucal}</p>
            <p><strong>Diagnóstico:</strong> ${historia.diagnostico}</p>
            <p><strong>Procedimientos:</strong> ${historia.procedimientos}</p>
            <p><strong>Evolución:</strong> ${historia.evolucion}</p>
            <button onclick="cerrarDetalles()">Cerrar</button>
        `;

        document.getElementById('detallesHistoria').innerHTML = detallesHTML;
        document.getElementById('detallesHistoria').style.display = 'block';

        // Ocultar la lista de historias y el botón de creación
        document.getElementById('historiasClinicas').style.display = 'none';
    } else {
        alert('Error: No se pudo encontrar la historia clínica.');
    }
}

function cerrarDetalles() {
    document.getElementById('detallesHistoria').style.display = 'none';
    document.getElementById('historiasClinicas').style.display = 'block'; // Mostrar la lista nuevamente
}

// Eliminar una historia clínica
function eliminarHistoria(idHistoriaClinica, cedula) {
    let historiasPorPaciente = JSON.parse(localStorage.getItem('historiasPorPaciente')) || {};

    if (historiasPorPaciente[cedula]) {
        // Filtrar para eliminar la historia correspondiente
        historiasPorPaciente[cedula] = historiasPorPaciente[cedula].filter(historia => historia.idHistoriaClinica !== parseInt(idHistoriaClinica));

        // Guardar los cambios
        localStorage.setItem('historiasPorPaciente', JSON.stringify(historiasPorPaciente));

        alert('Historia clínica eliminada con éxito');
        cargarHistorias(); // Actualizar la lista en pantalla
    }
}

// Función para buscar historial por cédula
function buscarHistorial() {
    const cedula = document.getElementById("buscarCedulaHistorial").value.trim();
    if (cedula.length !== 10) {
        alert("La cédula debe tener 10 dígitos.");
        return;
    }

    // Lógica para buscar el historial correspondiente a la cédula
    let historiasPorPaciente = JSON.parse(localStorage.getItem('historiasPorPaciente')) || {};
    const listaHistorias = document.getElementById('listaHistorias');
    listaHistorias.innerHTML = ''; // Limpiar la lista antes de mostrar resultados

    const historiasEncontradas = historiasPorPaciente[cedula];
    if (historiasEncontradas) {
        historiasEncontradas.slice(-10).reverse().forEach(historia => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span onclick="mostrarDetallesHistoria('${historia.idHistoriaClinica}', '${historia.cedula}')">
                    Cédula: ${historia.cedula} - Motivo: ${historia.motivoConsulta}
                </span>
                <button class="eliminar-btn" onclick="eliminarHistoria('${historia.idHistoriaClinica}', '${historia.cedula}')">Eliminar</button>
            `;
            listaHistorias.appendChild(li);
        });
    } else {
        listaHistorias.innerHTML = '<li>No se encontró ninguna historia clínica para esta cédula.</li>';
    }
}

// Función para mostrar todos los historiales clínicos
function mostrarTodosHistorias() {
    cargarHistorias(); // Recargar todos los historiales clínicos
}

// Función para buscar citas por cédula y cargar en el select
function buscarCitas() {
    const cedulaPaciente = document.getElementById("cedulaPaciente").value.trim();
    if (cedulaPaciente.length !== 10) {
        alert("Ingrese una cédula válida de 10 dígitos para buscar citas.");
        return;
    }

    // Simulación de búsqueda de citas en localStorage
    let citasPorPaciente = JSON.parse(localStorage.getItem('citasPorPaciente')) || {};
    const selectCita = document.getElementById("selectCita");
    selectCita.innerHTML = ''; // Limpiar el select

    const citas = citasPorPaciente[cedulaPaciente];
    if (citas) {
        citas.forEach(cita => {
            const option = document.createElement("option");
            option.value = cita.idCita;
            option.textContent = `ID: ${cita.idCita}, Fecha: ${cita.fecha}, Hora: ${cita.hora}`;
            selectCita.appendChild(option);
        });
    } else {
        alert('No se encontraron citas para esta cédula.');
    }
}

// Función para mostrar el formulario de creación de historia clínica
function mostrarFormulario() {
    const formContainer = document.getElementById('formularioHistoria');
    const historiasClinicasContainer = document.getElementById('historiasClinicas');
    const detallesHistoriaContainer = document.getElementById('detallesHistoria');

    // Mostrar el formulario y ocultar la lista de historias clínicas y los detalles
    formContainer.style.display = 'block';
    historiasClinicasContainer.style.display = 'none';
    detallesHistoriaContainer.style.display = 'none';
}

// Función para ocultar el formulario y volver a la lista de historias clínicas
function ocultarFormulario() {
    const formContainer = document.getElementById('formularioHistoria');
    const historiasClinicasContainer = document.getElementById('historiasClinicas');

    // Ocultar el formulario y mostrar la lista de historias clínicas
    formContainer.style.display = 'none';
    historiasClinicasContainer.style.display = 'block';
}

// Cargar historias cuando la página se carga
window.onload = cargarHistorias;
