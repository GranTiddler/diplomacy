<?php
$servername = "database";
$dbusername = "root";
$dbpassword = $_ENV["MYSQL_ROOT_PASSWORD"];
$dbname = "users";

$conn = new mysqli($servername, $dbusername, $dbpassword, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}