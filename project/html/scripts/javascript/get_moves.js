var moves = {};



var units = { "Con": { "type": "A" }, "Ank": { "type": "F" }, "Smy": { "type": "F" }, "Kie": { "type": "A" }, "Mun": { "type": "A" } };

var showCoasts = true;
var coastTerritories = [];

var isSelected = false;
var action = "m";
var selected;
var target;
var targetSelected = false;
var target2;

var json;


function territoryClick(id) {
    if (isSelected) {

        // move actions
        if (action == "m") {

            // hold
            if (id == selected) {
                window.moves[selected] = { "action": "h" };
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



                window.action = "m";
                window.isSelected = false;

            }
            else {
                if (selected == id || !units[id]) { //if unit is trying to support itself or there is no unit
                    return;
                }
                window.target = id;
                window.targetSelected = true;

            }
        }
    }
    else if (units[id]) {
        window.isSelected = true;
        window.selected = id;

    }
    setCoastVisibility()

}

function setAction(action) {

    if (isSelected) {
        if (action === "h") {
            window.moves[selected] = { "action": "h" };
            updateDisplay()

            window.isSelected = false;
        }
        else {
            window.targetSelected = false;
            window.action = action;
        }

    }
    else {
        if (action !== "h") {
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

        if (moves[key]["action"] != "h") {
            if (moves[key]["action"] == 'm') {
                inner += " - "
                inner += moves[key]["move"]

            }
            else {
                if (moves[key]["move"][0] == moves[key]["move"][1]) {
                    inner += " " + moves[key]["action"] + " " + moves[key]["move"][0] + " h"
                }
                else {
                    inner += " " + moves[key]["action"] + " " + moves[key]["move"][0] + " - " + moves[key]["move"][1]
                }
            }
        }
        else {
            inner += " h"
        }
        inner += "<br>"
    }
    document.getElementById("move_display").innerHTML = inner;
}

function setCoastVisibility() {
    for (var ter in coastTerritories) {
        if (!isSelected || (targetSelected && (coastTerritories[ter].id == target || units[target]["type"] == "A")) || (!targetSelected && (action != "m" || units[selected]["type"] == "A" || coastTerritories[ter].id == selected))) {
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
    map_json = json["map"]
    game = json["game"]

    var mapElement = document.getElementById('mapLayer');
    var textLayer = document.getElementById('textLayer');

    for (var key in map_json) {

        var el = document.createElementNS('http://www.w3.org/2000/svg', 'path')

        if (map_json[key]["sc"]) {
            if (map_json[key]["sc"]["country"]) {
                el.setAttribute('fill', game["countries"][map_json[key]["sc"]["country"]]["color"])
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



        if (map_json[key]["unit"]) {

            if (map_json[key]["unit"]["coast"]) {
                drawUnit(json, key, map_json[key]["unit"]["type"], map_json[key]["unit"]["country"], map_json[key]["unit"]["coast"])
            }
            else {
                drawUnit(json, key, map_json[key]["unit"]["type"], map_json[key]["unit"]["country"], false)

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

            if (map_json[key]["sc"]["country"]) {
                el.setAttribute('fill', game["countries"][map_json[key]["sc"]["country"]]["color"])
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

function drawMove(json, territory, target) {

    console.log(target)

    var p1 = json["map"][territory]["locations"]["unit"]
    var p2 = json["map"][target]["locations"]["unit"]

    var dif = [p2[0] - p1[0], p2[1] - p1[1]];



    // p1 = [p1[0] + dif[0] * 0.1, p1[1] + dif[1] * 0.1]
    // p2 = [p2[0] - dif[0] * 0.1, p2[1] - dif[1] * 0.1]

    angle = Math.atan2(dif[0], dif[1])

    var normalized = [Math.sin(angle), Math.cos(angle)]


    p1 = [p1[0] + (normalized[0] * 9), p1[1] + (normalized[1] * 9)]
    p2 = [p2[0] - (normalized[0] * 9), p2[1] - (normalized[1] * 9)]


    el = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    el.setAttribute('d', "M" + p1[0] + "," + p1[1] + "L" + p2[0] + "," + p2[1] + "Z")

    el.setAttribute('stroke', '#000')
    el.setAttribute('stroke-width', '3')

    var units = document.getElementById('orders');
    units.appendChild(el)

    el = document.createElementNS('http://www.w3.org/2000/svg', 'path')

    var arrowAngle = Math.PI * .75

    arrow1 = [Math.sin(angle-arrowAngle) * 10, Math.cos(angle-arrowAngle) * 10]
    arrow2 = [Math.sin(angle+arrowAngle) * 10, Math.cos(angle+arrowAngle) * 10]

    el.setAttribute('d', "M" + (p2[0] + arrow1[0]) + "," + (p2[1] + arrow1[1]) + "L" + p2[0] + "," + p2[1] + "L" + (p2[0] + arrow2[0]) + "," + (p2[1] + arrow2[1]))

    el.setAttribute('stroke', '#000')
    el.setAttribute('stroke-width', '3')
    el.setAttribute('fill-opacity', "0")

    var units = document.getElementById('orders');
    units.appendChild(el)

}



function drawHold(json, territory) {

    var position = json["map"][territory]["locations"]["unit"]

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

function drawSupport(json, territory, target, targettarget) {


    var p1 = json["map"][territory]["locations"]["unit"]
    var p2 = json["map"][target]["locations"]["unit"]
    var p3 = json["map"][targettarget]["locations"]["unit"]

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

    var wAvg = 0.5

    el = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    // el.setAttribute('d', "M" + p1[0] + "," + p1[1] + "Q" + p2[0] + "," + p2[1] + "," + p3[0] + "," + p3[1])
    el.setAttribute('d', "M" + p1[0] + "," + p1[1] + "Q" + p2[0] + "," + p2[1] + "," + (p2[0] * wAvg + p3[0] * (1 - wAvg)) + "," + (p2[1] * wAvg + p3[1] * (1 - wAvg)) + "L" + p3[0] + "," + p3[1])


    if (target == targettarget) {
        el.setAttribute('d', "M" + p1[0] + "," + p1[1] + "L" + p3[0] + "," + p3[1] + "Z")

    }


    el.setAttribute('stroke', '#000')
    el.setAttribute('fill-opacity', '0')
    el.setAttribute('stroke-dasharray', '4 5')


    el.setAttribute('stroke-width', '3')

    var units = document.getElementById('orders');
    units.appendChild(el)

    return;
    var p1 = json["map"][territory]["locations"]["unit"]
    var p2 = json["map"][target]["locations"]["unit"]
    var p3 = json["map"][targettarget]["locations"]["unit"]

    var dif23 = [p3[0] - p2[0], p3[1] - p2[1]];
    var angle23 = Math.atan2(dif23[0], dif23[1])
    var normalized23 = [Math.sin(angle23), Math.cos(angle23)]

    p3 = [p3[0] - (normalized23 * 9), p3[1] - (normalized23 * 9)]



    var dif12 = [p2[0] - p1[0], p2[1] - p1[1]];
    var angle12 = Math.atan2(dif12[0], dif12[1])
    var normalized12 = [Math.sin(angle12), Math.cos(angle12)]

    // p1 = [p1[0] + dif[0] * 0.1, p1[1] + dif[1] * 0.1]


    el = document.createElementNS('http://www.w3.org/2000/svg', 'path')

    el.setAttribute('d', "M" + p1[0] + "," + p1[1] + "Q" + p2[0] + "," + p2[1] + "," + p3[0] + "," + p3[1])

    el.setAttribute('stroke', '#000')
    el.setAttribute('fill-opacity', '0')
    el.setAttribute('stroke-dasharray', '4 5')


    el.setAttribute('stroke-width', '3')

    var units = document.getElementById('orders');
    units.appendChild(el)
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


    el.setAttribute('stroke', json["game"]["countries"][country]["color"])
    el.setAttribute('fill', json["game"]["countries"][country]["color"])
    el.setAttribute('fill-opacity', 0.6)

    el.setAttribute('stroke-width', '2')
    el.setAttribute("font-size", "8px")




    layer.appendChild(el)






}


function drawOrders(json, moves) {
    document.getElementById('orders').innerHTML = "";

    for (var key in moves) {

        switch (moves[key]["action"]) {
            case "m":
                drawMove(json, key, moves[key]["move"])
                break;
            case "h":
                drawHold(json, key)
                break;
            case "c":
                drawConvoy(json, key)
                break;
            case "s":
                drawSupport(json, key, moves[key]["move"][0], moves[key]["move"][1])
                break;
        }
    }
}

document.addEventListener('keydown', (event) => {
    var name = event.key;
    // Alert the key name and key code on keydown
    valid = ["m", "h", "s", "c"];
    if (valid.includes(name)) {
        setAction(name);
    }
    else if (name == "Escape") {
        setAction("m");
    }
}, false);




