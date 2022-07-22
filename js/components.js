customElements.define(
    "page-main",
    class extends HTMLElement {
        connectedCallback() {
            this.innerHTML = document.getElementById("page-main.html").innerHTML;
            toyList();
        }
    }
)

customElements.define(
    "page-extension",
    class extends HTMLElement {
        connectedCallback() {
            this.innerHTML = document.getElementById("page-extension.html").innerHTML;
        }
    }
)

