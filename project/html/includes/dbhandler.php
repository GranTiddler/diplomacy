<?php
$servername = "database";
$dbusername = "root";
$dbpassword = "example";
$dbname = "users";

$conn = new mysqli($servername, $dbusername, $dbpassword, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";
