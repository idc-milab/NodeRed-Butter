/*
    SetMotorRegister node
        * input: message (any).
        * command: set a value to a motor register on configured robot.
        * output: operation success/failure response.
*/
module.exports = function(RED) {
	function GetDistNode(config) {
		RED.nodes.createNode(this, config);
		this.config = config;

		const DebugLogger = require('../logger/debug_logger');
		//const butterClientProvider = require('../butter-client/butter-client-provider');

		//this.butterHttpClient = butterClientProvider.GetClient(this.config.robotIp);
		this.debugLogger = new DebugLogger(this, this.config.debugMode);

		this.on('input', async function(msg) {
			// let robotIp = this.config.robotIp;
			// let motorName = this.config.motorName;
			// let registerName = this.config.registerName;
			// let value = this.config.value;

			// // check if message has correct json payload - if yes run it instead.
			// if (
			// 	msg.payload.robotIp != undefined &&
			// 	msg.payload.motorName != undefined &&
			// 	msg.payload.registerName != undefined &&
			// 	msg.payload.value != undefined
			// ) {
			// 	robotIp = msg.payload.robotIp;
			// 	motorName = msg.payload.motorName;
			// 	registerName = msg.payload.registerName;
			// 	value = msg.payload.value;
			// }

			// sets the motor.
			// this.debugLogger.logIfDebugMode(
			// 	`setting the register ${registerName} of motor ${motorName} of robot ${robotIp} to ${value}`
			// );

			try {
				//butter_response = await this.butterHttpClient.setMotorRegister(motorName, registerName, value);
				alert("finally");


				var express = require("express");
				const axios = require("axios");
				var app = express();
				var response = "";

				app.listen(3000, function() {
				console.log("server running on port 3000");
				});

				app.get("/", get_distance);

				function get_distance(req, res) {
				// Use child_process.spawn method from
				// child_process module and assign it
				// to variable spawn
				var spawn = require("child_process").spawn;

				// E.g : http://localhost:3000/name?firstname=Mike&lastname=Will
				// so, first name = Mike and last name = Will
				var process = spawn("python", [
					"./sensors.py",
					req.query.firstname,
					req.query.lastname
				]);

				process.stdout.on("data", function(data) {
					response = data.toString();
				});
				}

				axios
				.get("http://localhost:3000/?firstname=Omer&lastname=Noam")
				.then(response => {
					console.log(response.data);
					// console.log(response.data.explanation);
				})
				.catch(error => {
					console.log(error);
				});

				//this.debugLogger.logIfDebugMode(`butter response is ${JSON.stringify(butter_response.data)}`);
				// send operation result.
				this.send({ payload: response });
			} catch (error) {
				this.debugLogger.logIfDebugMode(`failed to get distance`);
			}
		});
	}

	// register node type.
	RED.nodes.registerType('get-distance', GetDistNode);
};
