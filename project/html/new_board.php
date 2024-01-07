<?php
// require_once "dbhandler.php";


$servername = "database";
$dbusername = "root";
$dbpassword = $_ENV["MYSQL_ROOT_PASSWORD"];
$dbname = "diplomacy";

$conn = new mysqli($servername, $dbusername, $dbpassword, $dbname);

$json = file_get_contents('map.json');
$json_data = json_decode($json, true);
$boardPLAYERS = 7;
$boardNAME = "THE NORMAL ONE";
$boardDESCRIPTION = "the standard diplomacy map";
$boardMAP = json_encode($json_data["map"]);
$boardDATA = json_encode($json_data["game"]);
$boardBACKGROUND = "images/";





$sql = "INSERT INTO `boards`(`boardNAME`, `boardPLAYERS`, `boardDESCRIPTION`, `boardMAP`, `boardDATA`, `boardBACKGROUND`) VALUES ('";

$sql = $sql . $boardNAME;
$sql = $sql . "',";


$sql = $sql . $boardPLAYERS;
$sql = $sql . ", '";


$sql = $sql . $boardDESCRIPTION;
$sql = $sql . "', JSON_QUOTE('";


$sql = $sql . $boardMAP;
$sql = $sql . "'), JSON_QUOTE('";


$sql = $sql . $boardDATA;
$sql = $sql . "'),'";
$sql = $sql . $boardBACKGROUND;

$sql = $sql . "');";


$result = mysqli_query($conn, $sql);

echo $result;