
/**
 * 
 * @param {String} seed 
 * @param {Integer} length 
 * @returns 
 */
 function createID(seed, length=16) {
    let result           = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
   return result;
}


module.exports = {
    createID
}