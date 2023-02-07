import { state } from "../../state";
import { Router } from "@vaadin/router";
import { startAfter } from "firebase/database";

const tijeraImg = require("url:../../components/images/tijera.png");
const papelImg = require("url:../../components/images/papel.png");
const piedraImg = require("url:../../components/images/piedra.png");

customElements.define(
	"roules-page",
	class Roules extends HTMLElement {
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

			this.room = cs.room;
			this.owner = cs.name;
			this.guest = state.getDataGuest().name;
			this.score = {
				owner: cs.score ? cs.score.toString() : "0",
				guest: state.getDataGuest().score
					? state.getDataGuest().score.toString()
					: "0",
			};
			this.render();
			this.addListener();
		}
		addListener() {
			const button = this.shadow.querySelector(".button");
			button?.addEventListener("click", (e) => {
				state.start(true, (err) => {
					if (err) console.error("error al actualizar rtdb");
					Router.go("/wait");
				});
			});
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
                    <p class="home__title">Presioná jugar
                    y elegí: piedra, papel o tijera antes de que pasen los 3 segundos.</p>
                </div>
                <my-button class="button">¡Jugar!</my-button>
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
        height: 90vh;
        display: flex;
        flex-direction: column;
        align-items: center;
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
		font-size: 40px;
    }

    .home__container-comands {
        width: max-content;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 36px;
        position: fixed;
        bottom: -86px;
    }`;

			this.shadow.appendChild(style);
		}
	}
);
