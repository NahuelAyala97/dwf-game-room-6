customElements.define(
	"my-button",
	class Button extends HTMLElement {
		shadow = this.attachShadow({ mode: "open" });
		title: string;
		constructor() {
			super();
		}
		connectedCallback() {
			this.render();
		}
		render() {
			this.title = this.textContent || "button";

			this.shadow.innerHTML = `
            <button>${this.title}</button>
            `;

			let style = document.createElement("style");
			style.textContent = `
            button {
				display: block;
				width: 335px;
				height:84px;
                border: 10px solid #001997;
                border-radius: 10px;
                font-family: 'Odibee Sans';
                font-weight: 400;
                font-size: 45px;
                background-color: #006CFC;
                color: #D8FCFC;
             }
            `;

			this.shadow.appendChild(style);
		}
	}
);
