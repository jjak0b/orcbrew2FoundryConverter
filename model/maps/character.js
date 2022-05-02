const objectMapper = require("object-mapper");
const { capitalize } = require("../../utils");
const { createID } = require("./utils/asset");

const AssetRepository = require("../../repositories/AssetRepository");
const assetRepo = AssetRepository.prototype.getInstance();

const itemMap = require("./item");
const itemDefaults = require("../defaults/item");
const skills = require("./skill");

const customItemMap = {
    "id": {
        key: "_id",
        transform: (value) => createID(value)
    },
    "name" : "name",
    "quantity": "data.quantity"
};

const spellKnownMap = {
    "options[]":{
        key: "data.items[]+",
        transform: (option, srcObj, destObj) => {
            const asset = assetRepo.getAsset("spell", option.key);
            return asset ? asset.convertedData : null;
        }
    }
};

const treasureMap = {
    "gp": {
        "map-value.quantity": "gp"
    },
    "sp": {
        "map-value.quantity": "sp"
    },
    "cp": {
        "map-value.quantity": "cp"
    },
    "pp": {
        "map-value.quantity": "pp"
    },
    "ep": {
        "map-value.quantity": "ep"
    }
};

const levelUnlockKeyRgex = /level-(?<level>\d+)/i;
const classMap = {
    "skill-proficiency" : {
        "options[].key" : {
            key: "data.skills.value[]+",
            transform: (key) => key in skills.associativeMap ? skills.associativeMap[key] : key
        }
    },
    // unlocks at levels
    "levels": {
        "options[]": [
            // features
            {
                key: "data.items[]+",
                transform: (option) => {
                    let match = levelUnlockKeyRgex.exec(option.key);
                    if( match.groups && match.groups["level"] ) {
                        const level = match.groups["level"];
                        let items = [];
                        let features = [];
                        for( const selection of option.selections ) {
                            switch(selection.key) {
                                case "hit-points":
                                    // none / unsupported
                                    break
                                case "asi-or-feat":
                                    let asset = null;
                                    switch(selection.option.key) {
                                        case "ability-score-improvement":
                                            features.push("asi");
                                            // note: TODO may there be the specific asi mod value
                                            break;
                                        case "feat":
                                            break
                                    }
                                    break
                                default: // class feature
                                    if( selection.options ) {
                                        features = features.concat( selection.options.map((option) => option.key ) );
                                    }
                                    else if (selection.option) {
                                        features.push( selection.option.key );
                                    }
                                    break
                            }
                        }
                    }
                }
            }
        ]
    }
};

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
        "options":  {
            key: "data.currency",
            transform: (options, srcObj, destObj ) => {
                let value = {};
                for( const option of options) {
                    value = Object.assign(value, transformOptions(option, treasureMap, null ) );
                }

                return value;
            }
        }
    },
    "equipment": {
        "options[]" : {
            key: "data.items[]+",
            transform: (option) => objectMapper(option, itemMap)
        }
    },
    "feat": {
        "options[]": {
            key: "data.items[]+",
            transform: (option) => {
                let asset = assetRepo.getAsset("feat", option.key);
                return asset && asset.convertedData ? asset.convertedData : null;
                
            }
        }
    },
    "class": {
        "options[]" : [
            {
                // class related staff
                key: "data.items[]+",
                transform: (option, srcObj, destObj) => {
                    const asset = assetRepo.getAsset("class", option.key);
                    let classData = asset ? asset.convertedData : null;
    
                    classdata = transformOptions(option2, classMap, classData);
                    
 
                    return classData;
                }
            },
            // spell and features related staff
            {
                key: "data.items[]+",
                transform: (option, srcObj, destObj) => {
                    // const asset = assetRepo.getAsset("class", option.key);

                    for( const option2 of option.selections ) {
                        if( option2.key.endWith("cantrips-known")
                        || option2.key.endWith("spells-known") ) {
                            items = objectMapper(option2, destObj, spellKnownMap);
                        }
                    }
                }
            }
        ]
    }
};


const map = {
    "id": {
        key: "_id",
        transform: (value) => createID(value)
    },
    "values.character-name": "name",
    "values.image-url": "img",
    "values.description": "data.details.biography.value",
    "values.flaws": "data.details.flaw",
    "values.ideals": "data.details.ideal",
    "values.bonds": "data.details.bond",
    "values.personality-trait-1": "data.details.trait",
    "values.xps": "data.details.xp.value",
    "values.current-hit-points": "data.attributes.hp.value",
    "selections[]": [
        {
            key: "data.items[]+",
            transform: (selection, srcObj, destObj) => transformOptions(selection, selectionsMap, destObj)
        }
    ],
    "values.custom-equipment[]": {
        key: "data.items[]+",
        transform: (item) => objectMapper(item, customItemMap)
    }
}


function transformOptions(option, optionMap, destObj) {
    if( option.key in optionMap ) {
        if( destObj )
            return objectMapper(option, destObj, optionMap[option.key]);
        else 
            return objectMapper(option, optionMap[option.key]);
    }
};

module.exports = map;