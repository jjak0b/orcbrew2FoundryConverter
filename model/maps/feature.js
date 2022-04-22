const map = {
    "name": "name",
    "description" : "data.description",
    // TODO: List values should be parsed and adapted in natural language
    // examples: "heavy -> "Heavy armour", "str" -> strength > X"
    "prereqs[]": {
        key: "data.requirements",
        transform: (list) => list.toString()
    },
    /* TODO: apply props as feature effects
    "props" : {
        key: "a lot of attrs depends on this"
        transform: (val) => { val }
    }*/
}



module.exports = map;