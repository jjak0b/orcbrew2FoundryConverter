// example: Concentration, up to 1 hour
let durationRegex = /(?:(?<concentration>Concentration)(?:\D*))?(?:((?<amount>\d+)\s+)?(?<units>[a-zA-Z]+))/

// foundry : orcbrew
const map = {
    "name" : "name",
    "description": "data.description",
    "duration": {
        // String / int
        key: "data.duration.value",
        transform: (text) => {
            let match = durationRegex.exec(text);
            return match.groups && "amount" in match.groups ? match.groups["amount"] : "";
        }
    },
    "duration": [
        {
            // String
            key: "data.duration.units",
            transform: (text) => {
                let match = durationRegex.exec(text);
                return match.groups && "units" in match.groups ? match.groups["units"] : text;
            }
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
            transform: ( text ) => text.includes("consumes")
        }
    ],
    // Boolean
    "components.material": "data.components.material",
    // Boolean
    "components.verbal": "data.components.vocal",
    // Boolean
    "components.somatic": "data.components.somatic",
    // Boolean
    "ritual": "data.components.ritual"
};


module.exports = map;