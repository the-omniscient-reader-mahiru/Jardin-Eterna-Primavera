<?php

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

function conectar(): mysqli {
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "zukulovers"; #Nombre de base de datos

    // Reportar errores
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

    // Crear conexión
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Establecer el juego de caracteres a utf8
    $conn->set_charset("utf8");

    return $conn;
}

?>