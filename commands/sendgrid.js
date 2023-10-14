import * as store from "../lib/store.js";
import { writeError, writeInfo, writeStep, writeSuccess } from "../lib/write.js";
import setupSendgridAccount from "../tasks/services/sendgrid.js";
import readline from "readline";
import { exec } from "child_process";
import fetch from "node-fetch";

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

async function connectToVPN(vpnName) {
	exec(`networksetup -connectpppoeservice "${vpnName}"`, (error, stderr) => {
		if (error) {
			writeError("Failed to connect to the VPN. Check your VPN configuration.");
			console.error(stderr);
			proceedWithSendGrid();
		} else {
			writeSuccess("Connected to the VPN!");
			proceedWithSendGrid();
		}
	});
}

async function proceedWithSendGrid() {
	writeStep("Creating SendGrid account");

	await setupSendgridAccount();

	let sendgridApiKey = store.get("sendgridApiKey");

	if (sendgridApiKey) {
		writeSuccess("SendGrid account created!");
		writeInfo(`Add the following values to your vault file or .env:
			tf_smtp_username: "apikey",
			tf_smtp_password: ${sendgridApiKey}
		`);
	} else {
		writeError("No SendGrid account was created.");
	}
}

export async function checkIfUserIsInOffice() {
	writeStep("Checking if you are in the Triggerfish office (or using the VPN)...");

	const ipCorrect = await fetch("https://icanhazip.com/")
		.then((response) => response.text())
		.then((ip) => ip.trim() === "158.174.69.114");

	if (!ipCorrect) {
		rl.question("Do you want to connect to Triggerfish VPN? (yes/no): ", (answer) => {
			if (answer.toLowerCase() === "yes") {
				rl.question("Enter the name of the Triggerfish VPN to connect: ", (vpnName) => {
					rl.close();
					if (vpnName) {
						connectToVPN(vpnName);
					} else {
						writeError("No VPN name provided.");
					}
				});
			} else {
				rl.close();
				proceedWithSendGrid();
			}
		});
	} else {
		proceedWithSendGrid();
	}
}
