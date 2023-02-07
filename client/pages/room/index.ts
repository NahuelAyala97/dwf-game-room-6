import { Router } from "@vaadin/router";
import { state } from "../../state";

class Room extends HTMLElement {
	shadow = this.attachShadow({ mode: "open" });
	room: number;
	owner: string;
	guest: string;
	scoreOwner;
	scoreGuest;
	constructor() {
		super();
	}
	connectedCallback() {
		state.listenDatabase();
		const cs = state.getState();
		if (cs.online == true && state.getDataGuest()) {
			Router.go("/roules");
		}
		this.room = cs.room;
		this.owner = cs.name;
		state.subscribe(() => {
			let cs = state.getState();
			if (state.getDataGuest().name) {
				this.guest = state.getDataGuest().name;
			} else {
				this.guest = "guest";
			}

			this.scoreOwner = cs.score.toString();
			this.scoreGuest = state.getDataGuest().score
				? state.getDataGuest().score.toString()
				: "0";
			if (cs.online == true && state.getDataGuest().online == true) {
				Router.go("/roules");
			}
			this.render();
		});

		this.render();
	}
	disconnectedCallback() {
		state.connectionStatus(false, () => {});
	}
	render() {
		this.shadow.innerHTML = `   
    <div class="home">
        <header class="header">
            <div class="header__history">
                <h4 class="header__history-owner">${this.owner}: ${this.scoreOwner}</h4>
                <h4 class="header__history-guest">${this.guest}: ${this.scoreGuest}</h4>
            </div>
            <div class="header__room">
                <h4 >Sala<br> ${this.room}</h4>
            </div>
        </header>
    <div class="home__container-content">
            <div class="home__container-title">
                <h2 class="home__title">Compartí el código:</h2>
                <p class ="home__room-number">${this.room}</p>
                <p class ="home__title">Con tu contrincante</p>

            </div>
            <div class="home__container-comands">
                <hand-command option="piedra"></hand-command>
                <hand-command option="papel"></hand-command>
                <hand-command option="tijera"></hand-command>
            </div>
        </div>
    </div>`;

		const style = document.createElement("style");

		style.textContent = `
.home {
    height: 100vh;
    max-width: 630px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 20px;
    margin: 0 auto;
    gap: calc(100vh - 90%);
}

.header{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header__history-owner{
    font-family: "Special Elite", cursive;
    font-weight: 600;
    font-size: 24px;
    margin: 0;
    margin-bottom: 12px;
}

.header__history-guest{
    font-family: "Special Elite", cursive;
    font-weight: 600;
    font-size: 24px;
    color: #FF6442;
    margin: 0;
}

.header__room{
    font-family: "Special Elite", cursive;
    font-weight: 700;
    font-size: 24px; 
}

.home__container-title {
    display: grid;
    grid-template-rows: 1fr 1fr 1fr;
    gap: 28px;
    align-items: center;
 padding: 0 20px;
}

.home__title {
    margin: 0;
    text-align: center;
    font-family: "Special Elite", cursive;
    font-style: normal;
    font-weight: 600;
    font-size: 35px;
}

.home__room-number{
    margin: 0;
    text-align: center;
    font-family: "Special Elite", cursive;
    font-weight: 700;
font-size: 48px;
}

.home__container-comands {
    width: max-content;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 36px;
    position: fixed;
    bottom: -65px;
}`;

		this.shadow.appendChild(style);
	}
}

customElements.define("room-page", Room);
