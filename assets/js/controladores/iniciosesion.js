// Seleccionamos los elementos del formulario de inicio de sesión
const correoInputLogin = document.querySelector('#correoregistrologin');
const contrasenaInputLogin = document.querySelector('#contrasenaregistrologin');
const btnIniciarSesion = document.querySelector('#btniniciosesionlogin');

// Función para mostrar mensajes de error
function mostrarError(input, mensaje) {
    let mensajeError = input.nextElementSibling;
    if (!mensajeError || !mensajeError.classList.contains('mensaje-error')) {
        mensajeError = document.createElement('p');
        mensajeError.classList.add('mensaje-error');
        mensajeError.style.color = 'red';
        mensajeError.style.fontSize = '12px';
        input.parentNode.appendChild(mensajeError);
    }
    mensajeError.textContent = mensaje;
}

// Función para limpiar los mensajes de error
function limpiarError(input) {
    const mensajeError = input.nextElementSibling;
    if (mensajeError && mensajeError.classList.contains('mensaje-error')) {
        mensajeError.remove();
    }
}

// Validación del correo y contraseña
function validarCorreoLogin(input) {
    const valor = input.value.trim();
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!valor) {
        mostrarError(input, 'El correo es obligatorio.');
        return false;
    } else if (!regex.test(valor)) {
        mostrarError(input, 'Introduce un correo electrónico válido.');
        return false;
    }
    limpiarError(input);
    return true;
}

function validarContrasenaLogin(input) {
    const valor = input.value.trim();
    if (!valor) {
        mostrarError(input, 'La contraseña es obligatoria.');
        return false;
    }
    limpiarError(input);
    return true;
}

// Agregar evento al botón de iniciar sesión
btnIniciarSesion.addEventListener('click', (e) => {
    e.preventDefault();

    // Validar los campos antes de enviar
    const correoValido = validarCorreoLogin(correoInputLogin);
    const contrasenaValida = validarContrasenaLogin(contrasenaInputLogin);

    if (!correoValido || !contrasenaValida) {
        return;
    }

    // Crear los datos del formulario
    const formData = new FormData();
    formData.append("correo", correoInputLogin.value.trim());
    formData.append("contrasena", contrasenaInputLogin.value.trim());

    // Deshabilitar el botón mientras se realiza la solicitud
    $(btnIniciarSesion).html('Iniciando...');
    $(btnIniciarSesion).addClass('disabled').prop('disabled', true);

    // Realizar la solicitud AJAX
    $.ajax({
        type: "POST",
        url: "assets/modelos/iniciosesion.php", // Cambiar a la ruta adecuada
        data: formData,
        contentType: false,
        cache: false,
        processData: false,
        dataType: "json"
    })

    .done(function(data) {
        // Restaurar el botón
        $(btnIniciarSesion).html('Iniciar sesión');
        $(btnIniciarSesion).removeClass("disabled").prop("disabled", false);
    
        console.log("Respuesta del servidor:", data); // Verificar la respuesta en la consola
    
        if (data.error) {
            // Mostrar mensaje de error
            alert('Error: ' + data.message);
            return;
        }
    
        // Si el inicio de sesión es exitoso, redirigir a la URL proporcionada
        alert('Inicio de sesión exitoso');
        window.location.href = data.redirect;
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        // Manejar errores de AJAX
        console.error('Error en la solicitud:', textStatus, errorThrown);
        alert('Error al iniciar sesión');
    
        // Restaurar el botón de enviar
        $(btnIniciarSesion).html('Iniciar sesión');
        $(btnIniciarSesion).removeClass("disabled").prop("disabled", false);
    });
});