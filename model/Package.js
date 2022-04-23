class Package {

    /**
     * 
     * @param {String} compendiumName 
     * @param {String} compendiumLabel 
     * @param {String} itemType 
     * @param {Array<Object>} items 
     */
    constructor( compendiumName, compendiumLabel, itemType, items) {
        const packageRoot = "world";
        this.package = `${packageRoot}.${compendiumName}`;
        
        this.metadata = {
            "name": compendiumName,
            "label": compendiumLabel,
            "type": itemType,
            "entity": itemType,
            "package": packageRoot,
            "private": false,
            "system": "dnd5e",
         // "package": "dnd5e",
            "path": `./packs/${compendiumName}.db`
        }
        this.type = itemType;
        this.items = items;
        this.source = {
            "world": "test",
            "system": "dnd5e",
            // these are the system and core versions supported atm
            "version": {
                "core": "9.269",
                "system": "1.5.7"
            }
        }
    }

}

module.exports = Package;