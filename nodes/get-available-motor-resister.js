/*
    GetAvailableAnimations  node
        * input: message (any).
        * command: get all available animations  of a the configured robot.
        * output:  response with the list of tha available animations.
*/

module.exports = function(RED) {
	function getAvailableMotorRegisters(config) {
		RED.nodes.createNode(this, config);
		this.config = config;
		var node = this;

		const butterClientProvider = require('../butter-client/butter-client-provider');

		node.on('input', async function(msg) {
			// create butter client.
			const butterHttpClient = butterClientProvider.GetClient(node.config.robotIp);

			let robotIp = node.config.robotIp;
			let reload = node.config.reload;
			let isDebugMode = node.config.debugMode;

			// check if message has correct json payload - if yes run it instead.
			if (msg.payload.robotIp != undefined) {
				robotIp = msg.payload.robotIp;
				reload = msg.payload.reload;
			}

			// getting Available Motor Registers.
			try {
				if (isDebugMode) this.warn(`getting the Available get Available Motor Registers of robot: ${robotIp} `);
				let flag = false;
				if (reload) flag = true;
				butter_response = await butterHttpClient.getAvailableMotorRegisters(motorName, (readableOnly = False));

				if (isDebugMode) this.warn(`butter response is ${JSON.stringify(butter_response.data)}`);
				// prints operation result.
				console.log(butter_response.data);
				node.send({ payload: butter_response.data });
			} catch (error) {
				if (isDebugMode) this.warn(`failed to get the robot available motor registers \n${error}`);
			}
		});
	}

	// register node type.
	RED.nodes.registerType('get-available-motor-resister', getAvailableMotorRegisters);
};
