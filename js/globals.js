let searchHTMLbody = "";
const fillSearchHTML = () => {
    fetch("./search.html", {mode: 'no-cors'}).then((resp) => {
        return resp.text();
    }).then((data) => {
        searchHTMLbody = data.match(/(?<=<body>\s*).*?(?=\s*<\/body>)/gs)[0];
        console.log("searchHTML loaded");
    })
}
fillSearchHTML();

let homeHTMLbody = "";
const fillHomeHTML = () => {
    fetch("./index.html", {mode: 'no-cors'}).then((resp) => {
        return resp.text();
    }).then((data) => {
        homeHTMLbody = data.match(/(?<=<body>\s*).*?(?=\s*<\/body>)/gs)[0];
    })
}
fillHomeHTML();

let USER_INFO = {
    "username": "",
    "objectId": "",
    "shoppinglistlist": [],
    "shoppinglist": "[]"
};

const open_search_page = () => {
    document.querySelector("body").innerHTML = searchHTMLbody;
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "./js/search.js";
    document.querySelector("body").appendChild(script);
}

// Gets the user information based on his/her username. objectId is what is used in future requests to update the shopping list, otherwise PUT doesn't work.
const get_user_info_from_username = (username) => {
    USER_INFO['username'] = username
    url = "https://api.backendless.com/90F1341F-11F7-B61D-FFA2-49B2E5011D00/A72236EE-A275-4EEA-A8D0-E27D9A4C1F0C/data/userprofiles?where=username%3D\'" + username.replace("@", "%40") + "\'";
    console.log(url);
    fetch(url).then((resp) => {
        try {
            return resp.json();
        } catch {
            return;
        }
    }).then((data) => {
        try {
            console.log(data[0]);
            data = data[0];
            try {
                USER_INFO['shoppinglistlist'] = JSON.parse(data['shoppinglist']);
            } catch {
                USER_INFO['shoppinglistlist'] = []
            }

            USER_INFO['shoppinglist'] = data['shoppinglist'];
            USER_INFO['objectId'] = data['objectId'];
        } catch {
            window.alert("Username is not valid. Try again or create account.")
        }
    })
}

// Makes a user profile if he/she has not already made an account
const make_user = (username) => {
    USER_INFO.username = username;
    let url = "https://api.backendless.com/90F1341F-11F7-B61D-FFA2-49B2E5011D00/A72236EE-A275-4EEA-A8D0-E27D9A4C1F0C/data/userprofiles";
    fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(USER_INFO)
    }).then((resp) => {
        if (resp.status == 200) {
            return resp.json();
        } else if (resp.status == 400) {
            window.alert("User already created. Sign in instead.");
        }
    }).then((data) => {
        try {
            data = data[0]
            USER_INFO.objectId = data.objectId;
            console.log(data);
        } catch {
            return
        }
    });
}

let numberPerPage = 5;
let numberOfPages = 0;
let currentPage = 1;
let productList = null;

const get = async (url) => {
    console.log(url);
    //const proxyurl = "https://cors-anywhere.herokuapp.com/"; // use for local work - limits requests per hour though
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
const search_products = async () => {
    console.log(document.getElementById("search-terms").value);
    sortby = document.getElementById("sortby").value;
    console.log(sortby);
    search_terms = document.getElementById("search-terms").value;
    data = await search_gg(search_terms, sortby, 1);
    numberOfPages = Math.ceil(data.length / numberPerPage);
    productList = data;
    generatePaginationHtml(numberOfPages, 1);
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

function generatePaginationHtml(totalCount, currentPage) {
    let template = `
    <div class="pwrap">`;
    for (let i = 1; i <= totalCount; i++) {
        template += `
        <div class = "pagination"><a "`;
        if (currentPage == i) {
            template += `class="active" `;
        }
        template += `href="#" onclick="loadPage(` + i + `)">` + i + `</a></div>`;
    }
    template += `
        </div>`;
    document.querySelector('#navigation').innerHTML = template;
};

function loadPage(i) {
    currentPage = i;
    load_results(productList);
}


// Given an array of product json objects, loads the products into the #product HTML element.
//  Each product json object should include: id, image, name, brand.name, and rating
const load_results = (products) => {
    generatePaginationHtml(numberOfPages, currentPage);
    let begin = ((currentPage - 1) * numberPerPage);
    let end = begin + numberPerPage;
    let p = products.slice(begin, end);
    document.querySelector('#products').innerHTML = '';
    for (product of p) {
        const template = `<section class="product-card" id="${product.id}" product-url="${product.url}">
          <div class="left">
              <img src="${product.image}">
          </div>
          <div class ="right">
              <h1 id="prod_name">${product.name}</h1>
              <p>${product.brand.name}</p>
          </div>
          <div>
            <p class="numberCircle${product.rating} numberCircle">
                ${product.rating}
                <p style="font-size:4;">/10</p>
            </p>
          </div>
      </section>`
        document.querySelector('#products').innerHTML += template;
    };
    if (p.length == 0) {
        document.getElementById("results").innerHTML = "No Results Found :(";
        // ¯\\_(ツ)_/¯
    } else {
        document.getElementById("results").innerHTML = "Results";
    }
    //check();

    // onClick functions -- have product page maker be called in this
    for (card of document.querySelectorAll(".product-card")) {
        card.onclick = async (event) => {
            console.log(event.currentTarget.getAttribute("class"));
            url = event.currentTarget.getAttribute("product-url");
            let product_info = await get_product_info(url);
            document.querySelector("#add_to_shopping_list").setAttribute("prod-url", product_info['product_url']);
            document.querySelector("#add_to_shopping_list").setAttribute("name", product_info['name']);
            document.querySelector("#add_to_shopping_list").setAttribute("img", product_info['img']);
            console.log(url);
            console.log(product_info);
            // Make product page with the product_info
            document.querySelector(".modal-body").innerHTML =
                `<div id="modal_overall" product_url="${product_info.product_url}">${product_info.name}</div>
               <div class="modal-img">
                 <img src="${product_info.img}">
              </div>
              <div>Parent Company: ${product_info.parent_companies[0]}</div>
              <div>Ethical Responsibility: ${product_info.rating}</div>`;
            document.querySelector(".modal-body").innerHTML += parse_rating_info(product_info.rating_info);
            document.querySelector(".modal-body").innerHTML += `<div>About the Product: ${product_info.about}</div>`;
            /*document.querySelector(".modal-body").innerHTML += parse_related_products(product_info.related_products);*/
            get_reviews(product_info.product_url)
                .then((data) => {
                    display_reviews(data);
                });
            var modal = document.getElementById("myModal");
            modal.style.display = "block";
            document.getElementById("review_form").reset();
            resetRatingStars();
        }
    }
};

function check() {
    document.getElementById("next").disabled = currentPage == numberOfPages ? true : false;
    document.getElementById("previous").disabled = currentPage == 1 ? true : false;
    document.getElementById("first").disabled = currentPage == 1 ? true : false;
    document.getElementById("last").disabled = currentPage == numberOfPages ? true : false;
};

const display_reviews = (reviews) => {
    document.querySelector(".prev_reviews").innerHTML = '<h2>Previous Reviews</h2>';
    if (reviews.length == 0) {
        document.querySelector('.prev_reviews').innerHTML += '<div>No reviews yet</div>';
    }
    for (review of reviews) {
        const template = `<section class="review-card" id="${review.product_url}" product-url="${review.product_url}">
            <div class="name">${review.name} rated it ${review.rating}</div>
            <div class="review_text">${review.review_text}</div>
            <div class="recommended">Would recommend? ${review.recommend}</div>
      </section>`
        document.querySelector('.prev_reviews').innerHTML += template;
    };
}

const get_reviews = async (product_url) => {
    const rawResponse = await fetch('https://api.backendless.com/90F1341F-11F7-B61D-FFA2-49B2E5011D00/A72236EE-A275-4EEA-A8D0-E27D9A4C1F0C/data/Reviews?where=product_url%3D\'' + product_url.replace('/\//g', "%2F") + "'", {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    const content = await rawResponse.json();
    console.log(content);
    return content
}

const parse_rating_info = (ratingInfo) => {
    let str = "<div>Rating details: ";
    for (info of ratingInfo) {
        str += `
         <div>${info.criterion}</div>
         <div>${info.rating}</div>`;
    }
    str += "</div>";
    return str;
}

const parse_related_products = (relatedProducts) => {
    let str = "<div>Related Products: ";
    for (product of relatedProducts) {
        str += `<div product_url="${product.url}">
            <div>
            <img src="${product.img}">
            </div>
            <div>${product.name}</div>
         </div>`;
    }
    str += "</div>";
    return str;
}

const search_and_load = () => {
    search_terms = document.getElementById("search-terms").value;
    console.log(search_terms);
    if (search_terms == "") {
        alert("Please enter valid search term");
        return false;
    }
    document.getElementById("results").innerHTML = "Searching...";
    search_products()
        .then((products) => {
            load_results(products);
        });
    var r = document.getElementById("results")
    r.style.visibility = "visible";
}

// parse_product_*: used as halper functions is get_product_info
const parse_product_about = (htmlObject) => {
    try {
        return htmlObject.querySelector("#product-about p").innerHTML;
    } catch {
        console.log("Error trying to get product about info");
        return "Product info not found";
    }
}

const parse_product_related = (htmlObject) => {
    let related_products = [];
    let i = 0;
    try {
        for (item of htmlObject.querySelectorAll(".side-section > .product-card")) {
            related_products[i] = {}
            related_products[i].url = item.querySelector(".gg-analytics a").getAttribute("href");
            related_products[i].img = item.querySelector("img").src;
            related_products[i].name = item.querySelector(".product-card-title a").innerHTML;
            related_products[i].rating = item.querySelector(".ring-value a").innerHTML;
            related_products[i].parent_company = item.querySelector(".product-card-brand a").innerHTML;
            i += 1;
        }
    } catch {
        console.log("Error getting related products");
        return [];
    }
    return related_products;
}

const parse_product_rating_details = (htmlObject) => {
    let info = [];
    let i = 0;
    try {
        for (item of htmlObject.querySelectorAll(".rating-explained > li")) {
            info[i] = {};
            info[i].criterion = item.querySelector(".ring-caption").innerHTML;
            info[i].rating = item.querySelector(".ring-value a").innerHTML;
            i += 1;
        }
    } catch {
        console.log("Error trying to get rating details")
        return [];
    }
    return info;
}

const parse_product_parent_companies = (htmlObject) => {
    let parents = [];
    let i = 0;
    try {
        let items = htmlObject.querySelectorAll("ul.list > li > ul.no-bullet.list-detail > li > div");
        for (item of items) {
            try {
                if (item.getAttribute("data-event-name") == "Clicked company") {
                    parents[i] = item.querySelector("a").innerHTML;
                    i += 1;
                }
            } catch {
                console.log("Error finding parent companies");
            }
        }
    } catch {
        console.log("Error trying to get parent companies")
        return ["Parent company not found"];
    }
    return parents;
}

const parse_product_rating = (htmlObject) => {
    try {
        return htmlObject.querySelector(".product-donut p.number a").innerHTML;
    } catch (err) {
        console.log("Error trying to get product rating");
        return "X";
    }
}
const parse_product_name = (htmlObject) => {
    try {
        return htmlObject.querySelector(".product-highlight h1.text-center").innerHTML;
    } catch (err) {
        console.log("Error trying to get product name");
        return "Error: Product name not found";
    }
}
const parse_product_img = (htmlObject) => {
    try {
        return htmlObject.querySelector(".product-highlight-image img").src;
    } catch (err) {
        console.log("Error trying to get product image");
        return "";
    }

}

// Takes the product url extension (e.g. "/products/402220-phyto-phytovolume-shampoo-volumizing-fine-hair") and returns a product_info object
//  Async function, so must be called with a callback ( a .then function ) or wrapped in another async function with the keyword await
//  ex. let product_info = await(get_product_info(url)
//  ex. get_product_info(url).then((product_info) => {
//          (do something with product_info)
//      })
const get_product_info = async (prod_url) => {
    const url = "www.goodguide.com" + prod_url + "#/";
    const resp = await get(url);
    let data = await resp.text();
    let productPageHTML = document.createElement('div');
    productPageHTML.innerHTML = data;
    let about = parse_product_about(productPageHTML);
    let rating = parse_product_rating(productPageHTML);
    let related_products = parse_product_related(productPageHTML);
    let rating_info = parse_product_rating_details(productPageHTML);
    let name = parse_product_name(productPageHTML);
    let img = parse_product_img(productPageHTML);
    let parent_companies = parse_product_parent_companies(productPageHTML);
    let product_info = {
        "product_url": prod_url,
        "name": name, // string
        "img": img, // url to image
        "rating": rating, // number
        "rating_info": rating_info, // list of json objects {"criterion": "Ingedient hazard", "rating":"5"}
        "about": about, // string of about paragraph
        "parent_companies": parent_companies, // list of strings of parent companies
        "related_products": related_products //json objects with properties {url, image, rating, name, parent_company}
    }
    return product_info;
}

const add_to_shopping_list = (event) => {
    let prod_url = event.currentTarget.getAttribute("prod-url");
    if (USER_INFO['shoppinglistlist'].indexOf(prod_url) >= 0) {
        window.alert("You already have that item in your cart!");
        return
    }
    let product = {};
    product["name"] = event.currentTarget.getAttribute("name");
    product["img"] = event.currentTarget.getAttribute("img");
    product["url"] = event.currentTarget.getAttribyte("url");
    USER_INFO['shoppinglistlist'].push(product);
    // USER_INFO['shoppinglistlist'].push(prod_url);
    // USER_INFO['shoppinglist'] = JSON.stringify(USER_INFO['shoppinglistlist']);
    console.log(USER_INFO['shoppinglist']);
    update_shopping_list("added");
    // fetch("https://api.backendless.com/90F1341F-11F7-B61D-FFA2-49B2E5011D00/A72236EE-A275-4EEA-A8D0-E27D9A4C1F0C/data/userprofiles/" + USER_INFO["objectId"], {
    //     method: 'PUT',
    //     headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(USER_INFO)
    // }).then((resp) => {
    //     return resp.json();
    // }).then((data) => {
    //     data['shoppinglist'] = JSON.parse(data['shoppinglist'])
    //     console.log(data);
    // })
}

const update_shopping_list = (action) => {
    if (USER_INFO.objectId == "") {
        window.alert("You must be signed in to add to shopping cart!");
        return;
    }
    USER_INFO['shoppinglist'] = JSON.stringify(USER_INFO['shoppinglistlist']);
    console.log(USER_INFO['shoppinglist']);
    console.log("list");
    console.log(USER_INFO['shoppinglistlist']);
    fetch("https://api.backendless.com/90F1341F-11F7-B61D-FFA2-49B2E5011D00/A72236EE-A275-4EEA-A8D0-E27D9A4C1F0C/data/userprofiles/" + USER_INFO["objectId"], {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(USER_INFO)
    }).then((resp) => {
        return resp.json();
    }).then((data) => {
        data['shoppinglist'] = JSON.parse(data['shoppinglist'])
        window.alert("Item " + action + " from shopping list")
        console.log(data);
    })
}

const remove_from_shopping_list = (event) => {
    let prod_url = event.currentTarget.getAttribute("prod-url");
    const index = USER_INFO.shoppinglistlist.indexOf(prod_url);
    if (index > -1) {
        USER_INFO.shoppinglistlist.splice(index, 1);
    }
    update_shopping_list("removed");
}

const send_to_db = async (product_info) => {
    console.log(JSON.stringify(product_info));
    const rawResponse = await fetch('https://api.backendless.com/90F1341F-11F7-B61D-FFA2-49B2E5011D00/A72236EE-A275-4EEA-A8D0-E27D9A4C1F0C/data/Reviews', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product_info)
    });
    const content = await rawResponse.json();
    console.log(content);
    get_reviews(product_info.product_url)
        .then((data) => {
            display_reviews(data);
        });
}


/**
 * Changes the rating star colors when hovering over it.
 */
function changeRatingStars() {
    // Current star hovered
    var star = $(this);

    // Removes all colors first from all stars
    $('.fa-star').removeClass('gray').removeClass('yellow');

    // Makes the current hovered star yellow
    star.addClass('yellow');

    // Makes the previous stars yellow and the next stars gray
    star.parent().prevAll().children('.fa-star').addClass('yellow');
    star.parent().nextAll().children('.fa-star').addClass('gray');
}

/**
 * Resets the rating star colors when not hovered anymore.
 */
function resetRatingStars() {
    star_elements.each(function (i, elem) {
        $(elem).removeClass('yellow').removeClass('gray').addClass(current_star_statusses[i] ? 'yellow' : 'gray');
    });
}

const open_home_page = () => {
    document.querySelector("body").innerHTML = homeHTMLbody;
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "./js/home.js";
    document.querySelector("body").appendChild(script);
<<<<<<< HEAD
}
=======
    document.querySelector('#my-shopping-list').innerHTML = "";
    let template = '';
    /*let template = `<div id = "list-name">
    <p id="list-title">My Shopping List</p>
    <div class="line"></div>
  </div>
  <br></br>`;*/
  if(USER_INFO["shoppinglistlist"].length == 0){
      template += `<p id="empty-list">Your shopping list is empty :(.</p>
        <p id="empty-instructions">Search for a product to add items to list.</p>`; 
  }
  else{
      template += `
      <ol class="rectangle-list" id="shopping-list">`;
      for(product of USER_INFO["shoppinglistlist"]){
          template += `
          <li id="list-item"><a href=""><img class="list-img" src="${product["img"]}"><div class="list-prod">${product["name"]}</div></a></li>`;
      }
      template += `
      </ol>`;
  }
  document.querySelector('#my-shopping-list').innerHTML = template; 
}
>>>>>>> master
