// example: Concentration, up to 1 hour
let durationRegex = /(?:(?<concentration>Concentration)(?:\D*))?(?:((?<amount>\d+)\s+)?(?<units>[a-zA-Z]+))/

// foundry : orcbrew
const map = {
    "name" : "name",
    "type" : {
        default: "spell"
    },
    "data.description" : "description",
    // String / int
    "data.duration.value": {
        key: "duration",
        transform: (text) => {
            let match = durationRegex.exec(text);
            return match.groups && "amount" in match.groups ? match.groups["amount"] : "";
        }
    },
    // String
    "data.duration.units": {
        key: "duration",
        transform: (text) => {
            let match = durationRegex.exec(text);
            return match.groups && "units" in match.groups ? match.groups["units"] : text;
        }
    },
    // ? 
    "data.components.value": {
        default: ""
    },
    // String
    "data.materials.value" : "components.material-component",
    // Boolean
    "data.components.material": "components.material",
    // Boolean
    "data.components.vocal":  "components.verbal",
    // Boolean
    "data.components.somatic": "components.somatic",
    // Boolean
    "data.components.ritual": "ritual",
    // Boolean
    "data.components.concentration": {
        key: "duration",
        transform: (text) => text.includes("Concentration")
    },
    // Boolean
    "data.materials.consumed" : {
        // example: " ... which th spell consumes"
        key: "components.material-component",
        transform: ( text ) => text.includes("consumes")
    },
    // ? 
    "data.materials.cost" : {
        default:  ""
    },
    // ? 
    "data.materials.supply" : {
        default:  ""
    },
};


module.exports = map;