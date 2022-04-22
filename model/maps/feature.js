const map = {
    "name": "name",
    "description" : "data.description",
    /* TODO: List values should be parsed and adapted in natural language
        examples: "heavy -> "Heavy armour", "str" -> strength > X"
        other prereqs examples found: 
        "path-prereqs": {
          "race": {
            "half-orc": true,
            "half-orc-mark-of-finding-": true
          }
        }
    */
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