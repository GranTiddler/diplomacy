<?php
$servername = "database";
$dbusername = "root";
$dbpassword = "example";
$dbname = "diplomacy";

$conn = new mysqli($servername, $dbusername, $dbpassword, $dbname);
session_start();

// echo implode("', '",array_keys($_GET));
// echo "') VALUES ('";
// print_r(json_decode($_GET["moves"]));
$str = "";

$moves = json_decode($_GET["moves"]);

$toSumbit = array();
foreach ($moves as $key => $value) {
    // $m2 = implode("-", $m)[1];
    if(in_array($key, $_SESSION['controlled']))
    {
        $m = array();
        $m[0] = (((array)$value)["action"]);
        $m = array_merge($m, (array)((array)$value)["move"]);

        array_push($toSumbit, "$key='".implode("-", $m)."'");
    }
    
} 

mysqli_query($conn, "UPDATE gameBoard".$_GET['game']." SET " . implode(", ", array_filter($toSumbit)) ." ORDER BY turnID DESC LIMIT 1");
header('Location: ./?game='. htmlspecialchars($_GET["game"]));