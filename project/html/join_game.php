<?php

session_start();

$gameNumber = htmlspecialchars($_GET["game"]);


$servername = "database";
$dbusername = "root";
$dbpassword = "example";
$dbname = "diplomacy";

$conn = new mysqli($servername, $dbusername, $dbpassword, $dbname);

$players = (mysqli_query($conn, "SELECT * FROM `gamePlayers" . $gameNumber ."`;"));



while($row =  mysqli_fetch_row($players))
{
    if($row[0] == $_SESSION["uid"])
    {
        exit();
    }
}




mysqli_query($conn, "INSERT INTO `gamePlayers" . $gameNumber ."` (`playerID`, `playerNAME`, `playerINGAME`) VALUES (". $_SESSION["uid"].", '".$_SESSION["username"]."', 1);");
header('Location: game/?game='. htmlspecialchars($gameNumber));