import { Router } from "@vaadin/router";
import { state } from "../../state";

const tijeraImg = require("url:../../components/images/tijera.png");
const papelImg = require("url:../../components/images/papel.png");
const piedraImg = require("url:../../components/images/piedra.png");

class Welcome extends HTMLElement {
	shadow = this.attachShadow({ mode: "open" });
	constructor() {
		super();
	}
	connectedCallback() {
		this.render();
		this.addListeners();
	}
	addListeners() {
		const buttonNew = this.shadow.querySelector(".newgame");
		const buttonOld = this.shadow.querySelector(".oldgame");

		buttonNew?.addEventListener("click", (e) => {
			Router.go("/newgame");
		});

		buttonOld?.addEventListener("click", (e) => {
			Router.go("/auth");
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
                <my-button class="button newgame">Nuevo Juego</my-button>
                <my-button class="button oldgame">Ingresar a una sala</my-button>
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
    }
    
    .home__container-content {
        height: 90vh;
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

customElements.define("welcome-page", Welcome);
