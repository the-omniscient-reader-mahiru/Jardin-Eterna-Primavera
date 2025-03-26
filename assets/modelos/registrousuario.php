<?php
header('Content-Type: application/json; charset=utf-8');

// Incluir la conexión a la base de datos
include '../../conexion.php';

// Iniciar sesión si no está iniciada
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Función para validar si los campos están vacíos
function validarCampos($nombre, $apellido, $correo, $contrasena) {
    return !(empty($nombre) || empty($apellido) || empty($correo) || empty($contrasena));
}

// Función para verificar si el correo ya está registrado
function verificarCorreoExistente($correo) {
    $conn = conectar();

    // Consultar si el correo ya está registrado
    $sql = "SELECT * FROM registrousuario WHERE correo = ?";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        error_log("Error al preparar la consulta: " . $conn->error);
        return false;
    }

    $stmt->bind_param("s", $correo);
    $stmt->execute();
    $resultado = $stmt->get_result();

    return $resultado->num_rows > 0;
}

// Verificar si se han recibido los datos del formulario
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Recoger los datos del formulario
    $nombre = $_POST['nombre'] ?? '';
    $apellido = $_POST['apellido'] ?? '';
    $correo = $_POST['correo'] ?? '';
    $contrasena = $_POST['contrasena'] ?? '';

    // Validar los campos
    if (!validarCampos($nombre, $apellido, $correo, $contrasena)) {
        $data = ['error' => true, 'message' => 'Todos los campos son obligatorios.'];
        echo json_encode($data, JSON_PRETTY_PRINT);
        exit;
    }

    // Verificar si el correo ya existe
    if (verificarCorreoExistente($correo)) {
        $data = ['error' => true, 'message' => 'El correo electrónico ya está registrado. Por favor, ingrese uno diferente.'];
        echo json_encode($data, JSON_PRETTY_PRINT);
        exit;
    }

    // Encriptar la contraseña
    $contrasenaEncriptada = password_hash($contrasena, PASSWORD_DEFAULT);

    // Insertar los datos en la base de datos
    $conn = conectar();
    $sql = "INSERT INTO registrousuario (nombre, apellido, correo, contrasena, rol) VALUES (?, ?, ?, ?, 'CLIENTE')";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        error_log("Error al preparar la consulta: " . $conn->error);
        $data = ['error' => true, 'message' => 'Error interno del servidor.'];
        echo json_encode($data, JSON_PRETTY_PRINT);
        exit;
    }

    $stmt->bind_param("ssss", $nombre, $apellido, $correo, $contrasenaEncriptada);

    if ($stmt->execute()) {
        // Si todo va bien
        $data = ['error' => false, 'message' => 'Registro exitoso. Ahora puedes iniciar sesión.'];
        echo json_encode($data, JSON_PRETTY_PRINT);
    } else {
        $data = ['error' => true, 'message' => 'Error al registrar el usuario. Por favor, intenta nuevamente.'];
        echo json_encode($data, JSON_PRETTY_PRINT);
    }

    // Cerrar la conexión
    $stmt->close();
    $conn->close();
}
?>
