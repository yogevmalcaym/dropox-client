const fs = require("fs");
module.exports = {
    isExists: path => fs.existsSync(path),
    createFolder: path => fs.mkdirSync(path),
    getWriteStream: path => fs.createWriteStream(path)
}
