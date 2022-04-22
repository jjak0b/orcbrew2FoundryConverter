// Thanks to god ( or thanks to its developer ) ... a library that works ...
const edn = require('@yellowdig/cljs-tools').edn;
const objectMapper = require('object-mapper');


const mapSpell = require("./model/maps/spell");
const mapClass = require("./model/maps/class");
const mapSubClass = require("./model/maps/subclass");
const mapFeat = require("./model/maps/feature");

const spellDefaults = require("./model/defaults/spell");
const classDefaults = require("./model/defaults/class");
const subClassDefaults = require("./model/defaults/subclass");
const featDefaults = require("./model/defaults/feature");

const contentMap = {
    "classes" : {
        key: "items[]+",
        transform: (obj) => toList(obj, mapClass, classDefaults)
    },
    "subclasses" : {
        key: "items[]+",
        transform: (obj) => toList(obj, mapSubClass, subClassDefaults)
    },
    "spells" : {
        key: "items[]+",
        transform: (obj) => toList(obj, mapSpell, spellDefaults)
    },
    "feats" : {
        key: "items[]+",
        transform: (obj) => toList(obj, mapFeat, featDefaults)
    },
    "invocations" : {
        key: "items[]+",
        transform: (obj) => toList(obj, mapFeat, featDefaults)
    }
}

/**
 * 
 * @param {Object} src object to map
 * @param {Object} map mapper obj
 * @param {Object} defaults default dest values
 * @returns 
 */
function toList(src, map, defaults) {
    let items = [];
    let item = null;
    for (const key in src) {
        item = objectMapper(src[key], Object.assign({}, defaults), map);
        items.push(item);
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
 * Map and adapt orcbrew data to Foundry data
 * @param {Object} orcbrewObj 
 * @returns {Object}
 */
function orcbrew2Foundry( orcbrewObj ) {
	
	let contentKeys = Object.keys(orcbrewObj);

	// if keys are content-related (single orcbrew content)
	if( contentKeys.some((key) => (key in contentMap)) ) {
		return objectMapper(orcbrewObj, contentMap);
	}
	// else keys are about a map of orcbrew contents
	else {
		let contentModules = [];
		let contentModule = null;
		for (const key of contentKeys) {

			let foundryPackage = objectMapper(orcbrewObj[ key ], contentMap );

			contentModule = {
				name: key,
				data: foundryPackage
			};

			contentModules.push(contentModule);
		}
		return {
			"mudules": contentModules
		}
	}
}

module.exports = {
	edn2Obj,
	orcbrew2Foundry
};
