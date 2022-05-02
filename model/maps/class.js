const objectMapper = require("object-mapper");

const skills = require("./skill");
const modifiers = require("./modifiers");
const feature = require("./feature");

const traitMap = {
    "level": {
        key: "data.requirements",
        transform: (list) => list ? list.toString() : null
    }
}

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
    },

    "traits[]": {
        key: "",
        transform: (trait) => {
            let mTraitMap = Object.assign({}, feature);
            mTraitMap = Object.assign(mTraitMap, traitMap);

            return objectMapper(trait, mTraitMap);            
        }
    }
};

/**
 * Map keys of options to values of associativeMap into an array
 * @param {Object} options 
 * @param {Object} associativeMap 
 * @returns {Array<Object>}
 */
 function transformOptions(options, associativeMap) {
    let choices = [];
    for( const key in options ) {
        if( key in associativeMap )
            choices.push(associativeMap[key]);
    }
    return choices;
}

module.exports = map;