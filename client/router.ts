import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".root"));
router.setRoutes([
	{ path: "/", component: "welcome-page" },
	{ path: "/newgame", component: "new-game-page" },
	{ path: "/auth", component: "auth-page" },
	{ path: "/oldgame", component: "old-game-page" },
	{ path: "/room", component: "room-page" },
	{ path: "/errorRoom", component: "error-room-page" },
	{ path: "/roules", component: "roules-page" },
	{ path: "/wait", component: "wait-page" },
	{ path: "/start", component: "game-page" },
	{ path: "/results", component: "results-page" },
	{ path: "/score", component: "score-page" },
]);
