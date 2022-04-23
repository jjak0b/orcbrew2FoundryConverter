const units = require("./units");
// example: Concentration, up to 1 hour
const durationRegex = /(?:(?<concentration>concentration)(?:\D*))?(?:((?<amount>\d+)\s+)?(?<units>[a-zA-Z]+))/i
const castingTimeRegex = /(?:((?<amount>\d+)\s+)?(?<units>\D+))/i
const rangeRegex = /(?:((?<amount>\d+)\s+)?(?<units>[a-zA-Z]+))/i
const attackRegex = /make a (?<attackType>melee|ranged) (?:(?<weaponType>spell|weapon)? )attack/i
const schools = {
    associativeMap: {
        "abjuration": "abj",
        "conjuration": "con",
        "divination": "div",
        "enchantment": "enc",
        "evocation": "evo",
        "illusion": "ill",
        "necromancy": "nec",
        "transmutation": "trs"
    }
};

// foundry : orcbrew
const map = {
    "name" : "name",
    "description": [
        {
            key: "data.description"
        },
        {
            key: "data.actionType",
            transform: (text) => {        
                let attackMatch = attackRegex.exec(text);
                let actionType = "";
                if( attackMatch ) {
                    let type = ""
                    if( attackMatch.groups && "attackType" in attackMatch.groups ) {
                        switch (attackMatch.groups["attackType"].toLowerCase()) {
                            case "melee":
                                type = "m";
                                break;
                            case "ranged":
                                type = "r";
                                break;
                            default:
                                type = "r";
                                break;
                        }
                    }
                    let weapon = ""
                    if( attackMatch.groups && "weaponType" in attackMatch.groups ) {
                        switch (attackMatch.groups["weaponType"].toLowerCase()) {
                            case "spell":
                                weapon = "s";
                                break;
                            case "weapon":
                                weapon = "w";
                                break;
                            default:
                                weapon = "s";
                                break;
                        }
                    }

                    actionType = `${type}${weapon}ak`;
                }
                
                return actionType;
            }
        }
    ],
    "level": "data.level",
    "school": {
        key: "data.school",
        transform: (text) => {
            if( text ){
                text = text.toLowerCase();
                if( text in schools.associativeMap ) {
                    return schools.associativeMap[ text ];
                }
            }
            return text;
        }
    },
    "casting-time": [
        {
            key: "data.activation.cost",
            transform: (text) => {
                let match = castingTimeRegex.exec(text.toLowerCase());
                return match.groups && "amount" in match.groups ? match.groups["amount"] : text;
            }
        },
        {
            key: "data.activation.type",
            transform: (text) => getUnitFromRegex(castingTimeRegex, text, "units")
        }
    ],
    "duration": [
        {
            // String / int
            key: "data.duration.value",
            transform: (text) => {
                let match = durationRegex.exec(text);
                return match.groups && "amount" in match.groups ? match.groups["amount"] : "";
            }
        },
        {
            // String
            key: "data.duration.units",
            transform: (text) => getUnitFromRegex(durationRegex, text, "units")
        },
        {
            // Boolean
            key: "data.components.concentration",
            transform: (text) => text.includes("Concentration")
        }
    ],
    "components.material-component": [
        {
            // String
            key: "data.materials.value"
        },
        {
            // Boolean
            // example: " ... which th spell consumes"
            key: "data.materials.consumed",
            transform: ( text ) => text ? text.includes("consumes") : false
        }
    ],
    // Boolean
    "components.material": "data.components.material",
    // Boolean
    "components.verbal": "data.components.vocal",
    // Boolean
    "components.somatic": "data.components.somatic",
    // Boolean
    "ritual": "data.components.ritual",
    "range" : [
        {
            key: "data.range.value",
            transform: (text) => {
                let match = castingTimeRegex.exec(text);
                return match.groups && "amount" in match.groups ? match.groups["amount"] : text;
            }
        },
        {
            key: "data.range.units",
            transform: (text) => getUnitFromRegex(rangeRegex, text, "units")
        }
    ]
};

function getUnitFromRegex( regex, text, group ) {
    text = text.toLowerCase();
    let match = regex.exec(text);
    if( match.groups && group in match.groups ) {
        if( match.groups[ group ] in units.associativeMap ) {
            return units.associativeMap[ match.groups[ group ] ];
        }
        else {
            return match.groups[ group ];
        }
    }
    return text;
}

module.exports = map;