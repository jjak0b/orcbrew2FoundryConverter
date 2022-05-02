const Asset = require("../model/Asset");

class AssetRepository {

    /**
     * @type {AssetRepository}
     */
    static instance;

    constructor(){
        /**
         * @type {Map<String,Map<String, Object>>}
         */
        this.dataSource = new Map();
    }

    /**
     * 
     * @returns {AssetRepository}
     */
    getInstance() {
        if( !instance ) {
            instance = new AssetRepository();
        }
        return instance;
    }

    /**
     * 
     * @param {Asset} asset 
     */
    addAsset(asset) {
        let assetMap = this.dataSource.get(asset.type);
        if( !assetMap ) {
            assetMap = new Map();
            this.dataSource.set(asset.type, assetMap);
        }

        assetMap.set(asset.orcbrewKey, asset );
    }

    /**
     * 
     * @param {String} type 
     * @param {String} orcbrewKey 
     * @returns {Asset}
     */
    getAsset(type, orcbrewKey) {
        let assetMap = this.dataSource.get(type);
        return assetMap ? assetMap.get(orcbrewKey) : null;
    }
}


module.exports = AssetRepository;