<?php
$servername = "database";
$dbusername = "root";
$dbpassword = "example";
$dbname = "diplomacy";

$conn = new mysqli($servername, $dbusername, $dbpassword, $dbname);

$id = 19;


$result = mysqli_query($conn, "SELECT * FROM `boards` WHERE boardID = '" . $id . "';");
$row = mysqli_fetch_row($result);

$map = json_decode($row[4], true);
$start = json_decode($row[8], true);






$name = "game1";
$data = '{"key":"val"}';
$players = '["player1", "player2"]';

$sql = "INSERT INTO `games`(`gameNAME`, `gameDATA`, `mapID`, `gameSTATE`) VALUES ('$name', '$data', '$id', 'S01');";

// echo $sql;
mysqli_query($conn, $sql);
$result = mysqli_query($conn, "SELECT LAST_INSERT_ID();");


$newID = mysqli_fetch_row($result)[0];
// echo mysqli_fetch_row($result);

$sql = "CREATE TABLE gameBoard$newID (turnID INT AUTO_INCREMENT PRIMARY KEY NOT NULL, turn varchar(128),";
$fields = [];
foreach ($map as $key => $value) 
{
    array_push($fields, "$key varchar(32)");
}



$sql = $sql . implode(",", $fields);
$sql = $sql . ");";

mysqli_query($conn, $sql);





$sql = "INSERT INTO gameBoard$newID";

$fields = ["turn"];
$startSC = ["SC01"];
$startUnits = ["SU01"];
foreach ($start as $key => $value) 
{
    array_push($fields, "$key");
    array_push($startSC, $value["country"]);
    if($value["coast"])
    {
        array_push($startUnits, $value["country"] . "-".$value["type"]."/".$value["coast"]);
        
    }
    else {
        array_push($startUnits, $value["country"] . "-".$value["type"]);
    }

}



$scSQL = " (" . implode(",", $fields) . ") VALUES ('" . implode("', '", $startSC) ."');";
$unitSQL =  " (" . implode(",", $fields) . ") VALUES ('" . implode("', '", $startUnits) ."');";
$moveSQL =  " (turn) VALUES ('SM01');";

// echo $sql . $scSQL.$sql.$unitSQL;

mysqli_query($conn, $sql . $scSQL);
mysqli_query($conn, $sql . $unitSQL);
mysqli_query($conn, $sql . $moveSQL);


$sql = "CREATE TABLE gamePlayers$newID (playerID int UNIQUE NOT NULL, playerNAME varchar(128) NOT NULL, playerCOUNTRY varchar(128), playerINGAME boolean NOT NULL);";
// echo $sql;
mysqli_query($conn, $sql);
