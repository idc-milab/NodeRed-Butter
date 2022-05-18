
module.exports = function(RED) {
	function GetDistNode(config) {
		RED.nodes.createNode(this, config);
		this.config = config;

		const DebugLogger = require('../logger/debug_logger');
		//const butterClientProvider = require('../butter-client/butter-client-provider');

		//this.butterHttpClient = butterClientProvider.GetClient(this.config.robotIp);
		this.debugLogger = new DebugLogger(this, this.config.debugMode);

		var express = require("express");
		const axios = require("axios");
		var app = express();
		var response = "";

		app.listen(3003, function() {
		console.log("server running on port 3003");
		});

		app.get("/name", get_distance);

		function get_distance(req, res) {
			console.log("kkkkkllkk");
			var spawn = require("child_process").spawn;

			// E.g : http://localhost:3000/name?firstname=Mike&lastname=Will
			// so, first name = Mike and last name = Will
			var process = spawn("python", [
				"/Users/ehudb/Documents/GitHub/NodeRed-Butter/nodes/sensors.py",
				req.query.firstname,
				req.query.lastname
			]);

			process.stdout.on("data", function(data) {
				// console.log(data.toString());
				res.send(data.toString());
			});
		}
		

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
				console.log("ILOVEBeny");
				axios.get("http://127.0.0.1:3003/name?firstname=Omer&lastname=Noam").then(response => {
					console.log(response.data);
					console.log(JSON.stringify(response));
	
					this.send({ payload: response });
					this.debugLogger.logIfDebugMode(`butter response is ${response.data.toString()}`);

				})
				.catch(error => {
					console.log(error);
				});

				
			} catch (error) {
				console.log(error);

				this.debugLogger.logIfDebugMode(error);

				this.debugLogger.logIfDebugMode(`failed to get distance`);
			}
		});
	}

	// register node type.
	RED.nodes.registerType('get-distance', GetDistNode);
};
