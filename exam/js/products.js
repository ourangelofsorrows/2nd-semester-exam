//product list
//used in previous projects and learnt in class:

const template = document.querySelector("#template").content;
const main = document.querySelector("#products");
const pageCats = document.querySelector("#pageCats");
const urlParms = new URLSearchParams(window.location.search);
const productLink = "http://wp.quickcocktails.dk/wp-json/wp/v2/";
const catID = urlParms.get("cat");
const modal = document.querySelector("#modal");

document.querySelector("#productDetails button").addEventListener("click", function(){
  window.open("https://www.etsy.com/", "_self");
});

function findCats() {
  fetch(productLink + "categories").then(e => e.json()).then(buildCats);

}

findCats();

if (catID) {
  loadByCats(catID);
} else {
  loadAllThings();
}

function buildCats(cats) {
  cats.forEach(cat => {
    console.log(cat);
    const newLink = document.createElement("a");
    newLink.textContent = cat.name;
    newLink.href = "?cat=" + cat.id;
    pageCats.appendChild(newLink);
  });
}

function loadByCats(cat) {
  fetch(productLink + "products?categories=" + cat + "&_embed&per_page=100").then(e => e.json()).then(show);
}

function loadAllThings() {
  fetch(productLink + "products?_embed&per_page=100").then(e => e.json()).then(show);
}

function show(products) {
  products.forEach(product => {
    const clone = template.cloneNode(true);
    clone.querySelector(".prodimg").src = product.product_image.guid;
    clone.querySelector(".prodtitle").textContent = product.product_title;
    clone.querySelector(".price").textContent = product.product_price + " kr.";
    clone.querySelector(".etsy").href = product.product_etsy;

    clone.querySelector(".details").addEventListener("click", () => {
      fetch(productLink + "products/" + product.id + "?_embed").then(e => e.json()).then(data => (showDetails(data)));
    });

    main.appendChild(clone);
  })
}

//showdetails into the modal
function showDetails(product) {
  modal.querySelector("#namedetails").textContent = product.product_title;

  modal.querySelector("#pic").src = product.product_image.guid;
  modal.querySelector("#productPrice").textContent = product.product_price + " kr.";

  if (product.product_measure) {
    modal.querySelector("#measure").textContent = "Height: " + product.product_measure;
  }

  if (product.product_material) {
    modal.querySelector("#material").textContent = "Materials: " + product.product_material;
  }

  modal.querySelector("#description").textContent = product.product_description;
  modal.querySelector("button").href = product.product_etsy;

  modal.classList.remove("hide");
}

modal.querySelector("#cross").addEventListener("click", function () {
  modal.classList.add("hide");
});