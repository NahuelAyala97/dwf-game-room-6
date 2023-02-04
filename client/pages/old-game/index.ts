import { Router } from "@vaadin/router";
import { stat } from "fs";
import { state } from "../../state";

const tijeraImg = require("url:../../components/images/tijera.png");
const papelImg = require("url:../../components/images/papel.png");
const piedraImg = require("url:../../components/images/piedra.png");

class OldGame extends HTMLElement {
	shadow = this.attachShadow({ mode: "open" });
	constructor() {
		super();
	}
	connectedCallback() {
		this.render();
		this.addListeners();
	}
	addListeners() {
		const input = this.shadow
			.querySelector(".input")
			?.shadowRoot?.querySelector(".input") as any;

		const buttonInit = this.shadow.querySelector(".button");
		buttonInit?.addEventListener("click", (e) => {
			state.setRoom(input.value);

			state.getRoom((err) => {
				if (err) Router.go("/errorRoom");
				state.listenDatabase();
				state.setUser((err) => {
					if (err) console.error("error con la rtdb");
					state.connectionStatus(true, () => {
						Router.go("/room");
					});
				});
			});
		});
	}
	render() {
		const style = document.createElement("style");

		this.shadow.innerHTML = `
        <div class="home">
            <div class="home__container-content">
                <div class="home__container-title">
                    <h1 class="home__title">Piedra Papel <span>ó</span> Tijera</h1>
                    </div>
                    <input-custom class="input" placeholder="código"></input-custom>
                    <my-button class="button">Ingresar a la sala</my-button>
                <div class="home__container-comands">
                    <hand-command option="piedra"></hand-command>
                    <hand-command option="papel"></hand-command>
                    <hand-command option="tijera"></hand-command>
                </div>
            </div>
        </div>
    `;

		style.textContent = `
    .home {
        height: 100vh;
        display: flex;
        justify-content: center;
        margin-top: 40px;
    }
    
    .home__container-content {
        height: 90vh;
        width: 335px;
        display: grid;
        grid-template-rows: 1fr 1fr 1fr 1fr;
        gap: 20px;
    }
    
    .home__container-title {
        width: 300px;
        justify-self: center;
    }
    
    .home__title {
        margin: 0;
        color: #009048;
        font-family: "Special Elite", cursive;
        font-style: normal;
        font-weight: 700;
        font-size: 80px;
    }
    
    .home__title > span {
        color: #91CCAF;
        
    }
    
    .home__container-comands {
        width: max-content;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 36px;
    }
    
    `;

		this.shadow.appendChild(style);
	}
}

customElements.define("old-game-page", OldGame);
