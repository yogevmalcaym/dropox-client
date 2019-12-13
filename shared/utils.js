// Holds general utility methods.
module.exports = {
	stringToJSON: string => JSON.parse(string),
	JSONToString: json => JSON.stringify(json)
};