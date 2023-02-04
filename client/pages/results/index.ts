import { state } from "../../state";
import { Router } from "@vaadin/router";

class Results extends HTMLElement {
	shadow = this.attachShadow({ mode: "open" });
	choiceOwner: string;
	choiceGuest: string;
	constructor() {
		super();
	}
	connectedCallback() {
		let cs = state.getState();
		this.choiceOwner = cs.choice;
		this.choiceGuest = state.getDataGuest().choice;
		Router.go("/score");
	}
	render() {
		const style = document.createElement("style");

		this.shadow.innerHTML = `
		<div class="home">
		<hand-command option=${this.choiceGuest} class="hand guest"></hand-command>
		<hand-command option=${this.choiceOwner} class="hand owner"></hand-command>
	`;

		style.textContent = `
	.home{
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
	 }

	 .hand {
      height: 40%;
	 }
	 
	 .guest{
		transform: rotate(180deg)
	}
 
	
	 `;

		this.shadow.appendChild(style);
	}
}

customElements.define("results-page", Results);
