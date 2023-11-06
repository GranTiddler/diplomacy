var moves = {};

var isSelected = false;
var action = "m";
var selected;
var target;
var targetSelected = false;
var target2;


function territoryClick(id) {
    if (isSelected) {

        
        if (action === "m") {
            
            if (id == selected) {
                window.moves[selected] = { "action": "h" };
            }
            else {
                
                window.target = id;
                
                window.moves[selected] = { "action": action, "move": target };
            }
            window.isSelected = false;
        }
        else {
            if (targetSelected) {
                window.target2 = id;
                window.targetSelected = false;
                
                window.moves[selected] = { "action": action, "move": [target, target2] };
                window.action = "m";
                window.isSelected = false;
                
            }
            else {
                if (selected == id) {
                    return;
                }
                window.target = id;
                window.targetSelected = true;
            }

        }
    }
    else {
        window.isSelected = true;
        window.selected = id;
    }

}

function setAction(action) {
    if (isSelected) {
        if (action === "h") {
            window.moves[selected] = { "action": "h" };
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
