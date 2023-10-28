<?php

if (isset($_POST["submit"])) {
    $name = $_POST["username"];
    $pwd = $_POST["password"];

    require_once "dbhandler.php";
    require_once "account_functions.php";

    $result = mysqli_query($conn, "SELECT * FROM `users` WHERE usersNAME = '" . $name . "';");

    if (mysqli_num_rows($result) > 0) {
        // echo "username exists";
    }   
    else {
        createUser($conn, $name, $pwd);
        authUser($conn, $name, $pwd);
    }

    if($_POST["remember"])
    {
        echo"remember";
    }

    
} else {
    // echo "stink";
}
