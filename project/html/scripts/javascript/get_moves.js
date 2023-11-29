

// moves = {"Ank":{"action":"M","move":"Tun"},"Ven":{"action":"M","move":"Ukr"}}


var showCoasts = true;

var coastTerritories = [];

var centerOwners = {};
var moves = {};
var units = {};

var isSelected = false;
var action = "M";
var selected;
var target;
var targetSelected = false;
var target2;

var json;




function territoryClick(id) {
    if (isSelected) {

        // move actions
        if (action == "M") {

            // hold
            if (id == selected) {
                window.moves[selected] = { "action": "H" };
                updateDisplay()



            }
            else { // move

                window.target = id;

                window.moves[selected] = { "action": action, "move": target };
                updateDisplay()



            }
            window.isSelected = false;
        }
        else { //support or convoy actions
            if (targetSelected) { //if the supported/convoyed piece is selected
                window.target2 = id;
                window.targetSelected = false;

                window.moves[selected] = { "action": action, "move": [target, target2] };
                updateDisplay()



                window.action = "M";
                window.isSelected = false;

            }
            else {
                if (selected == id || !units[id]) { 
                    return;
                }
                window.target = id;
                window.targetSelected = true;

            }
        }
    }
    else if (units[id]["country"] == country) {
        action = "M";
        window.isSelected = true;
        window.selected = id;

    }
    setCoastVisibility()

}

function setAction(action) {

    if (isSelected) {
        if (action == "H") {
            window.moves[selected] = { "action": "H" };
            updateDisplay()

            window.isSelected = false;
        }
        else {
            window.targetSelected = false;
            window.action = action;
        }

    }
    else {
        if (action != "H") {
            window.action = action;
        }
    }
    setCoastVisibility()
}

function updateDisplay() {

    drawOrders(json, moves)

    var inner = "";
    for (var key in moves) {
        inner += key

        if (moves[key]["action"] != "H") {
            if (moves[key]["action"] == 'M') {
                inner += " - "
                inner += moves[key]["move"]

            }
            else {
                if (moves[key]["move"][0] == moves[key]["move"][1]) {
                    inner += " " + moves[key]["action"] + " " + moves[key]["move"][0] + " H"
                }
                else {
                    inner += " " + moves[key]["action"] + " " + moves[key]["move"][0] + " - " + moves[key]["move"][1]
                }
            }
        }
        else {
            inner += " H"
        }
        inner += "<br>"
    }
    document.getElementById("move_display").innerHTML = inner;
}

function setCoastVisibility() {
    for (var ter in coastTerritories) {
        if (!isSelected || (targetSelected && (coastTerritories[ter].id == target || units[target]["type"] == "A")) || (!targetSelected && (action != "M" || units[selected]["type"] == "A" || coastTerritories[ter].id == selected))) {
            coastTerritories[ter].style.display = "block";
        }
        else {
            coastTerritories[ter].style.display = "none";

        }
    }
}

function createButtons(json) {

    map_json = json["map"]



    var mapElement = document.getElementById('buttonLayer');
    mapElement.innerHTML = "";



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
                coastButton.setAttribute('id', key + "/" + coast)
                mapElement.appendChild(coastButton)
            }
        }

        mapElement.appendChild(el)
    }

    var path = document.querySelectorAll('.territory');

    for (var i = 0; i < path.length; i++) {
        path[i].addEventListener('click', function () { territoryClick(this.id) }, false);
    }


}

function createGraphics(json) {
    document.getElementById('map');

    map_json = json["map"]
    game = json["game"]

    var mapElement = document.getElementById('mapLayer');
    var textLayer = document.getElementById('textLayer');

    mapElement.innerHTML = ""
    textLayer.innerHTML = ""

    for (var key in map_json) {

        var el = document.createElementNS('http://www.w3.org/2000/svg', 'path')

        if (map_json[key]["sc"]) {
            if (centerOwners[key]) {
                el.setAttribute('fill', game["countries"][centerOwners[key]]["color"])
                el.setAttribute('fill-opacity', '0.3')

            }
            else {
                el.setAttribute('fill', '#fff')
                el.setAttribute('fill-opacity', '0.3')
            }
        }

        else {
            el.setAttribute('fill', '#000000')
            el.setAttribute('fill-opacity', '0')

        }



        if (units[key]) {

            if (units[key]["coast"]) {
                console.log(units[key])
                drawUnit(json, key, units[key]["type"], units[key]["country"], units[key]["coast"])
            }
            else {
                drawUnit(json, key, units[key]["type"], units[key]["country"], false)

            }
        }

        el.setAttribute('stroke', '#fff')
        el.setAttribute('d', map_json[key]['d'])
        el.setAttribute('stroke-width', '1')
        el.setAttribute('transform', 'matrix(1,0,0,1,0,0)')
        el.setAttribute('id', key)

        mapElement.appendChild(el)




        el = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        el.innerHTML = '<tspan xmlns="http://www.w3.org/2000/svg" dy="3.337841033935547" id="tspan1">' + key + '</tspan>'
        el.setAttribute("text-anchor", "middle")
        el.setAttribute("font-family", "Verdana")
        el.setAttribute('stroke', 'none')
        el.setAttribute('fill-opacity', '1')
        el.setAttribute("font-size", "9px")
        el.setAttribute('fill-', '1')

        el.setAttribute('x', map_json[key]["locations"]["text"][0])
        el.setAttribute('y', map_json[key]["locations"]["text"][1])
        textLayer.appendChild(el)


        if (map_json[key]["coasts"]) {
            for (var coast in map_json[key]["coasts"]) {
                el = document.createElementNS('http://www.w3.org/2000/svg', 'text')
                el.innerHTML = '<tspan xmlns="http://www.w3.org/2000/svg" dy="3.337841033935547" id="tspan1">' + coast + '</tspan>'
                el.setAttribute("text-anchor", "middle")
                el.setAttribute("font-family", "Verdana")
                el.setAttribute('stroke', 'none')
                el.setAttribute('fill-opacity', '1')
                el.setAttribute("font-size", "8px")
                el.setAttribute('fill-', '1')




                el.setAttribute('x', map_json[key]["locations"]["coasts"][coast]["text"][0])
                el.setAttribute('y', map_json[key]["locations"]["coasts"][coast]["text"][1])
                textLayer.appendChild(el)
            }
        }






        if (map_json[key]["sc"]) {
            var home = false;
            for (var countr in game["countries"]) {

                if (game["countries"][countr]["homeSC"].includes(key)) {
                    home = true
                }
            }
            if (home) {
                el = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
                el.setAttribute('width', '6')
                el.setAttribute('height', '6')

                el.setAttribute('x', map_json[key]["locations"]["sc"][0])
                el.setAttribute('y', map_json[key]["locations"]["sc"][1])

            }
            else {
                el = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
                el.setAttribute('r', '3')

                el.setAttribute('cx', map_json[key]["locations"]["sc"][0])
                el.setAttribute('cy', map_json[key]["locations"]["sc"][1])

            }

            if (centerOwners[key]) {
                el.setAttribute('fill', game["countries"][centerOwners[key]]["color"])
                el.setAttribute('fill-opacity', '1')



            }
            else {
                el.setAttribute('fill', "#fff")
                el.setAttribute('fill-opacity', '1')

            }


            el.setAttribute('stroke', '#000')
            el.setAttribute('stroke-width', '1')

            el.setAttribute('id', key)
            mapElement.appendChild(el)


        }
    }
}

function drawMove(json, territory, target, c1, c2) {


    var p1 = json["map"][territory]["locations"]["unit"]
    var p2 = json["map"][target]["locations"]["unit"]

    if (c1) {
        var p1 = json["map"][territory]["locations"]["coasts"][c1]["unit"]
    }
    if (c2) {
        var p2 = json["map"][target]["locations"]["coasts"][c2]["unit"]

    }

    var dif = [p2[0] - p1[0], p2[1] - p1[1]];



    // p1 = [p1[0] + dif[0] * 0.1, p1[1] + dif[1] * 0.1]
    // p2 = [p2[0] - dif[0] * 0.1, p2[1] - dif[1] * 0.1]

    angle = Math.atan2(dif[0], dif[1])

    var normalized = [Math.sin(angle), Math.cos(angle)]


    p1 = [p1[0] + (normalized[0] * 12), p1[1] + (normalized[1] * 12)]
    p2 = [p2[0] - (normalized[0] * 12), p2[1] - (normalized[1] * 12)]


    el = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    el.setAttribute('d', "M" + p1[0] + "," + p1[1] + "L" + p2[0] + "," + p2[1] + "Z")

    el.setAttribute('stroke', '#000')
    el.setAttribute('stroke-width', '2')

    var units = document.getElementById('orders');
    units.appendChild(el)

    el = document.createElementNS('http://www.w3.org/2000/svg', 'path')

    var arrowAngle = Math.PI * .75

    arrow1 = [Math.sin(angle - arrowAngle) * 10, Math.cos(angle - arrowAngle) * 10]
    arrow2 = [Math.sin(angle + arrowAngle) * 10, Math.cos(angle + arrowAngle) * 10]

    el.setAttribute('d', "M" + (p2[0] + arrow1[0]) + "," + (p2[1] + arrow1[1]) + "L" + p2[0] + "," + p2[1] + "L" + (p2[0] + arrow2[0]) + "," + (p2[1] + arrow2[1]))

    el.setAttribute('stroke', '#000')
    el.setAttribute('stroke-width', '2')
    el.setAttribute('fill-opacity', "0")

    var units = document.getElementById('orders');
    units.appendChild(el)

}

function drawHold(json, territory, coast = false) {

    var position = json["map"][territory]["locations"]["unit"]

    if (coast) {
        position = json["map"][territory]["locations"]["coasts"][coast]["unit"]
    }

    el = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    el.setAttribute('r', '6')
    el.setAttribute('cx', position[0])
    el.setAttribute('cy', position[1])


    var units = document.getElementById('orders');
    units.appendChild(el)



    el.setAttribute('stroke', "#000")
    el.setAttribute('fill-opacity', 0)
    el.setAttribute('stroke-width', '2')
    el.setAttribute("r", "10")

}

function drawConvoy(json, territory) {

    var position = json["map"][territory]["locations"]["unit"]
    position = [(position[0] - 12), (position[1] - 7)]


    el = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    el.setAttribute('d', "M" + (position[0]) + "," + (position[1]) + "L" + (position[0] + 3) + "," + (position[1] - 3) + "L" + (position[0] + 6) + "," + (position[1]) + "L" + (position[0] + 9) + "," + (position[1] - 3) + "L" + (position[0] + 12) + "," + (position[1]) + "L" + (position[0] + 15) + "," + (position[1] - 3) + "L" + (position[0] + 18) + "," + (position[1]) + "L" + (position[0] + 21) + "," + (position[1] - 3) + "L" + (position[0] + 24) + "," + (position[1]))
    "472,414,  475,411,  478,414,  481,411   484,414   487,411   490,414   493,411   496,414"
    el.setAttribute('stroke', '#000')
    el.setAttribute('fill-opacity', '0')
    el.setAttribute('stroke-width', '2')





    var units = document.getElementById('orders');
    units.appendChild(el)

}

function lerp(a, b, c) {
    return [a[0] * c + b[0] * (1 - c), a[1] * c + b[1] * (1 - c)]
}

function drawSupport(json, territory, target, targettarget, c1 = false, c2 = false, c3 = false) {


    if (c1) {
        p1 = json["map"][territory]["locations"]["coasts"][c1]["unit"]
    }
    var p1 = json["map"][territory]["locations"]["unit"]
    var p2 = json["map"][target]["locations"]["unit"]
    var p3 = json["map"][targettarget]["locations"]["unit"]

    if (c1) {
        p1 = json["map"][territory]["locations"]["coasts"][c1]["unit"]
    }
    if (c2) {
        p2 = json["map"][target]["locations"]["coasts"][c2]["unit"]
    }
    if (c3) {
        p3 = json["map"][targettarget]["locations"]["coasts"][c3]["unit"]
    }

    var dif = [p2[0] - p1[0], p2[1] - p1[1]];
    var angle = Math.atan2(dif[0], dif[1])
    var normalized = [Math.sin(angle), Math.cos(angle)]

    p1 = [p1[0] + (normalized[0] * 9), p1[1] + (normalized[1] * 9)]

    if (target == targettarget) {
        var dif2 = [p3[0] - p1[0], p3[1] - p1[1]];
        var angle2 = Math.atan2(dif2[0], dif2[1])
        var normalized2 = [Math.sin(angle2), Math.cos(angle2)]

        p3 = [p3[0] - (normalized2[0] * 9), p3[1] - (normalized2[1] * 9)]

    }
    else {


        var dif2 = [p3[0] - p2[0], p3[1] - p2[1]];
        var angle2 = Math.atan2(dif2[0], dif2[1])
        var normalized2 = [Math.sin(angle2), Math.cos(angle2)]

        p3 = [p3[0] - (normalized2[0] * 9), p3[1] - (normalized2[1] * 9)]

    }


    var w1 = 0.5
    var w2 = 0.5;
    var w3 = 0.65;
    var w4 = 0.8;

    var a1 = lerp(p2, p3, w1)
    var a2 = lerp(p1, a1, w2)
    var a3 = lerp(p3, p2, w3)
    var a4 = lerp(p3, p2, w4)




    el = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    // el.setAttribute('d', "M" + p1[0] + "," + p1[1] + "Q" + p2[0] + "," + p2[1] + "," + p3[0] + "," + p3[1])
    // el.setAttribute('d', "M" + p1[0] + "," + p1[1] + "Q" + p2[0] + "," + p2[1] + "," + (p2[0] * wAvg + p3[0] * (1 - wAvg)) + "," + (p2[1] * wAvg + p3[1] * (1 - wAvg)) + "L" + p3[0] + "," + p3[1])
    // el.setAttribute('d', "M" + p1[0] + "," + p1[1] + "L" + (p1[0] + dif3[0] * 0.5) + "," + (p1[1] + dif3[1] * 0.5) + "," + p3[0] + "," + p3[1] + "," + p2[0] + "," + p2[1] + "," + "L" + p3[0] + "," + p3[1])


    if (target == targettarget) {
        el.setAttribute('d', "M" + p1[0] + "," + p1[1] + "L" + p3[0] + "," + p3[1] + "Z")
    }
    else {
        el.setAttribute('d', "M" + p1[0] + "," + p1[1] + "C" + a2[0] + " " + a2[1] + " " + p2[0] + " " + p2[1] + " " + a3[0] + " " + a3[1] + "L" + a4[0] + " " + a4[1],)
    }


    el.setAttribute('stroke', '#000')
    el.setAttribute('fill-opacity', '0')
    el.setAttribute('stroke-dasharray', '2 2')


    el.setAttribute('stroke-width', '2.5')

    var units = document.getElementById('orders');
    units.appendChild(el)


    if (target != targettarget) {


        el = document.createElementNS('http://www.w3.org/2000/svg', 'path')

        dif = [p3[0] - p2[0], p3[1] - p2[1]];
        angle = Math.atan2(dif[0], dif[1]) + Math.PI / 2
        normalized = [Math.sin(angle), Math.cos(angle)]

        el.setAttribute('d', "M" + (a4[0] + (normalized[0]) * 10) + "," + (a4[1] + (normalized[1]) * 10) + "L" + (a4[0] - (normalized[0]) * 10) + "," + (a4[1] - (normalized[1]) * 10))



        el.setAttribute('stroke', '#000')
        el.setAttribute('fill-opacity', '0')


        el.setAttribute('stroke-width', '2.5')

        units.appendChild(el)

    }

}

function drawUnit(json, territory, Type, country, coast, build = false) {


    var position = json["map"][territory]["locations"]["unit"]


    var layer = document.getElementById('units');

    if (Type == "A") {
        el = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        el.setAttribute('r', '6')
        el.setAttribute('cx', position[0])
        el.setAttribute('cy', position[1])
    }
    else {
        if (coast) {
            var position = json["map"][territory]["locations"]["coasts"][coast]["unit"]
        }

        el = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        el.setAttribute('d', "M" + (position[0] - 6) + "," + (position[1] - 2) + "L" + (position[0] + 6) + "," + (position[1] - 2) + "L" + position[0] + "," + (position[1] + 5) + "Z")
    }

    if (build) {
        el.setAttribute('fill-opacity', 0)
        el.setAttribute('stroke-dasharray', '2 2')
        el.setAttribute('stroke', "#000")
        el.setAttribute('stroke-width', '1')


    }
    else {
        // console.log(json["game"]["countries"]);
        // console.log(country);
        // console.log(territory)
        el.setAttribute('stroke', json["game"]["countries"][country]["color"])
        el.setAttribute('fill', json["game"]["countries"][country]["color"])
        el.setAttribute('fill-opacity', 0.6)
        el.setAttribute('stroke-width', '2')
    }






    layer.appendChild(el)






}

function drawOrders(json, moves) {
    document.getElementById('orders').innerHTML = "";

    for (var key in moves) {

        var c1 = false
        var c2 = false




        switch (moves[key]["action"]) {
            case "M":
                var m = moves[key]["move"].substring(0, 3)

                if (moves[key]["move"].charAt(3)) {
                    c1 = moves[key]["move"].substring(4)
                }
                drawMove(json, key, m, units[key]["coast"], c1)
                break;
            case "H":
                drawHold(json, key, units[key]["coast"])
                break;
            case "C":
                drawConvoy(json, key)
                break;
            case "S":

                var m1 = moves[key]["move"][0].substring(0, 3)
                var m2 = moves[key]["move"][1].substring(0, 3)
                var c1;
                var c2;


                if (moves[key]["move"][0] == moves[key]["move"][1] && units[moves[key]["move"][1]]["coast"]) {
                    c1 = units[moves[key]["move"][1]]["coast"];
                    c2 = c1
                }
                else {
                    if (moves[key]["move"][0].charAt(3)) {
                        c1 = moves[key]["move"][0].substring(4)
                    }

                    if (moves[key]["move"][1].charAt(3)) {
                        c2 = moves[key]["move"][1].substring(4)
                    }
                }

                drawSupport(json, key, m1, m2, units[key]["coast"], c1, c2)
                break;
        }
    }
}

function getBoard(year, season)
{
    
    moves = board[year][season]["M"]
    if(moves == []){moves={}}
    units = board[year][season]["U"]
    centerOwners = board[year]["SC"]
}

document.addEventListener('keydown', (event) => {
    var name = event.key.toUpperCase();
    // Alert the key name and key code on keydown
    valid = ["M", "H", "S", "C"];
    if (valid.includes(name)) {
        setAction(name);
    }
    else if (name == "Escape") {
        isSelected = false;
        setAction("M");
    }
}, false);




