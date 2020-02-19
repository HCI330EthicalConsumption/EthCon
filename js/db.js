// import DatePicker from 'antd/es/date-picker'

const get = async (url) => {
    console.log(url);
    // const proxyurl = "https://cors-anywhere.herokuapp.com/"; // use for local work - limits requests per hour though
    const proxyurl = "https://jtschuster1.azurewebsites.net/"; // Web app that gives us unlimited requests - use for final push
    console.log(proxyurl + url);
    let data = await fetch(proxyurl + url);
    return data;
}
// takes in keywords to search for and returns a list of product json objects. Returns up to 21 products.
// IF ASSIGNING TO VARIABLE, MUST USE THE KEYWORD "await"
// OTHERWISE USE THE .then() callback function
// keywords => terms to search by. Can include spaces.
// sortby => 'rating' or 'relevance'. default is relevance.
// pagenum => int or string of the page number requesting.
const search_gg = async (keywords, sortby, pagenum) => {
    keyword_term = encodeURIComponent(sortby.trim());
    if (sortby.toLowerCase() == "rating") {
        sort_term = "health_rating";
    } else {
        sort_term = "relevance";
    }
    if (!isNaN(pagenum)) {
        pagenum = Math.round(pagenum) + "";
    } else {
        pagenum = "1";
    }
    const url = "www.goodguide.com/catalog/search.json?filter=" + keywords + "&sort=" + sort_term + "&page=" + pagenum;

    const resp = await get(url);
    let data = await resp.json();
    console.log(data);
    return data.products;
}
//Not useable yet
const search_wal = async (keywords) => {
    const url = "https://www.walmart.com/search/?query=" + keywords;
    const resp = await get(url);
    console.log(resp);
    let data2 = await resp.text();
    console.log(data2);
    var htmlObject = document.createElement('div');
    htmlObject.innerHTML = data2;
    let interesting_stuff = htmlObject.getElementsByClassName("search-result-gridview-items");
    htmlObject.innerHTML = data2;
    let imgs = htmlObject.getElementsByTagName("img");
    console.log(imgs);
    for (img of imgs) {
        console.log(img.src);
    }
    console.log(interesting_stuff[0].getElementsByClassName(""));
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(interesting_stuff, "application/xml");
    console.log(xmlDoc);
    let data = xmlToJson(xmlDoc);
    console.log(JSON.stringify(data));
    return data;
}

const search_amazon = async (keywords) => {
    keyword_term = encodeURIComponent(sortby.trim());
    const url = "amazon.com/s?k=" + keyword_term;
    const resp = await get(url);
    console.log(resp);
    let data = await resp.text();
    console.log(data);
    var htmlObject = document.createElement('div');
    htmlObject.innerHTML = data;
    let interesting_stuff = htmlObject.querySelectorAll("div[data-index]");

    let imgs = htmlObject.getElementsByTagName("img");
    console.log(imgs);
    for (img of imgs) {
        console.log(img.src);
    }
    console.log(interesting_stuff[0].getElementsByClassName(""));
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(interesting_stuff, "application/xml");
    console.log(xmlDoc);

    return data;
}

//returns products for a good guides query
const get_products = async () => {
    console.log(document.getElementById("search-terms").value);
    sortby = document.getElementById("sortby").value;
    console.log(sortby);
    search_terms = document.getElementById("search-terms").value
    data = await search_gg(search_terms, sortby, 1);
    return data;
};

// Used as keypress event listener, determines whether the enter key was pressed in event
//  returns true if enter was pressed, else false.
const search_on_enter = (event) => {
    // var r = document.getElementById("results")
    // r.style.visibility = "visible";
    if (event.which == 13 || event.keyCode == 13) {
        console.log("enter pressed");
        return true;
    }
    return false;
}

// Given an array of product json objects, loads the products into the #product HTML element.
//  Each product json object should include: id, image, name, brand.name, and rating
const load_results = (products) => {
    document.querySelector('#products').innerHTML = '';
    for (product of products) {
        const template = `<section class="product-card" id="${product.id}">
          <div class="left">
              <img src="${product.image}">
          </div>
          <div class ="right">
              <h1 id="prod_name">${product.name}</h1>
              <p>${product.brand.name}</p>
          </div>
          <div>
            <p class="numberCircle${product.rating} numberCircle">${product.rating}</p>
          </div>
      </section>`
        document.querySelector('#products').innerHTML += template;
    };
    if (products.length == 0) {
        document.getElementById("results").innerHTML = "No Results Found :(";
        // ¯\\_(ツ)_/¯
    } else {
        document.getElementById("results").innerHTML = "Results";
    }
};

const search_and_load = () => {
    document.getElementById("results").innerHTML = "Searching...";

    get_products()
        .then((products) => {
            load_results(products);
        });
    var r = document.getElementById("results")
    r.style.visibility = "visible";
}

document.querySelector('#go').onclick = async () => {
    search_and_load();
};

const get_company_amazon = async (url) => {
    let response = await get(url);
    let data = await response.text();
    let htmlObj = document.createElement("div");
    htmlObj.innerHTML = data;
    console.log(data);
    let desired = htmlObj.querySelector("#byline_info_feature_div");
    console.log(desired.innerHTML);
    return desired.innerHTML;
}


document.querySelector('#search-terms').onkeypress = (event) => {
    enter_pressed = search_on_enter(event); //determine if enter was the key pressed
    if (enter_pressed) { // if so, get products and load them
        search_and_load();
    };
};

document.querySelector("#sortby").onchange = async () => {
    if (document.getElementById("search-terms").value != "") {
        search_and_load();
    }

};