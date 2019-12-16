const fs = require("fs");
// Handles any interation with the fs module.
module.exports = {
    isExists: path => fs.existsSync(path),
    createFolder: path => fs.mkdirSync(path),
    getWriteStream: path => fs.createWriteStream(path)
}
