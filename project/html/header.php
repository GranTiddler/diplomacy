<?php
session_start();
include_once("scripts/server/verify-script.php");

?>

<html>
<link rel="stylesheet" href="/styles/style.css">

<body>
    <div class="nav">
        <a class="nav-element">F I L L E R - T E X T</a>


        <?php
        if (isset($_SESSION["username"])) {
            echo '<a href="/account" class="login-button">' . $_SESSION["username"] . '</a>';
        } else {
            echo '<a class="login-button" href="/login">log in</a><a class="login-button" href="/signup">sign up</a>';
        }
        ?>


    </div>
</body>

</html>