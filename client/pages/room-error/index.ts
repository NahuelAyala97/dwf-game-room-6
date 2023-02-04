import { Router } from "@vaadin/router";
import { setTimeout } from "timers/promises";
import { state } from "../../state";

const tijeraImg = require("url:../../components/images/tijera.png");
const papelImg = require("url:../../components/images/papel.png");
const piedraImg = require("url:../../components/images/piedra.png");

class ErrorRoom extends HTMLElement {
	shadow = this.attachShadow({ mode: "open" });
	constructor() {
		super();
	}
	connectedCallback() {
		this.render();
		window.setTimeout(() => {
			Router.go("/");
		}, 3000);
	}

	render() {
		const style = document.createElement("style");

		this.shadow.innerHTML = `
        <div class="home">
            <div class="home__container-content">
                <div class="home__container-title">
                    <h1 class="home__title">Piedra Papel <span>ó</span> Tijera</h1>
                </div>
                <p class ="home__subtitle">Ups, esta sala está completa y tu nombre no coincide con nadie en la sala.</p>
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
        align-items: flex-end;
        padding: 20px;
    }
    
    .home__container-content {
        height: 90vh;
        max-width: 430px;
        display: grid;
        grid-template-rows: 1fr 1fr 1fr;
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
        justify-self: center;
    }

    .home__subtitle {
        margin: 0;
        text-align: center;
        align-self: center;
        font-family: "Special Elite", cursive;
        font-style: normal;
        font-weight: 600;
        font-size: 35px;
    }
    
    `;

		this.shadow.appendChild(style);
	}
}

customElements.define("error-room-page", ErrorRoom);
