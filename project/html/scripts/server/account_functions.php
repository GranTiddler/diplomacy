<?php

function createUser($conn, $username, $password)
{

    $hashedpwd = password_hash($password, PASSWORD_DEFAULT);
    $sql = 'INSERT INTO users (usersNAME, usersPWD) VALUES ("' . $username . '", "' . $hashedpwd . '");';

    if ($conn->query($sql) === TRUE) {
        // echo 'New record created successfully';
    } else {
        // echo 'Error: ' . $sql . '<br>' . $conn->error;
    }



}

function authUser($conn, $username, $password)
{
    $result = mysqli_query($conn, "SELECT * FROM `users` WHERE usersNAME = '" . $username . "';");
    $row = mysqli_fetch_row($result);


    if ($row[0]) {
        // echo $row[0];


        if (password_verify($password, $row[2])) {
            startSession($conn, $row[0]);
        } else {
            // echo "incorrect password";
        }

    } else {
        // echo "user not found";
    }

}

function startSession($conn, $userid)
{
    $result = mysqli_query($conn, "SELECT * FROM `users` WHERE usersID = '" . $userid . "';");
    $row = mysqli_fetch_row($result);


    session_start();

    if (session_status() === PHP_SESSION_NONE) {
        session_start();
        echo "session started";

    }

    $_SESSION["username"] = $row[1];
    $_SESSION["uid"] = $userid;


}

function setCookies($conn)
{
    session_start();
    if (isset($_SESSION["uid"])) {
        $userid = $_SESSION["uid"];
        $result = mysqli_query($conn, "SELECT * FROM `users` WHERE usersID = '" . $userid . "';");
        $row = mysqli_fetch_row($result);

        $cookieVal = $userid . " - " . $row[2];

        setcookie("login", $cookieVal, time() + (86400 * 30), "/");


    }

}
function verifyCookies($conn)
{


    if (isset($_COOKIE["login"])) {
        $cookieVal = explode(" - ", $_COOKIE["login"]);

        $userID = $cookieVal[0];
        $hashedPWD = $cookieVal[1];

        setCookies($conn);

        $result = mysqli_query($conn, "SELECT * FROM `users` WHERE usersID = '" . $userID . "';");
        $row = mysqli_fetch_row($result);

        if ($hashedPWD == $row[2]) {
            startSession($conn, $userID);
        }

    }
}


function removeCookie($conn)
{

    if (isset($_COOKIE["login"])) {
        setcookie("login", $_COOKIE["login"], time() - 10, "/");


    }
}

function changeUsername($conn, $userID, $newUsername)
{
    if (isset($_COOKIE["login"])) {
        if ($_SESSION["uid"] == $userID) {

            $sql = "UPDATE users SET usersNAME='" . $newUsername . "' WHERE id='" . $userID . "'";
            if (mysqli_query($conn, $sql)){
                
            }

        }
    }
}

function changePassword($conn, $userID, $oldPassword, $newPassword)
{
    $result = mysqli_query($conn, "SELECT * FROM `users` WHERE usersID = '" . $userID . "';");
    $row = mysqli_fetch_row($result);

    if (password_verify($oldPassword, $row[2])){
        $hashPWD = password_hash($newPassword, PASSWORD_DEFAULT);

        $sql = "UPDATE users SET usersPWD='" . $hashPWD . "' WHERE id='" . $userID . "'";
        if (mysqli_query($conn, $sql)){
                
        }
    }
}