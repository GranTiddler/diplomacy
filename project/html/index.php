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
</svg>

<a id="move_display"></a>

<script type="module">


    const json = await fetch("/map.json")
        .then((res) => {
            return res.json();
        });

    var map_json = json["map"]


    var mapElement = document.getElementById('map');



    for (var key in map_json) {

        var el = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        el.setAttribute('class', 'territory')
        el.setAttribute('fill', '#000000')
        el.setAttribute('stroke', '#000000')
        el.setAttribute('d', map_json[key]['d'])
        el.setAttribute('stroke-width', '0')
        el.setAttribute('transform', 'matrix(1,0,0,1,0,0)')
        el.setAttribute('id', key)

        if (map_json[key]["coasts"]) {
            coastTerritories.push(el);

            for (var coast in map_json[key]['coasts']) {

                var coastButton = document.createElementNS('http://www.w3.org/2000/svg', 'path')
                coastButton.setAttribute('class', 'territory')
                coastButton.setAttribute('fill', '#000000')
                coastButton.setAttribute('stroke', '#000000')
                coastButton.setAttribute('d', map_json[key]["coasts"][coast]['d'])
                coastButton.setAttribute('stroke-width', '0')
                coastButton.setAttribute('transform', 'matrix(1,0,0,1,0,0)')
                coastButton.setAttribute('id', key + coast)
                mapElement.appendChild(coastButton)
            }
        }

        mapElement.appendChild(el)
    }



    var path = document.querySelectorAll('.territory');

    for (var i = 0; i < path.length; i++) {
        path[i].addEventListener('click', function () { territoryClick(this.id) }, false);
    }
</script>

</html>

<!-- path code: 


var v = (F.x + B.x) / 2, R = (F.y + B.y) / 2, b = (3 * F.x + B.x) / 4, k = (3 * F.y + B.y) / 4, n = (F.x + 3 * B.x) / 4; 
f = (F.y + 3 * B.y) / 4; if (B.x > F.x) { var m = .05 * (B.y - F.y); F = .05 * (F.x - B.x) } else m = .05 * (F.y - B.y), F = .05 * (B.x - F.x); 
h = ["M", h.x, ",", h.y, "C", v, ",", R, " ", b + m, ",", k + F, " ", n, ",", f].join(""); 
v = A.set(); 
v.push(A.path(h).attr({ "stroke-dasharray": ".", "stroke-width": "2", stroke: t }).scaleToCanvas()); 
v.push(A.circle(n, f, 5).attr({ stroke: t }).scaleToCanvas()); 
t = v

-->