const path = require('path');
const fs = require("fs");
const { edn2Obj, orcbrew2Foundry } = require("./index");

const args = process.argv.slice(2);
const inputFilename = args[0];

var parentDir = path.dirname(inputFilename);

const outputFilename = args.length > 1 ? args[1] : `${parentDir}/output.json`;

if( !inputFilename ){
	console.error("No edn/orcbrew file provided")
	
}
else{
	fs.readFile( inputFilename, "utf-8", (err, ednString) => {
		if (err) {
			throw err;
		}
		 
		const orcbrewObj = edn2Obj(ednString);
		const foundryCompendiums = orcbrew2Foundry(orcbrewObj);
		const jsonStr = JSON.stringify(foundryCompendiums, null, 2);
		fs.writeFileSync(outputFilename, jsonStr, "utf-8");
		console.log("Foundry data:", jsonStr );
	});
}