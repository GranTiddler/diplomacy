<?php
$servername = "database";
$dbusername = "root";
$dbpassword = "example";
$dbname = "diplomacy";

$conn = new mysqli($servername, $dbusername, $dbpassword, $dbname);

$id = 19;


$result = mysqli_query($conn, "SELECT * FROM `boards` WHERE boardID = '" . $id . "';");
$row = mysqli_fetch_row($result);

$map = json_decode(json_decode($row[4]), true);



$name = "game1";
$data = '{"key":"val"}';
$players = '["player1", "player2"]';

$sql = "INSERT INTO `games`(`gameNAME`, `gameDATA`, `mapID`) VALUES ('$name', '$data', '$id');";

// echo $sql;
mysqli_query($conn, $sql);
$result = mysqli_query($conn, "SELECT LAST_INSERT_ID();");


$newID = mysqli_fetch_row($result)[0];
// echo mysqli_fetch_row($result);

$sql = "CREATE TABLE gameBoard$newID (turn varchar(128),";

$fields = [];
foreach ($map as $key => $value) 
{
    array_push($fields, "$key varchar(32)");
}

$sql = $sql . implode(",", $fields);
$sql = $sql . ");";

mysqli_query($conn, $sql);

$sql = "CREATE TABLE gamePlayers$newID (playerID int, playerNAME varchar(128), playerCOUNTRY varchar(128), playerINGAME boolean);";
echo $sql;
mysqli_query($conn, $sql);
