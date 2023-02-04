customElements.define(
	"input-custom",
	class input extends HTMLElement {
		shadow = this.attachShadow({ mode: "open" });
		placeholder;
		constructor() {
			super();
		}
		connectedCallback() {
			this.render();
		}
		render() {
			this.shadow.innerHTML = `
            <input class="input">
            `;

			const inputEL = this.shadow.querySelector(".input");
			this.placeholder = this.getAttribute("placeholder") || "...";
			inputEL?.setAttribute("placeholder", this.placeholder);

			let style = document.createElement("style");
			style.textContent = `
            .input {
                width: 311px;
				height:84px;
                border: 10px solid #182460;
                border-radius: 10px;
                font-family: 'Odibee Sans';
                font-weight: 400;
                font-size: 45px;
                text-align:center;
             }
            `;

			this.shadow.appendChild(style);
		}
	}
);
