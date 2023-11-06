var moves = {};

var units = { "Rom": { "type": "A" }, "Nap": { "type": "F" }, "Bul": { "type": "F" } };

var showCoasts = true;
var coastTerritories = [];

var isSelected = false;
var action = "m";
var selected;
var target;
var targetSelected = false;
var target2;


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

async function createButtons() {

    const json = await fetch("/map.json")
        .then((res) => {
            return res.json();
        });

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


}

async function createGraphics() {

}

async function drawCommand()
{

}

async function drawUnit(territory, Type)
{

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

createButtons()
