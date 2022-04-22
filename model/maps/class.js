const skills = require("./skill");
const modifiers = require("./modifiers");

const map = {

    "name": "name",
    // "" : "data.description" // Not defined in src -> should be computed from combination of src keys
    "hit-die" : {
        key: "data.hitDice",
        transform: (dice) => `d${dice}`
    },
    "profs.save" : {
        key: "data.saves",
        transform: (options) => transformOptions(options, modifiers.associativeMap)
    },
    "profs.skill-options.choose": "data.skills.number",
    "profs.skill-options.options" : {
        key: "data.skills.choices",
        transform: (options) => transformOptions(options, skills.associativeMap)
    },
    // "profs.skill-expertise-options.options" : {
    //    key: "doesnt exists",
    //    transform: => transformOptions(options, skills.associativeMap)
    // },
    
    "spellcasting.ability": {
        key: "data.spellcasting.ability",
        transform: (value) => modifiers.associativeMap[value] || ""
    }
};

/**
 * 
 * @param {Object} options 
 * @param {Object} associativeMap 
 * @returns 
 */
 function transformOptions(options, associativeMap) {
    let choices = [];
    for( key in options ) {
        if( key in associativeMap )
            choices.push(associativeMap[key]);
    }
    return choices;
}

module.exports = map;