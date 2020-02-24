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
        const template = `<section class="product-card" id="${product.id}" product-url="${product.url}">
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
    for (card of document.querySelectorAll(".product-card")) {
        card.onclick = async (event) => {
            console.log(event.currentTarget.getAttribute("class"));
            url = event.currentTarget.getAttribute("product-url");
            let product_info = await get_product_info(url);
            console.log(product_info);
        }
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

const parse_product_about = (htmlObject) => {
    return htmlObject.querySelector("#product-about p").innerHTML;
}

const parse_product_related = (htmlObject) => {
    let related_products = [];
    let i = 0;
    for (item of htmlObject.querySelectorAll(".side-section > .product-card")) {
        related_products[i] = {}
        related_products[i].url = item.querySelector(".gg-analytics a").getAttribute("href");
        related_products[i].img = item.querySelector("img").src;
        related_products[i].name = item.querySelector(".product-card-title a").innerHTML;
        related_products[i].rating = item.querySelector(".ring-value a").innerHTML;
        related_products[i].parent_company = item.querySelector(".product-card-brand a").innerHTML;
        i += 1;
    }
    return related_products;
}

const parse_product_rating_details = (htmlObject) => {
    let info = [];
    let i = 0;
    for (item of htmlObject.querySelectorAll(".rating-explained > li")) {
        console.log(item);
        info[i] = {};
        info[i].criterion = item.querySelector(".ring-caption").innerHTML;
        info[i].rating = item.querySelector(".ring-value a").innerHTML;
        i += 1;
    }
    return info;
}

const parse_product_parent_companies = (htmlObject) => {
    let parents = [];
    let i = 0;
    let items = htmlObject.querySelectorAll("ul.list > li > ul.no-bullet.list-detail")[1];
    console.log(items);
    console.log(items.querySelectorAll("a"));
    for (comp of items.querySelectorAll("a")) {
        console.log(item);
        parents[i] = comp.innerHTML;
        i += 1;
    }
    return parents;
}

const parse_product_rating = (htmlObject) => {
    return htmlObject.querySelector(".product-donut p.number a").innerHTML;
}

const parse_product_name = (htmlObject) => {
    return htmlObject.querySelector(".product-highlight h1.text-center").innerHTML;
}
const parse_product_img = (htmlObject) => {
    return htmlObject.querySelector(".product-highlight-image img").src;
}

const get_product_info = async (prod_url) => {
    const url = "www.goodguide.com" + prod_url + "#/";
    // get(url).then((response) => {
    //     // console.log(response);
    //     return response.text();
    // }).then((data) => {
    //     console.log(data);
    //     let htmlObject = document.createElement('div');
    //     htmlObject.innerHTML = data;
    //     console.log(htmlObject.innerHTML);
    //     let about = parse_product_about;
    //     console.log(about);
    //     let related_products = parse_product_related(htmlObject);
    //     console.log(related_products);
    //     let rating_info = parse_product_rating_details(htmlObject);
    //     console.log(rating_info);
    //     let parent_companies = parse_product_parent_companies(htmlObject);
    //     console.log(parent_companies);

    // })
    const resp = await get(url);
    let data = await resp.text();
    console.log(data);
    let htmlObject = document.createElement('div');
    htmlObject.innerHTML = data;
    console.log(htmlObject.innerHTML);
    let about = parse_product_about(htmlObject);
    console.log(about);
    let rating = parse_product_rating(htmlObject);
    console.log(rating);
    let related_products = parse_product_related(htmlObject);
    console.log(related_products);
    let rating_info = parse_product_rating_details(htmlObject);
    console.log(rating_info);
    let name = parse_product_name(htmlObject);
    console.log(name);
    let img = parse_product_img(htmlObject);
    console.log(img);
    let parent_companies = parse_product_parent_companies(htmlObject);
    console.log(parent_companies);
    let product_info = {
        "name": name, // string
        "img": img, // url to image 
        "rating": rating, // number
        "rating_info": rating_info, // list of json objects {"criterion": "example criterion", "rating":"5"}
        "about": about, // string of about paragraph
        "parent_companies": parent_companies, // list of strings of parent companies
        "related_products": related_products //json objects with properties {url, image, rating, name, parent_company}
    }
    return product_info;
}

document.querySelector('#go').onclick = async () => {
    search_and_load();
};

document.querySelector('#search-terms').onkeypress = (event) => {
    enter_pressed = search_on_enter(event); //determine if enter was the key pressed
    if (enter_pressed) { // if so, get products and load them
        search_and_load();
    };
};

// document.querySelector(".product-card").onclick = (event) => {
//     url = event.target.getAttribute("product-url");
//     get_product_info(url);
// }

document.querySelector("#sortby").onchange = async () => {
    if (document.getElementById("search-terms").value != "") {
        search_and_load();
    }

};