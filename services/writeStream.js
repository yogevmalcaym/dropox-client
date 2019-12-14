const fs = require("fs");
// let writeStream;
// module.exports = class WriteStream {
// 	constructor(path) {
// 		writeStream = fs.createWriteStream(path);
// 	}
// 	get stream() {
// 		return writeStream;
// 	}
// };
module.exports = path => fs.createWriteStream(path);
