<?php
header('Content-Type: application/json; charset=utf-8');

// Incluir la conexión a la base de datos
include '../../conexion.php';

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}


// Mostrar errores para depuración (esto solo para desarrollo, no para producción)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

try {
    // Verificar si se han recibido los datos del formulario
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Recoger los datos del formulario
        $correo = $_POST['correo'] ?? '';
        $contrasena = $_POST['contrasena'] ?? '';

        // Validar los campos
        if (empty($correo) || empty($contrasena)) {
            throw new Exception('Correo y contraseña son obligatorios.');
        }

        // Verificar si el correo existe
        $conn = conectar();
        $sql = "SELECT * FROM registrousuario WHERE correo = ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Error al preparar la consulta: " . $conn->error);
        }

        $stmt->bind_param("s", $correo);
        $stmt->execute();
        $resultado = $stmt->get_result();

        if ($resultado->num_rows === 0) {
            throw new Exception('Correo no registrado.');
        }

        // Verificar la contraseña
        $usuario = $resultado->fetch_assoc();
        if (!password_verify($contrasena, $usuario['contrasena'])) {
            throw new Exception('Contraseña incorrecta.');
        }

        // Iniciar sesión si las credenciales son correctas
        $_SESSION['usuario'] = $usuario['correo'];
        $_SESSION['rol'] = $usuario['rol'];

        // Definir la redirección según el rol
        if ($usuario['rol'] === 'CLIENTE') {
            $redirectUrl = 'indexcliente.php';
        } else {
            $redirectUrl = 'index.php'; // Puedes agregar más roles y redirecciones si es necesario
        }

        // Respuesta JSON con éxito y URL de redirección
        $data = ['error' => false, 'message' => 'Inicio de sesión exitoso.', 'redirect' => $redirectUrl];
        echo json_encode($data, JSON_PRETTY_PRINT);
    } else {
        throw new Exception('Método de solicitud no permitido.');
    }
} catch (Exception $e) {
    // Devolver siempre JSON con error
    $data = ['error' => true, 'message' => $e->getMessage()];
    echo json_encode($data, JSON_PRETTY_PRINT);
    exit();
}
?>
