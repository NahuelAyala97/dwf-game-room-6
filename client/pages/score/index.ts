import { state } from "../../state";
import { Router } from "@vaadin/router";
const imgWin = require("url:../../components/images/ganaste.png");
const imgLoss = require("url:../../components/images/perdiste.png");

class Score extends HTMLElement {
	shadow = this.attachShadow({ mode: "open" });
	guest: string;
	owner: string;
	choiceOwner: string;
	choiceGuest: string;
	scoreOwner;
	scoreGuest;
	constructor() {
		super();
	}
	connectedCallback() {
		state.setScore((err) => {
			if (err) console.error(err);
		});
		let cs = state.getState();
		console.log(cs);
		this.owner = cs.name;
		this.guest = state.getDataGuest().name;
		this.choiceOwner = cs.choice;
		this.choiceGuest = state.getDataGuest().choice;
		this.scoreOwner = cs.score ? cs.score.toString() : "0";
		this.scoreGuest = state.getDataGuest().score
			? state.getDataGuest().score.toString()
			: "0";
		this.render();
		this.setResult();
		state.subscribe(() => {
			this.scoreOwner = cs.score ? cs.score.toString() : "0";
			this.scoreGuest = state.getDataGuest().score
				? state.getDataGuest().score.toString()
				: "0";
			this.render();
			this.setResult();
		});
	}
	disconnectedCallback() {}
	addlistener() {
		const button = this.shadow.querySelector(".button");
		button?.addEventListener("click", (e) => {
			state.addMove("");
			Router.go("/room");
		});

		const buttonReset = this.shadow.querySelector(".reset");
		buttonReset?.addEventListener("click", (e) => {
			state.resetScore();
		});
	}

	setResult() {
		const result = state.whoWin();
		console.log(result);
		const resultPage = this.shadow.querySelector(".results") as any;
		const imgEl = this.shadow.querySelector(".results-img") as any;

		if (result == "win") {
			resultPage?.classList.add("win");
			imgEl.src = imgWin;
		} else if (result == "lose") {
			resultPage?.classList.add("lose");
			imgEl.src = imgLoss;
		} else if (result == "empate") {
			resultPage?.classList.add("empate");
			resultPage.textContent = "EMPATE";
			Router.go("/wait");
		}
		//else if (result == "error") {
		// 	resultPage?.classList.add("error");
		// 	resultPage.textContent = "ERROR";
		// }
	}

	render() {
		const style = document.createElement("style");

		this.shadow.innerHTML = `
		<div class="home">
		<hand-command option=${this.choiceGuest} class="hand guest"></hand-command>
		<hand-command option=${this.choiceOwner} class="hand owner"></hand-command>
		<div class="results">
		<img class="results-img" src=${""} />
		<div class="score">
		<h3 class="score__title">Score</h3>
		<div class="score__data">
		<h4 class="score__data-number">${this.owner}:${this.scoreOwner}</h4> 
		<h4 class="score__data-number">${this.guest}:${this.scoreGuest}</h4> 
		</div>
		</div>
		<my-button class="button">Volver a Jugar</my-button>
		<button class="reset">reset</button>
		</div>
		</div>
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
 
	 .results{
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 35px 20px;
        display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
	 }

	 .win {
		background-color: #888949E5;
	 }
	 
	 .lose {
		background-color: #894949E5;
	 }

	 .empate {
		 background-color: #798795;
		font-family: 'Odibee Sans';
        font-weight: 400;
        font-size: 55px;
		text-align: center;
       }
	   
	   .error {
		background-color: #ff6258;
		color: #FFFFFF;
		font-family: 'Odibee Sans';
        font-weight: 400;
        font-size: 55px;
		text-align: center;
	}
      
     .results-img{
		height: 250px;
		width: 250px;
	 }
	 
	 .score{
		width: 259px;
        height: 217px;
		border: 10px solid #000000;
        border-radius: 10px;
		background-color: #FFFFFF;
		padding: 10px;
	 }
	 
	 .score__title{
		 font-family: 'Odibee Sans';
        font-weight: 400;
        font-size: 55px;
		text-align: center;
		margin: 0;
	 }

	 .score__data-number{
		font-family: 'Odibee Sans';
        font-weight: 400;
        font-size: 45px;
		text-align: end;
		margin: 0;
	 }

	 .reset{
		 position: absolute;
		top: 0;
        left: 0;
        width: 90px;
        height: 61px;
        border: 10px solid #FC0303;
        border-radius: 10px;
        font-family: 'Odibee Sans';
        font-weight: 400;
        font-size: 34px;
        background-color: #FF6161;
        color: #D8FCFC;
	}
	 `;

		this.addlistener();

		this.shadow.appendChild(style);
	}
}

customElements.define("score-page", Score);
