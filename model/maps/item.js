const { capitalize } = require("../../utils");
const { createID } = require("./utils/asset");

const map = {
    "key": {
        key: "name",
        transform: (value) => value.split('-').map(capitalize).join(' ')
    },
    "map-value.quantity": "data.quantity",
    "id": {
        key: "_id",
        transform: (value) => createID(value)
    }
}

module.exports = map;