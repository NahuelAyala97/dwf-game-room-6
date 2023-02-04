import { dbrt } from "./rtdb";
import { ref, onValue } from "firebase/database";

let URL_API_BASE;
if (process.env.NODE_ENV == "production") {
	URL_API_BASE = "https://dwf-chat-room.herokuapp.com";
} else {
	URL_API_BASE = "http://localhost:3000";
}
const state = {
	data: {
		name: "",
		userID: "",
		room: "",
		roomID: "",
		online: false,
		start: false,
		choice: "",
		score: 0,
		rtdbData: {},
	},
	listeners: [],
	listenDatabase() {
		// Connection with RTDB
		const cs = this.getState();
		if (cs.roomID) {
			const rtdbRef = ref(dbrt, `/game-rooms/` + cs.roomID);

			onValue(rtdbRef, (snapshot) => {
				const value = snapshot.val();
				console.log(value);
				cs.rtdbData = value.currentGame;
				this.setState(cs);
			});
		} else {
			console.log("no existe un room al que conectar");
		}
	},
	setName(name: string) {
		const cs = this.getState();
		let nameCapitalize = name?.charAt(0).toUpperCase() + name.slice(1);
		cs.name = nameCapitalize;
		this.setState(cs);
	},
	getDataGuest() {
		let cs = this.getState();
		if (Object.keys(cs.rtdbData).length == 2) {
			for (const userID in cs.rtdbData) {
				if (userID != cs.userID) {
					return cs.rtdbData[userID];
				}
			}
		}
	},
	setRoom(room: number) {
		const cs = this.getState();
		cs.room = room;
		this.setState(cs);
	},
	online(online: boolean) {
		const cs = this.getState();
		cs.online = online;
		this.setState(cs);
	},
	connectionStatus(online: boolean, callback?) {
		const cs = this.getState();
		cs.online = online;
		fetch(URL_API_BASE + "/online", {
			method: "PATCH",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify(cs),
		})
			.then(() => {
				callback();
			})
			.catch(() => {
				callback(true);
			});
	},
	signIn(callback?) {
		const cs = this.getState();
		if (cs.name) {
			fetch(URL_API_BASE + "/auth", {
				method: "POST",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify(cs),
			})
				.then((response) => response.json())
				.then((data) => {
					cs.userID = data.userID;
					callback();
				})
				.catch(() => {
					callback(true);
				});
		}
	},
	createRoom(callback?) {
		const cs = this.getState();
		if (cs.userID) {
			fetch(URL_API_BASE + "/rooms", {
				method: "POST",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify(cs),
			})
				.then((res) => res.json())
				.then((data) => {
					cs.room = data.room;
					cs.roomID = data.roomID;
					//this.setState(cs);
					callback();
				})
				.catch(() => {
					callback(true);
				});
		}
	},
	getRoom(callback?) {
		const cs = this.getState();
		fetch(URL_API_BASE + "/rooms/" + cs.room, {
			method: "GET",
		})
			.then((res) => res.json())
			.then((data) => {
				cs.roomID = data.rtdbIdRoom;

				callback();
			})
			.catch(() => {
				callback(true);
			});
	},
	setUser(callback?) {
		const cs = this.getState();
		if (cs.roomID) {
			fetch(URL_API_BASE + "/setUser", {
				method: "POST",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify(cs),
			})
				.then((res) => res.json())
				.then((data) => {
					cs.score = data.score;
					callback();
				})
				.catch((err) => {
					console.log(err);
					callback(true);
				});
		} else {
			console.log("Not exists room");
		}
	},
	async start(start: boolean, callback?) {
		const currentState = this.getState();
		currentState.start = start;
		await fetch(URL_API_BASE + "/play", {
			method: "PATCH",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify(currentState),
		})
			.then(() => {
				callback();
			})
			.catch(() => {
				callback(true);
			});
	},
	async addMove(move) {
		const currentState = this.getState();
		currentState.choice = move;
		await fetch(URL_API_BASE + "/choice", {
			method: "PATCH",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify(currentState),
		});
	},

	whoWin(): "empate" | "win" | "lose" | "error" {
		let cs = this.getState();
		const empate = [
			cs.choice == "tijera" && this.getDataGuest().choice == "tijera",
			cs.choice == "piedra" && this.getDataGuest().choice == "piedra",
			cs.choice == "papel" && this.getDataGuest().choice == "papel",
		];

		const win = [
			cs.choice == "piedra" && this.getDataGuest().choice == "tijera",
			cs.choice == "papel" && this.getDataGuest().choice == "piedra",
			cs.choice == "tijera" && this.getDataGuest().choice == "papel",
		];

		const lose = [
			cs.choice == "piedra" && this.getDataGuest().choice == "papel",
			cs.choice == "papel" && this.getDataGuest().choice == "tijera",
			cs.choice == "tijera" && this.getDataGuest().choice == "piedra",
		];

		if (empate.includes(true)) {
			//cs.result = "empate";
			return "empate";
		} else if (win.includes(true)) {
			//cs.result = "win";
			return "win";
		} else if (lose.includes(true)) {
			//cs.result = "lose";
			return "lose";
		} else {
			return "error";
		}
	},
	// getScore() {
	// 	const cs = this.getState();
	// 	const scoreRTDB = cs.rtdbData[cs.userID].score;
	// 	cs.score = scoreRTDB;
	// 	return cs.score;
	// },
	setScore(callback?) {
		const cs = this.getState();
		let result = this.whoWin();
		if (result == "win") {
			cs.score++;
		}
		fetch(URL_API_BASE + "/score", {
			method: "PATCH",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify(cs),
		})
			.then((res) => {
				res.json();
			})
			.then((data) => {
				callback();
			})
			.catch(() => {
				callback(true);
			});
	},
	getHistory() {
		const currentState = this.getState();
		const localHistory: any = JSON.parse(
			localStorage.getItem("history") as string
		);
		if (localStorage.getItem("history")) {
			currentState.historyGame = localHistory;
		}
	},
	resetScore() {
		let cs = state.getState();
		cs.score = 0;
		fetch(URL_API_BASE + "/score", {
			method: "PATCH",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify(cs),
		})
			.then((res) => {
				res.json();
			})
			.then((data) => {
				console.log(data);
			});
		//state.setState(cs);
	},
	getState() {
		return this.data;
	},
	setState(newState) {
		// modifica this.data (el state) e invoca los callbacks
		this.data = newState;
		//console.log("soy el nuevo state", newState);
		for (const cb of this.listeners) {
			cb(newState);
		}
		localStorage.setItem("history", JSON.stringify(newState.historyGame));
	},
	subscribe(callback: (any) => any) {
		// recibe callbacks para ser avisados posteriormente
		this.listeners.push(callback);
	},
};

export { state };
