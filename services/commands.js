//If a method is a continues one, it should return an object with 'type' property (for the client)
// else don't return nothing
module.exports = {
	mikeCheck: ({responseData}) => {
		console.log("Mike Check: " + responseData);
	}
};
