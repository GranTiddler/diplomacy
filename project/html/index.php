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

<svg id="map" height="100%" version="1.1" width="99%" xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink" style="overflow: hidden; position: relative; left: -0.5px;"
    viewBox="0 0 610 560" preserveAspectRatio="xMinYMin">
    <desc>Created with Raphaël 2.3.0</desc>
    <defs></defs>
    <image x="-1" y="-1" width="610" height="560" preserveAspectRatio="none" xlink:href="map_background.png"
        transform="matrix(1,0,0,1,0,0)"></image>
</svg>

<script type="module">


    const map_json = await fetch("/map.json")
        .then((res) => {
            return res.json();
        });

    console.log(map_json)

    var mapElement = document.getElementById('map');
    


    for (var key in map_json) {
        var el = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        el.setAttribute('titel', 'ASS')
        el.setAttribute('class', 'territory')
        el.setAttribute('fill', '#000000')
        el.setAttribute('stroke', '#000000')
        el.setAttribute('d', map_json[key]['d'])
        el.setAttribute('stroke-width', '0')
        el.setAttribute('transform', 'matrix(1,0,0,1,0,0)')
        el.setAttribute('id', key)
        mapElement.appendChild(el)
    }



    var path = document.querySelectorAll('.territory');

    for (var i = 0; i < path.length; i++) {
        path[i].addEventListener('click', function () { territoryClick(this.id) }, false);
    }
</script>

</html>