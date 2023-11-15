<?php
// include_once('hepder.php');
?>

<html>


<script src='/scripts/javascript/get_moves.js'></script>

<style type="text/css">
    .box {
        width: 20px;
        height: 20px;
        background-color: #666764;
        cursor: pointer;
    }

    .box:hover {
        background-color: #000000;
    }

    .territory {
        fill-opacity: 0;
    }

    .territory:hover {
        fill-opacity: 0.3;
    }
</style>

<svg id="map" height="90%" version="1.1" width="99%" xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink" style="overflow: hidden; position: relative; left: -0.5px;"
    viewBox="0 0 610 560" preserveAspectRatio="xMinYMin">
    <desc>Created with Raphaël 2.3.0</desc>
    <defs></defs>
    <image x="-1" y="-1" width="610" height="560" preserveAspectRatio="none" xlink:href="map_background.png"
        transform="matrix(1,0,0,1,0,0)"></image>
    <g id="mapLayer"></g>
    <g id="textLayer"></g>
    <g id="units"></g>
    <g id="orders"></g>
    <g id="buttonLayer"></g>
</svg>

<a id="move_display"></a>

<script>
    var json
    fetch('./map.json')
        .then((response) => response.json())
        .then((res) => {
            createButtons(res)
            createGraphics(res)
            json = res;
        });

</script>

</html>

