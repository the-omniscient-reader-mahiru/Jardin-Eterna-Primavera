<?php
session_start(); // Iniciar la sesión

// Destruir todas las variables de sesión
session_unset();
session_destroy();

// Redirigir al index.php con un mensaje indicando que la sesión se ha cerrado
header("Location: index.php?logout=1");
exit();
?>
