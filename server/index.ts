import express from "express";
import { firestore, dbrt } from "./database";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));
const port = process.env.PORT || 3000;

let userCollection = firestore.collection("userGame");
let roomCollection = firestore.collection("roomGame");

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.post("/auth", (req, res) => {
	const { name } = req.body;
	userCollection
		.where("name", "==", name)
		.get()
		.then((snap) => {
			if (snap.empty) {
				userCollection.add({ name }).then((docRef) => {
					res.json({ userID: docRef.id });
				});
			} else {
				res.json({ userID: snap.docs[0].id });
			}
		});
});

app.post("/rooms", (req, res) => {
	const { userID } = req.body;
	userCollection
		.doc(userID)
		.get()
		.then((userDoc) => {
			if (userDoc.exists) {
				const roomRef = dbrt.ref("/game-rooms/" + uuidv4());
				const roomID = roomRef.key;

				roomRef.set({ owner: userID }).then(() => {
					const room = 1000 + Math.floor(Math.random() * 999);
					roomCollection.doc(room.toString()).set({
						rtdbIdRoom: roomID,
					});
					res.json({ room, roomID });
				});
			} else {
				res.sendStatus(401);
			}
		});
});

app.get("/rooms/:room", (req, res) => {
	const { room } = req.params;
	roomCollection
		.doc(room)
		.get()
		.then((roomDoc) => {
			if (roomDoc.exists) {
				res.json(roomDoc.data());
			} else {
				res.status(400).send("Room not exists");
			}
		});
});

app.post("/setUser", (req, res) => {
	const currentState = req.body;
	// res.json({ currentState });
	const refRoom = dbrt.ref(
		"/game-rooms/" + currentState.roomID + "/currentGame/"
	);
	const refUser = dbrt.ref(
		"/game-rooms/" + currentState.roomID + "/currentGame/" + currentState.userID
	);
	refRoom.get().then((snap) => {
		console.log(snap.numChildren());
		if (snap.numChildren() == 2) {
			refUser.get().then((snap) => {
				if (snap.exists()) {
					res.json(snap.val());
				} else {
					res.status(400).send("Not authorized");
				}
			});
		} else {
			refUser
				.update({
					choice: "",
					name: currentState.name,
					online: currentState.online,
					start: false,
					score: 0,
				})
				.then((data) => {
					res.sendStatus(200);
				})

				.catch(() => {
					res.sendStatus(400);
				});
		}
	});
});

app.patch("/online", (req, res) => {
	const cs = req.body;
	const { online } = req.body;
	const refUser = dbrt.ref(
		"/game-rooms/" + cs.roomID + "/currentGame/" + cs.userID
	);
	refUser
		.update({ online })
		.then((data) => {
			res.status(200).json({
				online,
			});
		})
		.catch(() => {
			res.sendStatus(400);
		});
});

app.patch("/play", (req, res) => {
	const currentState = req.body;
	const { start } = req.body;
	const refUser = dbrt.ref(
		"/game-rooms/" + currentState.roomID + "/currentGame/" + currentState.userID
	);

	refUser
		.update({ start })
		.then((data) => {
			res.status(200).json({
				start,
			});
		})
		.catch(() => {
			res.sendStatus(400);
		});
});

app.patch("/choice", (req, res) => {
	const currentState = req.body;
	const { choice } = req.body;
	const refUser = dbrt.ref(
		"/game-rooms/" + currentState.roomID + "/currentGame/" + currentState.userID
	);

	refUser
		.update({ choice })
		.then((data) => {
			res.status(202).json({
				choice,
			});
		})
		.catch(() => {
			res.sendStatus(400);
		});
});

app.patch("/score", (req, res) => {
	const currentState = req.body;
	const { score } = req.body;
	const refUser = dbrt.ref(
		"/game-rooms/" + currentState.roomID + "/currentGame/" + currentState.userID
	);

	refUser
		.update({ score })
		.then(() => {
			res.status(202).json({
				score,
			});
		})
		.catch(() => {
			refUser
				.set({ score })
				.then(() => {
					res.status(202).json({
						score,
					});
				})
				.catch(() => {
					res.sendStatus(400);
				});
		});
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
