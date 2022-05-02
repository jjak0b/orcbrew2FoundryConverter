class Asset {
    /**
     * 
     * @param {String} type 
     * @param {String} orcbrewKey 
     * @param {Object} convertedData 
     */
    constructor(type, orcbrewKey, convertedData ) {
        this.type = type;
        this.orcbrewKey = orcbrewKey;
        this.convertedData = convertedData;
    }
}

module.exports = Asset;