// Thanks to god ( or thanks to its developer ) ... a library that works ...
const edn = require('@yellowdig/cljs-tools').edn;
const objectMapper = require('object-mapper');
const Package = require("./model/Package");
const { createID } = require("./utils/asset");

const AssetRepository = require("./repositories/AssetRepository");
const assetRepo = AssetRepository.prototype.getInstance();

const mapSpell = require("./model/maps/spell");
const mapClass = require("./model/maps/class");
const mapSubClass = require("./model/maps/subclass");
const mapFeat = require("./model/maps/feature");
const mapCharacter = require("./model/maps/character");

const spellDefaults = require("./model/defaults/spell");
const classDefaults = require("./model/defaults/class");
const subClassDefaults = require("./model/defaults/subclass");
const featDefaults = require("./model/defaults/feature");
const characterDefaults = require("./model/defaults/character");

const Asset = require('./model/Asset');

const contentMap = {
    "classes" : {
        key: "classes",
        transform: (obj) => toList("class", obj, mapClass, classDefaults)
    },
    "subclasses" : {
        key: "subclasses",
        transform: (obj) => toList("subclass", obj, mapSubClass, subClassDefaults)
    },
    "spells" : {
        key: "spells",
        transform: (obj) => toList("spell", obj, mapSpell, spellDefaults)
    },
    "feats" : {
        key: "feats",
        transform: (obj) => toList("feat", obj, mapFeat, featDefaults)
    },
    "invocations" : {
        key: "invocations",
        transform: (obj) => toList("invocation", obj, mapFeat, featDefaults)
    },
    "character": {
        key: "character",
        transform: (obj) => {
            let item = objectMapper(obj["character"], Object.assign({}, characterDefaults), mapCharacter);
            return item;
        }
    }
}

/**
 * @param {String} type item type
 * @param {Object} src object to map
 * @param {Object} map mapper obj
 * @param {Object} defaults default dest values
 * @returns 
 */
function toList(type, src, map, defaults) {
    let items = [];
    let item = null;
    for (const key in src) {
        item = objectMapper(src[key], Object.assign({}, defaults), map);
        if( !item._id )
            item._id = createID(key);
        items.push(item);

        assetRepo.addAsset(new Asset(
            type,
            key,
            item
        ));
    }

    return items;
}


/**
 * 
 * @param {String} ednString content in EDN format
 * @returns {Object}
 */
function edn2Obj( ednString ) {
	const obj = edn.decode(ednString);
	return obj;
}

/**
 * 
 * @param {Object} value 
 * @param {Integer} depth
 */
function getFirstNestedObjectAtDepth(value, depth ) {
    if( depth <= 0 ) {
        return value;
    }
    else {
        for( const key in value ) {
            if( value[ key ] === Object(value[ key ]) ) {
                return getFirstNestedObjectAtDepth(value[ key ], depth-1);
            }
        }
    }
}

/**
 * Map and adapt orcbrew data to Foundry data
 * @param {Object} orcbrewObj  orcbrew content data
 * @param {Object} orcbrewCharacterObj orcbrew character data
 * @returns {Array<Package>} Array of compendium
 */
function orcbrew2Foundry( orcbrewObj, orcbrewCharacterObj = null ) {

	let contentKeys = Object.keys(orcbrewObj);
    let compendiums = [];

	// if keys are content-related (single orcbrew content)
    // then normalize to orcbrewObj = object[ valueOf('option-pack') ]
	if( contentKeys.some((key) => (key in contentMap)) ) {
        
        // first level is the assetType, second level is the assetName
        let objContainingContentName = getFirstNestedObjectAtDepth(orcbrewObj, 2);
        if( !('option-pack' in objContainingContentName)  ) {
            console.error("Error: Expected 'option-pack' field not found on depth level 2");
        }
        else {
            let temp = {};
            contentKeys = [
                objContainingContentName['option-pack']
            ];
            temp[ contentKeys[0] ] = orcbrewObj;
            // replace its value
            orcbrewObj = temp;
        }
	}
    // Now keys are about a map of orcbrew contents
	
    for (const key of contentKeys) {

        let foundryPackage = objectMapper(orcbrewObj[ key ], contentMap );

        let compendiumLabel = ""+key;
        let compendiumName = (""+key).replace(/\W/g, '-').toLowerCase();
        let items = [];

        for( const orcbrewAssetType in foundryPackage ) {
            items = foundryPackage[orcbrewAssetType];
            if( Array.isArray(items) && items.length > 0 ) {
                compendium = new Package(
                    compendiumName,
                    compendiumLabel,
                    "Item",
                    items
                );
    
                compendiums.push(compendium);
            }
        }
    }



    if( orcbrewCharacterObj ) {
        let playerName = orcbrewCharacterObj.character["player-name"];
        let characterName = orcbrewCharacterObj.character["character-name"];

        compendiumName = "Character";
        compendiumLabel = "Character";
        
        items = [];

        items.push(
            objectMapper(orcbrewObj[ "character" ], contentMap )
        );

        compendiums.push(new Package(
            compendiumName,
            compendiumLabel,
            "Actor",
            items
        ));
    }

    return compendiums
}

module.exports = {
	edn2Obj,
	orcbrew2Foundry
};
