// Thanks to god ( or thanks to its developer ) ... a library that works ...
const edn = require('@yellowdig/cljs-tools').edn;

/**
 * 
 * @param {String} ednString content in EDN format
 */
function edn2Obj( ednString ) {
	const obj = edn.decode(ednString);
	return obj;
}

/**
 * Map and adapt orcbrew data to Foundry data
 * @param {Object} orcbrewObj 
 */
function orcbrew2Foundry( orcbrewObj ) {
	// TODO
	return orcbrewObj;
}

module.exports = {
	edn2Obj,
	orcbrew2Foundry
};
