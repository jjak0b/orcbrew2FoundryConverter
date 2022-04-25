const objectMapper = require("object-mapper");

const selectionsMap = {
    "alignment" : {
        "option.key": {
            key: "data.details.alignment",
            transform: (value) => value.split('-').map(capitalize).join(' ')
        }
    },
    "background" : {
        "option.key": {
            key: "data.details.background",
            transform: (value) => capitalize(value)
        }
    },
    "languages": {
        "options[].key": "data.traits.languages.value[]+"
    },
    "ability-scores" : {
        "option.map-value.str" : "data.abilities.str.value",
        "option.map-value.dex" : "data.abilities.dex.value",
        "option.map-value.con" : "data.abilities.con.value",
        "option.map-value.int" : "data.abilities.int.value",
        "option.map-value.wis" : "data.abilities.wis.value",
        "option.map-value.cha" : "data.abilities.cha.value",
    },
    "treasure" : {
        "options[]": [
            {
                key: "data.currency.gp",
                transform: (option) => option.key == "gp" ? option["map-value"]["quantity"] : 0,
                default: 0
            },
            {
                key: "data.currency.sp",
                transform: (option) => option.key == "sp" ? option["map-value"]["quantity"] : 0,
                default: 0
            },
            {
                key: "data.currency.cp",
                transform: (option) => option.key == "cp" ? option["map-value"]["quantity"] : 0,
                default: 0
            },
            {
                key: "data.currency.pp",
                transform: (option) => option.key == "pp" ? option["map-value"]["quantity"] : 0,
                default: 0
            },
            {
                key: "data.currency.ep",
                transform: (option) => option.key == "ep" ? option["map-value"]["quantity"] : 0,
                default: 0
            }
        ]
    }
}


const map = {
    "character.values.character-name": "name",
    "character.values.image-url": "img",
    "character.values.description": "data.details.biography.value",
    "character.values.flaws": "data.details.flaw",
    "character.values.ideals": "data.details.ideal",
    "character.values.bonds": "data.details.bond",
    "character.values.personality-trait-1": "data.details.trait",
    "character.values.xps": "data.details.xp.value",
    "character.values.current-hit-points": "data.attributes.hp.value",
    "character.selections[]": [
        {
            // key: "data",
            transform: (selection, srcObj, destObj) => {
                if( selection.key in selectionsMap ) {
                    return objectMapper(selection, destObj, selectionsMap[selection.key])
                }
            }
        }
    ]
    
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = map;