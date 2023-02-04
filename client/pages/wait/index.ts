import { state } from "../../state";
import { Router } from "@vaadin/router";

const tijeraImg = require("url:../../components/images/tijera.png");
const papelImg = require("url:../../components/images/papel.png");
const piedraImg = require("url:../../components/images/piedra.png");

customElements.define(
	"wait-page",
	class Wait extends HTMLElement {
		shadow = this.attachShadow({ mode: "open" });
		room: number;
		owner: string = "owner";
		guest: string = "guest";
		score;
		constructor() {
			super();
		}
		connectedCallback() {
			const cs = state.getState();
			if (cs.start == true && state.getDataGuest().start == true) {
				Router.go("/start");
			}
			this.room = cs.room;
			this.owner = cs.name;
			this.guest = state.getDataGuest().name;
			this.score = {
				owner: cs.score ? cs.score.toString() : "0",
				guest: state.getDataGuest().score
					? state.getDataGuest().score.toString()
					: "0",
			};
			state.subscribe(() => {
				let cs = state.getState();
				//if (cs.start && cs.dataGuest.start) Router.go("/start");
				if (cs.start == true && state.getDataGuest().start == true) {
					Router.go("/start");
				}
			});
			this.render();
		}
		render() {
			this.shadow.innerHTML = `   
        <div class="home">
        <header class="header">
        <div class="header__history">
            <h4 class="header__history-owner">${this.owner}: ${this.score.owner}</h4>
            <h4 class="header__history-guest">${this.guest}: ${this.score.guest}</h4>
        </div>
        <div class="header__room">
            <h4 >Sala<br> ${this.room}</h4>
        </div>
    </header>
            <div class="home__container-content">
                <div class="home__container-title">
                    <p class="home__title">Esperando a que ${this.guest} presione ¡Jugar!...</p>
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
    
    .home__container-content {
        height: 60vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    
    .home__container-title {
        width: 300px;
        margin-bottom: 30px;
    }
    
    .home__title {
        margin: 0;
        text-align: center;
        font-family: "Special Elite", cursive;
        font-style: normal;
		font-weight: 600;
		font-size: 35px;
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
);
