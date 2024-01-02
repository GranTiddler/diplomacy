<?php

if (isset($_POST["submit"])) {
    $name = $_POST["username"];
    $pwd = $_POST["password"];

    require_once "dbhandler.php";
    require_once "account_functions.php";

    authUser($conn, $name, $pwd);

    if($_POST["remember"])
    {
        setCookies($conn);  
    }

    // header("location: /");
}
else {
    // echo "stink";
}

header("location: /");


