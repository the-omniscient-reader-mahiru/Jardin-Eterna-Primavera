// Seleccionamos los elementos del formulario usando los nuevos IDs
const form = document.querySelector('#registrousuario');
const nombreInput = document.querySelector('#nombreregistro');
const apellidoInput = document.querySelector('#apellidoregistro');
const correoInput = document.querySelector('#correoregistro');
const contrasenaInput = document.querySelector('#contrasenaregistro');
const btnEnviar = document.querySelector('#btnregistrousuario');

// Función para mostrar mensajes de error
function mostrarError(input, mensaje) {
    let mensajeError = input.nextElementSibling;
    // Si no existe un mensaje de error, lo creamos
    if (!mensajeError || !mensajeError.classList.contains('mensaje-error')) {
        mensajeError = document.createElement('p');
        mensajeError.classList.add('mensaje-error');
        mensajeError.style.color = 'red'; // Color del texto de error
        mensajeError.style.fontSize = '12px';
        input.parentNode.appendChild(mensajeError);
    }
    mensajeError.textContent = mensaje; // Mostrar el mensaje de error
}

// Función para limpiar los mensajes de error
function limpiarError(input) {
    const mensajeError = input.nextElementSibling;
    if (mensajeError && mensajeError.classList.contains('mensaje-error')) {
        mensajeError.remove();
    }
}

// Función para validar el nombre y apellido (sin números o caracteres especiales)
function validarTexto(input) {
    const valor = input.value.trim();
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/; // Permite letras, espacios y caracteres acentuados
    if (!valor) {
        mostrarError(input, 'Este campo es obligatorio.');
        return false;
    } else if (!regex.test(valor)) {
        mostrarError(input, 'Solo se permiten letras y espacios.');
        return false;
    }
    limpiarError(input); // Si pasa la validación, limpiamos los errores
    return true;
}

// Función para validar el correo electrónico
function validarCorreo(input) {
    const valor = input.value.trim();
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Formato válido de email
    if (!valor) {
        mostrarError(input, 'Este campo es obligatorio.');
        return false;
    } else if (!regex.test(valor)) {
        mostrarError(input, 'Introduce un correo electrónico válido.');
        return false;
    }
    limpiarError(input);
    return true;
}

// Función para validar la contraseña (simplemente que no esté vacía)
function validarContrasena(input) {
    const valor = input.value.trim();
    if (!valor) {
        mostrarError(input, 'Este campo es obligatorio.');
        return false;
    }
    limpiarError(input);
    return true;
}

// Agregar evento al botón de envío
btnEnviar.addEventListener('click', (e) => {
    e.preventDefault();

    // Crear los datos del formulario
    const formData = new FormData();

    // Configurar las variables necesarias
    formData.append("nombre", nombreInput.value.trim());
    formData.append("apellido", apellidoInput.value.trim());
    formData.append("correo", correoInput.value.trim());
    formData.append("contrasena", contrasenaInput.value.trim());

    // Deshabilitar el botón de enviar para evitar múltiples envíos
    $(btnEnviar).html('Enviando...');
    $(btnEnviar).addClass('disabled').prop('disabled', true);
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }
    
    // Realizar la solicitud AJAX
    $.ajax({
        type: "POST",
        url: "assets/modelos/registrousuario.php", // Ruta al script PHP
        data: formData,
        contentType: false, // Para enviar datos formateados o archivos
        cache: false,
        processData: false,
        dataType: "json", // Se espera una respuesta en formato JSON
    })
    
        .done(function (data) {
            // Restaurar el botón de enviar
            $(btnEnviar).html('Crear cuenta');
            $(btnEnviar).removeClass("disabled").prop("disabled", false);
    
            console.log("Respuesta del servidor:", data); // Verificar respuesta en consola
    
            if (data.error) {
                // Mostrar mensaje de error
                alert('Fallo el Registro: ' + data.message);
                return;
            }
    
            // Si el registro fue exitoso
            alert('Registro Exitoso');
            form.reset(); // Limpiar el formulario
        })
    
        .fail(function (jqXHR, textStatus, errorThrown) {
            // Manejar errores de la solicitud AJAX
            console.error('Error en la solicitud:', textStatus, errorThrown);
            console.error('Respuesta del servidor:', jqXHR.responseText); // Mostrar respuesta del servidor para depurar
    
            alert('Error al realizar la solicitud. Por favor, inténtalo más tarde.');
    
            // Restaurar el botón de enviar
            $(btnEnviar).html('Crear cuenta');
            $(btnEnviar).removeClass("disabled").prop("disabled", false);
        });
    });