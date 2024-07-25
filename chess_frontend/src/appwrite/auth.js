import { Account, Client, ID } from "appwrite";
import conf from "../../conf";

class Auth {
	constructor() {
		this.client = new Client();
		this.client
			.setEndpoint(conf.URL) // Your API Endpoint
			.setProject(conf.projectId);
		this.account = new Account(this.client);
	}

	async createAccount({ email, password, userName }) {
		try {
			const id = ID.unique();
			const createacc = await this.account.create(
				id,
				email,
				password,
				userName
			);
			if (createacc) {
				const res = await this.login({ email, password });
				const data = { userid: email, email, userName };
				const user = await fetch("/api/adduser", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				});
				console.log(user);
				return res;
			} else {
				return null;
			}
		} catch (error) {
			console.log(
				"(createAccount functionality) There was an error while creating an account: " +
					error
			);
			throw error; // Re-throw the error to be caught in the component
		}
	}

	async login({ email, password }) {
		try {
			const res = await this.account.createEmailPasswordSession(
				email,
				password
			);

			return res;
		} catch (error) {
			console.log(
				"(login functionality) There was an error while logging into the account: " +
					error
			);
			throw error; // Re-throw the error to be caught in the component
		}
	}

	async logout() {
		try {
			await this.account.deleteSessions();
		} catch (error) {
			console.log(
				"(logout functionality) There was an error while logging out of the account: " +
					error
			);
		}
	}

	async getCurrentUser() {
		try {
			const promise = await this.account.get();
			// console.log(promise);
			return promise;
		} catch (error) {
			console.log(
				"(getCurrentUser functionality) There was an error while getting the account: " +
					error
			);
		}
		return null;
	}
}

const auth = new Auth();
export default auth;
