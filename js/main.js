const $nav = document.querySelector("ion-nav");

function nav(page) {
    $nav.push(page);
}

let toyData = [];

function toyList() {
    fetch("https://api.mercadolibre.com/sites/MLU/search?seller_id=232888134&q=Funko")
        .then(r => r.json())
        .then(data => {
            for (let i in data.results) {
                toyData.push(data.results[i])
            }
            toyData.forEach(showToys);

            let nroFilter;
            for (let i in data.available_filters) {
                if (data.available_filters[i].id === "FRANCHISE") {
                    nroFilter = i;
                }
            }
            let filters = data.available_filters[nroFilter].values;
            for (let i in filters) {
                let $div_chips = document.querySelector("ion-select");
                $div_chips.innerHTML += `
        <ion-select-option value="${filters[i].name}">${filters[i].name}</ion-select-option>
        `
            }
        });
}

let searchResults = [];

function toySearch() {
    document.querySelector("page-main ion-row").innerHTML = "";
    let $searchValue = document.querySelector("ion-searchbar").value;
    searchResults = toyData.filter((e) => {
        if(((e.title).toLowerCase()).includes($searchValue)){
            return e.title;
        }
    })
    if(this.value === ""){
        toyData.forEach(showToys);
    }
    else{
        if(searchResults === ""){
            console.log("no hay datos");
            document.querySelector("ion-row").innerHTML = "";
        }
        else{
            searchResults.forEach(showToys);
        }
    }
}

function showToys(t) {
    let $row = document.querySelector("page-main ion-row");
    $row.innerHTML += `
        <ion-col size="6">
        <div>
        <ion-icon id="addButton" name="add-circle" onclick="addCartToy(${(t.id).substring(3)})")></ion-icon>
        <ion-card button onclick="toyExtension(${(t.id).substring(3)})">
        <ion-card-header>
            <ion-icon name="heart-outline"></ion-icon>
            <img src="http://http2.mlstatic.com/D_NQ_NP_${t.thumbnail_id}-F.jpg"
                alt="imagen de juguete">
            <ion-card-title>${(t.title).replace("Xuruguay", "TOP POP!")}</ion-card-title>
            <ion-card-subtitle>$ ${Math.round(t.price)}</ion-card-subtitle>
        </ion-card-header>
    </ion-card>
        </div>
    </ion-col>
        `
}

let id;
let img;
let title;
let price;
let description;

function toyExtension(toyId) {
    nav('page-extension');

    fetch(`https://api.mercadolibre.com/items/MLU${toyId}`)
        .then(r => r.json())
        .then(data => {
            id = (data.id).substring(3);
            img = data.thumbnail_id;
            title = data.title;
            price = data.price;
            loadToyData();
        })
    fetch(`https://api.mercadolibre.com/items/MLU${toyId}/description`)
        .then(r => r.json())
        .then(data => {
            let splitted = data.plain_text.split('Local comercial');
            let splitted2 = splitted[0].split('2008');
            let second = splitted2[1].replace("Xuruguay", "TOP POP!");
            description = second;
            loadToyData();
        })
}

function loadToyData() {
    let $content = document.querySelector("page-extension ion-content");
    $content.innerHTML = `
        <img src="http://http2.mlstatic.com/D_NQ_NP_${img}-F.jpg">
            <div>
                <h2>${title}</h2>
                <h3>$ ${Math.round(price)}</h3>
                <p>${description}</p>
                <ion-button onclick="addCartToy(${id})">AÑADIR AL CARRITO</ion-button>
            </div>
        `
}

let amount = 0;
let priceSum = [];

function addCartToy(toyId) {
    fetch(`https://api.mercadolibre.com/items/MLU${toyId}`)
        .then(r => r.json())
        .then(data => {
            priceSum.push(Math.round(data.price));
            amount++;
            const sum = (accumulator, number) => accumulator + number;
            document.querySelector("#div-cartTotal").innerHTML = `
            <p>${amount} items</p>
            <span>$ ${priceSum.reduce(sum)}</span>
            `
            let $list = document.querySelector("ion-list");
            $list.innerHTML += `
            <ion-item>
            <ion-thumbnail>
                <img src="http://http2.mlstatic.com/D_NQ_NP_${data.thumbnail_id}-F.jpg"
                    alt="imagen de juguete">
            </ion-thumbnail>
            <ion-label>
                <h2>${data.title}</h2>
                <h3>$ ${Math.round(data.price)}</h3>
            </ion-label>
        </ion-item>
            `
        })
}

function deleteCartToy() {
    document.querySelector("ion-list").innerHTML = "";
    document.querySelector("#div-cartTotal").innerHTML = `
            <p>0 items</p>
            <span>$ 0</span>
            `
    priceSum = [];
    amount = 0;
}

function cartButton() {
    let $list = document.querySelector("ion-list").innerHTML;
    if ($list === "") {
        cartMessage1();
    }
    else {
        cartMessage2();
    }
}

async function cartMessage1() {
    const toast = await toastController.create({
        color: 'dark',
        duration: 2000,
        message: 'No has agregado nada al carrito',
        showCloseButton: true,
    });

    await toast.present();
}

async function cartMessage2() {
    const toast = await toastController.create({
        color: 'dark',
        duration: 2000,
        message: '¡Compra realizada con éxito!',
        showCloseButton: true,
    });

    await toast.present();
}
