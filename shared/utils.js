import path from "path";

// Exports.
// General utility methods.
export const toJSON = string => JSON.parse(string);
export const toString = json => JSON.stringify(json);
export const joinPath = (...args) => path.join(...args);

// Returns last part and the rest of string by sign.
export const splitStringEndAndRest = (string, sign) => {
	const stringSplitted = string.split(sign);
	const [ending] = stringSplitted.splice(-1, 1);
	// Concatenate back if there is more than one `sign`
	const rest = stringSplitted.join(sign);
	return [ending, rest];
};
