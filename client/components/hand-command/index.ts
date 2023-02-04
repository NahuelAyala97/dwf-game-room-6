const piedraImg = require("url:../../components/images/piedra.png");
const papelImg = require("url:../../components/images/papel.png");
const tijeraImg = require("url:../../components/images/tijera.png");

customElements.define(
	"hand-command",
	class Command extends HTMLElement {
		shadow = this.attachShadow({ mode: "open" });
		option: string;
		constructor() {
			super();
		}

		connectedCallback() {
			let valueOption = this.getAttribute("option");

			if (valueOption == "piedra") {
				this.option = piedraImg;
			} else if (valueOption == "papel") {
				this.option = papelImg;
			} else if (valueOption == "tijera") {
				this.option = tijeraImg;
			}

			this.render();
		}

		render() {
			this.shadow.innerHTML = `
			<img class="hand" src=${this.option} />
			`;

			const style = document.createElement("style");
			style.textContent = `
            .hand{
                height: 100%;
                width: 100%;
            }
            `;

			this.shadow.appendChild(style);
		}
	}
);
