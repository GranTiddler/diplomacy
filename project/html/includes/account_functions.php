<?php

function createUser($conn, $username, $password) { 
    $sql = "INSERT INTO users (usersNAME usersPWD) VALUES (?, ?);";

    $stmt = mysqli_stmt_init($conn);

    if(!mysqli_stmt_prepare($conn, $sql)) {
        header("location: /");
        exit();
    }

    $hashedpwd = password_hash($password, PASSWORD_DEFAULT);

    mysqli_stmt_bind_param($stmt, "ss", $username, $hashedpwd);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

    header("location: /");



}