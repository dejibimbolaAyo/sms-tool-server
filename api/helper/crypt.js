const Bcrypt = require("bcrypt")
const saltRounds = 10;
/**
 * Generate crypt and decrypt
 * @param plainString
 */

exports.getHash = (plainString) => {
    return Bcrypt.hash(plainString, saltRounds)
        .then((hash) => hash)
        .catch((e) => console.log(e.message));
 }

 exports.getSalt = (length) => {
    return Bcrypt.genSaltSync(length)
 }

 exports.compareHash = (salted, hash) => {
    return Bcrypt.compare(salted, hash)
        .then((res) => res)
        .catch((e) => console.log(e.message));
 }