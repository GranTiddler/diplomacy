<?php

if (isset($_POST["submit"])) {
    $name = $_POST["username"];
    $pwd = $_POST["password"];
    $pwdr = $_POST["repeat"];

    require_once "dbhandler.php";



    if ($pwd !== $pwdr) {
        echo "WRONG";
    }



}
else {
    header("location: /");
}

