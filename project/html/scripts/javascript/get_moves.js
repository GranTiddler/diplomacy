var moves = {};

var units = { "Rom": "A", "Nap": "F", "Bul": "F" };

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
                if (selected == id || !units[id]) { //if unit is trying to support itself
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
        if (!isSelected || (targetSelected && (coastTerritories[ter].id == target || units[target] == "A")) || (!targetSelected && (action != "m" || units[selected] == "A" || coastTerritories[ter].id == selected))) {
            coastTerritories[ter].style.display = "block";
        }
        else {
            coastTerritories[ter].style.display = "none";

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

