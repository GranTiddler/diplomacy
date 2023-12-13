<?php


$servername = "database";
$dbusername = "root";
$dbpassword = "example";
$dbname = "diplomacy";

$conn = new mysqli($servername, $dbusername, $dbpassword, $dbname);

$gameNumber = htmlspecialchars($_GET["game"]);

$result = mysqli_query($conn, "SELECT * FROM `games` WHERE gameID = '" . $gameNumber . "';");

if(!mysqli_num_rows($result))
{
    header('Location: /');
    exit();
}

include_once $_SERVER['DOCUMENT_ROOT'] . "/header.php";

$servername = "database";
$dbusername = "root";
$dbpassword = "example";
$dbname = "diplomacy";
$conn = new mysqli($servername, $dbusername, $dbpassword, $dbname);


$country = "";
if(isset($_SESSION["uid"])){
    $player = (mysqli_query($conn, "SELECT * FROM `gamePlayers" . $gameNumber."` WHERE `playerID` = " . $_SESSION["uid"] .";"));
    $player = mysqli_fetch_row($player);
    $country = $player[2];

}




$board = mysqli_query($conn, "SELECT * FROM `gameBoard" . $gameNumber."`");    
$game = mysqli_fetch_row($result);

$result = mysqli_fetch_row(mysqli_query($conn, "SELECT * FROM `boards` WHERE boardID = " . $game[3] . ";"));

$boardGraphics = json_decode($result[4]);
$gameData = json_decode($result[5]);


$keys = array_keys((array)$boardGraphics);


$boardlist = [];


while($row = mysqli_fetch_row($board))
{
    if(substr($row[1],0,2) == "SC")
    {
        $boardlist[intval(substr($row[1],2,2))]["SC"]= array_filter(array_combine($keys, array_slice($row,2)));
    }
    else {
        $thing = array_filter(array_combine($keys, array_slice($row,2)));

        // print_r($boardlist[intval(substr($row[1],2,2))]["S"]["U"]);

        if($row[1][1] == "M")
        {
            // print_r($thing);

            foreach ($thing as $key => $value) {
                $moves = (explode("-", $value));
                
                $unitCountry = (((array)$boardlist[intval(substr($row[1],2,2))]["S"]["U"][$key])["country"]);
                if($country == $unitCountry){
                    //    echo $value;
                    $keys = array("action", "move");
                    //    print_r($moves);
                    if ($moves[2])
                    {
                        // echo $moves[1];
                        $moves[1] =  array($moves[1], $moves[2]);
                        array_pop($moves);
                    }
                    $thing[$key] = (array_combine($keys, $moves));
                }
            }
        }
        else if ($row[1][1] == "U")
        {
            foreach ($thing as $key => $value) {
                $unit = explode("-",$value);
                
                $thing[$key] = "{\"country\": \"$unit[0]\", \"type\": \"$unit[1]\"";
                if($unit[2]){
                    $thing[$key] = $thing[$key] . ", \"coast\": \"$unit[2]\"";
                }
                $thing[$key] = json_decode($thing[$key] . "}");
                
            }
        }

        $boardlist[intval(substr($row[1],2,2))][$row[1][0]][$row[1][1]] = $thing;
    }
}

$latestYear = intval(substr($game[4], 1, 2));
$latestSeason = $game[4][0];
$extra = $game[4][3];

$controledUnits = array();

foreach ($boardlist[$latestYear][$latestSeason]["U"] as $key => $value) {
    if(((array)$value)["country"] == $country)
    {
        array_push($controledUnits, $key);
    }
}
$_SESSION['controlled'] = $controledUnits;






// print_r($boardlist[1]["S"]["M"]);

$json = array();
$json["map"] = $boardGraphics;
$json["game"] = $gameData;

// echo json_encode($boardlist);

echo"<script>";

if($movearr){
    echo "var moves = " . json_encode($movearr) . ";";
}
else 
{
    echo "var moves = {};";
}
echo "var board = ". json_encode($boardlist).";"; 
echo "var centerOwners = ".json_encode($SCarr)."; var units = " . json_encode($unitarr) . ";";
echo "var country = \"$country\";";
echo "var json = " . json_encode($json) . ";";
echo "var year = " . $latestYear .";";
echo "var season = '" . $latestSeason ."';";

echo"</script>";


include_once "./map.php";


?>
<button id="submit">SUBMIT</button>
<script>
    document.getElementById("submit").onclick = function () {
        window.location.href =  './submit.php?game=' + <?php echo $_GET['game']?> + '&moves=' + JSON.stringify(moves);
    };

</script>
