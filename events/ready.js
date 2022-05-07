module.exports = {
	name: "ready",		//event name
	once: true,			//if the event should run only once
	
	execute() {
		console.log("Hi there");
	}
};