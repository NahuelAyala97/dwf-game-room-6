import { state } from "../../state";
import { Router } from "@vaadin/router";

class Game extends HTMLElement {
	shadow = this.attachShadow({ mode: "open" });
	owner: string;
	guest: string;
	constructor() {
		super();
	}
	connectedCallback() {
		this.render();
		this.activeHands();
		const counterEl = this.shadow.querySelector(".counter");
		let counter = this.counter(counterEl);
		state.subscribe(() => {
			const cs = state.getState();

			if (cs.rtdbData[cs.userID].choice && state.getDataGuest().choice) {
				Router.go("/results");
			}
		});
	}
	disconnectedCallback() {
		state.start(false, () => {});
	}
	activeHands() {
		let hands = this.shadow.querySelectorAll(".hand");

		hands.forEach((e) => {
			e.addEventListener("click", (e: any) => {
				let classList = e.target.classList;
				classList.toggle("disabled");
			});
		});
	}
	counter(element) {
		let hands = this.shadow.querySelectorAll(".hand");
		let counter = 4;
		let interval = setInterval(() => {
			counter--;
			element.innerText = counter.toString();
			if (counter == 0) {
				for (const hand of hands) {
					let classValue = hand.classList.value;
					if (!classValue.includes("disabled")) {
						let value = hand.getAttribute("option") as any;
						console.log(value);
						state.addMove(value);
					}
				}
				clearInterval(interval);
			}
		}, 1000);
		return counter;
	}

	render() {
		this.shadow.innerHTML = `
            <div class="home">
            <div class="home__container-content">
            <div class="container-counter">
            <div class="counter"></div>
            </div>
            <div class="container-commands">
            <hand-command option="piedra" class="hand disabled"></hand-command>
            <hand-command option="papel" class="hand disabled"></hand-command>
            <hand-command option="tijera" class="hand disabled"><hand-commands>
            </div>
            </div>
            </div>
            `;

		const style = document.createElement("style");

		style.textContent = `
    .home {
        height: 100vh;
    }
    
    .home__container-content {
       height: 100vh;
       display: grid;
       grid-template-rows: 60% 40%;
    }
    
    .container-counter{
        margin-top: 125px;
        justify-self: center;
        align-items: end;
    }
    .counter{
        height: 230px;
        width: 230px;
        border-radius: 50%;
        border: 17px solid #000000;
        font-weight: 700;
        font-size: 90px;
        font-family: "Special Elite", cursive;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .container-commands{
        max-width: 360px;
        justify-self: center;
       display: grid;
       grid-template-columns: 1fr 1fr 1fr;
       gap: 20px;
    }
    
    .disabled{
        transform: translateY(95px);
        opacity: 70%;
    }
    `;

		this.shadow.appendChild(style);
	}
}

customElements.define("game-page", Game);
