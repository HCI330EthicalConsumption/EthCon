let searchHTMLbody = "";
const fillSearchHTML = () => {
    fetch("./index.html", {
        mode: 'no-cors'
    }).then((resp) => {
        return resp.text();
    }).then((data) => {
        searchHTMLbody = data.match(/(?<=<body>\s*).*?(?=\s*<\/body>)/gs)[0];
        // console.log("searchHTML loaded");
    })
}
fillSearchHTML();

let homeHTMLbody = "";
const fillHomeHTML = () => {
    fetch("./shoppinglist.html", {
        mode: 'no-cors'
    }).then((resp) => {
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
    "shoppinglist": "[]",
    "name": "",
    "password": ""
};



const SHA2 = (profile) => {
    let passhash = forge.md.sha256.create();
    passhash.update(profile.password);
    passhash.update(profile.username);
    return passhash.digest().toHex()
}

// profile should have username and password fields here. Name field is optional
const login = async (profile) => {
    try {
        console.log(profile.username + profile.password);
        if (profile.username == "" || profile.password == "") {
            throw "Incomplete profile";
        }
    } catch {
        alert("You must include a username and password");
        console.log("login was called with a missing username or password");
        return;
    }
    if (USER_INFO.objectId != "") {
        alert("You must logout first");
        console.log("login_request called while USER_INFO not empty");
        return;
    }
    USER_INFO.password = SHA2(profile);
    USER_INFO.username = profile.username;
    if (await login_request(profile)) {
        open_search_page();
        window.alert("Welcome, " + USER_INFO.name + "!");
    } else {
        USER_INFO = {
            "username": "",
            "objectId": "",
            "shoppinglistlist": [],
            "shoppinglist": "[]"
        };
    }
}

const login_submit = async () => {
    let un = document.getElementById("username").value; 
    let pass = document.getElementById("password").value;
    login({'username': un, 'name': un, 'password': pass});
};

const signup_submit = async () => {
    console.log('here');
    let name = document.getElementById("new_name").value;
    let un = document.getElementById("new_username").value; 
    let pass = document.getElementById("new_password").value;
    console.log(un); 
    console.log(pass);
    sign_up({'username': un, 'name': un, 'password': pass});
};

const open_login_modal = async () => {
    wrap = document.querySelector('.wrap');
    wrap.style.display = "none"; 
    modal = document.querySelector("#loginModal");
    modal.style.display = "block"; 
};

const open_signup_modal = async () => {
    wrap = document.querySelector('.wrap');
    wrap.style.display = "none"; 
    modal = document.querySelector("#signupModal");
    modal.style.display = "block"; 
};

const logout = () => {
    USER_INFO = {
        "username": "",
        "objectId": "",
        "shoppinglistlist": [],
        "shoppinglist": "[]"
    };
    open_search_page();
};

const open_search_page = () => {
    document.querySelector("body").innerHTML = searchHTMLbody;
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "./js/search.js";
    document.querySelector("body").appendChild(script);
    if (USER_INFO.objectId != "") {
        console.log("user is logged in and we are reloading");
        document.querySelector("#login-button").innerHTML = "Log out of " + USER_INFO.username;
        document.querySelector("#login-button").onclick = logout;
        //document.querySelector("#gotoshoppinglist").onclick = open_home_page;
        //document.querySelector("#gotoshoppinglist").innerHTML = "View Shopping Cart";
        document.querySelector("#signup-button").innerHTML = "View Shopping List";
        document.querySelector("#signup-button").onclick = open_home_page;
    }
    console.log("end of open search page");
};

// Gets the user information based on his/her information stored in the USER_INFO global variable. objectId is what is used in future requests to update the shopping list, otherwise PUT doesn't work.
const login_request = () => {
    url = "https://api.backendless.com/90F1341F-11F7-B61D-FFA2-49B2E5011D00/A72236EE-A275-4EEA-A8D0-E27D9A4C1F0C/data/userprofiles?where=username%3D\'" + USER_INFO.username + "\'%20and%20password%3D\'" + USER_INFO.password + "\'";
    console.log(url);
    return fetch(url).then((resp) => {
        try {
            return resp.json();
        } catch {
            return false;
        }
    }).then((data) => {
        try {
            console.log(data[0]);
            data = data[0];
            try {
                USER_INFO['shoppinglistlist'] = JSON.parse(data['shoppinglist']);
            } catch {
                USER_INFO['shoppinglistlist'] = [];
            }
            USER_INFO['shoppinglist'] = data['shoppinglist'];
            USER_INFO['objectId'] = data['objectId'];
            USER_INFO.name = data.name;
            success = true;
            return true;
        } catch {
            window.alert("Username or password is not valid. Try again or create account.");
            success = false;
            return false;
        }
    })
}

const sign_up = async (profile) => {
    try {
        console.log(profile.name + profile.username + profile.name);
        if (profile.name == "" || profile.username == "" || profile.password == "") {
            throw "Incomplete profile";
        }
    } catch {
        alert("You must include a username, name, and password");
        console.log("make_user was called without a name, username, or password in profile");
        return;
    }
    if (USER_INFO.objectId != "") {
        alert("You must logout first");
        console.log("login_request called while USER_INFO not empty");
        return;
    }
    if (await make_user(profile)) {
        alert("Welcome, " + USER_INFO.name + "!");
        open_search_page();
    }
}

// Makes a user profile if he/she has not already made an account
//  profile must include username, password, and name
const make_user = (profile) => {
    USER_INFO.username = profile.username;
    USER_INFO.password = SHA2(profile);
    USER_INFO.name = profile.name;
    let url = "https://api.backendless.com/90F1341F-11F7-B61D-FFA2-49B2E5011D00/A72236EE-A275-4EEA-A8D0-E27D9A4C1F0C/data/userprofiles";
    return fetch(url, {
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
            window.alert("User already created. Sign in or use another username.");
            return false
        }
    }).then((data) => {
        console.log(data);
        if (data == false) {
            return false;
        }
        try {
            // data = data[0]
            USER_INFO.objectId = data.objectId;
            console.log(data);
            return true;
        } catch {
            return false;
        }
    });
}

let numberPerPage = 5;
let numberOfPages = 0;
let currentPage = 1;
let productList = null;
let curr_search_page = 1;

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
    data = await search_gg(search_terms, sortby, curr_search_page);
    curr_search_page += 1;
    console.log("curr_search_page "+ curr_search_page)
    if (productList) {
        if (data[data.length-1] != productList[productList-1]) {
            console.log(productList);
            console.log(data);
            productList = productList.concat(data);
            console.log(productList);
        }

    } else{
        productList = data;
    }
    numberOfPages = Math.floor(productList.length / numberPerPage);
    generatePaginationHtml(numberOfPages, currentPage);
    return productList;
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

const generatePaginationHtml = async (totalCount, currentPage) =>{
    console.log(currentPage);
    let template = `
    <div class="pwrap">`;
    let i = currentPage - 2 <= 0 ? 1 : currentPage - 2;
    let stop_page = i + 4;
    if (numberOfPages <= stop_page) {
        await search_products();
    }

    for (; i <= stop_page; i++) {
        template += `
        <div class = "pagination"><a "`;
        if (currentPage == i) {
            template += `class="active" style="border-bottom:3px solid rgba(19, 194, 194, .6)"`;
        }
        template += `href="#" onclick="loadPage(` + i + `)">` + i + `</a></div>`;
    }
    template += `
        </div>`;
    document.querySelector('#navigation').innerHTML = template;
    document.querySelector('#bottom-navigation').innerHTML = template;
};

function loadPage(i) {
    currentPage = i;
    console.log(productList);
    load_results(productList);
    generatePaginationHtml(numberOfPages, currentPage);
}


// Given an array of product json objects, loads the products into the #product HTML element.
//  Each product json object should include: id, image, name, brand.name, and rating
const load_results = (products) => {
    generateSearchBarCss();
    //document.querySelector('body').style.backgroundImage = "none";
    document.querySelector('#bg-img').style.display = "none";
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
            </p>
            <span id="hover_text">Our ratings are out of ten, and are derived by evaluating ingredient hazards to the environment, transparency of the parent company, and policies regarding fair wages and treatment of workers.</span>
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
            <div id="prod_stuff">
               <div class="modal-img">
                 <img src="${product_info.img}">
              </div>
                <div id="basic_info">
                <div><h4>Parent Company: </h4>${product_info.parent_companies[0]}</div>
                <div id="rating_info"><h4>Ethical Responsibility: </h4>${product_info.rating}/10</div>`;
            document.querySelector("#rating_info").innerHTML += parse_rating_info(product_info.rating_info);
            document.querySelector(".modal-body").innerHTML += `<div id="product_about"><h4>About the Product: </h4>${product_info.about}</div>`;
            document.querySelector(".modal-body").innerHTML += parse_related_products(product_info.related_products);
            get_reviews(product_info.product_url)
                .then((data) => {
                    display_reviews(data);
                });
            var modal = document.getElementById("myModal");
            modal.style.display = "block";
            document.getElementById("review_form").reset();
            resetRatingStars();
            if (USER_INFO.objectId == "") {
                console.log('no log in');
                document.querySelector("#add_to_shopping_list").innerHTML = "Login to add to shopping cart";
            }
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
            <div class="name"><span>${review.name}</span> rated it ${display_stars(review.rating)}</div>
            <div class="recommended">Would recommend? ${review.recommend}</div>
            <div class="break"></div>
            <div class="review_text">${review.review_text}</div>
      </section>`
        document.querySelector('.prev_reviews').innerHTML += template;
    };
}

const display_stars = (rating) =>{
    var template = ``
    if (rating == '1'){
        template = `<i class="fas fa-star"></i>`
    }
    if (rating == '2'){
        template = `<i class="fas fa-star"></i>
        <i class="fas fa-star"></i>`
    }
    if (rating== '3'){
        template = `<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>`
    }
    if (rating== '4'){
        template = `<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>`
    }
    if (rating== '5'){
        template = `<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>`
    }
    return template
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
    let str = "<div><h3>Rating details: </h3>";
    for (info of ratingInfo) {
        str += `
            <div><h4>${info.criterion}: </h4>${info.rating}/10</div>
            </div>`;
    }
    str += "</div> </div>";
    return str;
}

const parse_related_products = (relatedProducts) => {
    let str = "<div id='related'><h4>Related Products: </h4>";
    for (product of relatedProducts) {
        str += `
            <div product_url="${product.url}">
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
    // let prod_url = event.currentTarget.getAttribute("prod-url");
    let product = {};
    product["name"] = event.currentTarget.getAttribute("name");
    product["img"] = event.currentTarget.getAttribute("img");
    product["url"] = event.currentTarget.getAttribute("prod-url");
    console.log(product);
    console.log(USER_INFO.shoppinglistlist);
    if (JSON.stringify(USER_INFO['shoppinglistlist']).indexOf(JSON.stringify(product)) >= 0) {
        window.alert("You already have that item in your cart!");
        return
    }
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
    let product = {};
    let product_card = event.currentTarget.parentElement;
    product["name"] = product_card.querySelector("div.list-prod").innerHTML;
    product["img"] = product_card.querySelector("img.list-img").src;
    product["url"] = event.currentTarget.getAttribute("prod-url");

    console.log(JSON.stringify(product));
    // const index = USER_INFO.shoppinglist.indexOf(JSON.stringify(product));
    // console.log(index);
    for (index in USER_INFO.shoppinglistlist) {
        if (USER_INFO.shoppinglistlist[index].url == product.url) {
            USER_INFO.shoppinglistlist.splice(index, 1);
        }
    }
    // if (index > -1) {
    //     USER_INFO.shoppinglist.splice(index, JSON.stringify(product).length);
    //     console.log(USER_INFO.shoppinglist);
    // }
    // USER_INFO.shoppinglistlist = JSON.parse(USER_INFO.shoppinglist);

    
    // const index = USER_INFO.shoppinglistlist.indexOf(product);
    // if (index > -1) {
    //     USER_INFO.shoppinglistlist.splice(index, 1);
    // }
    update_shopping_list("removed");
    open_home_page();
}


function validateForm(product_info) {
    var name = product_info["name"];
    var email = product_info["email"];
    var rating = product_info["rating"];
    var recommend = product_info["recommend"];
    // var a = document.forms["review_form"]["name1"].value;
    if (name == "") {
        alert("Name must be filled out");
        document.getElementsByClassName('.button').href = "#";
        // document.getElementsByClassName('.overlay').visibility = "hidden";
        return false;
    } else if (email == "") {
        alert("Email must be filled out");
        document.getElementsByClassName('.button').href = "#";
        // document.getElementsByClassName('.overlay').visibility = "hidden";
        return false;
    } else if (rating == undefined) {
        alert("Must submit a rating");
        document.getElementsByClassName('.button').href = "#";
        // document.getElementsByClassName('.overlay').visibility = "hidden";
        return false;
    }
    // else if (recommend == undefined){
    //     alert("Must chose whether to recommend");
    //     document.getElementsByClassName('.button').href = "#";
    //     document.getElementsByClassName('.overlay').visibility = "hidden";
    //     return false;
    // }
    else {
        document.getElementsByClassName('.button').href = "#popup";
        // document.getElementsByClassName('.overlay').visibility = "visible";
        return true;
    }
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
    document.querySelector(".signin").style.visibility = "hidden";
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "./js/home.js";
    document.querySelector("body").appendChild(script);
    document.querySelector('#my-shopping-list').innerHTML = "";
    let template = '';
    /*let template = `<div id = "list-name">
    <p id="list-title">My Shopping List</p>
    <div class="line"></div>
    </div>
    <br></br>`;*/
    if (USER_INFO["shoppinglistlist"].length == 0) {
        template += `<p id="empty-list">Your shopping list is empty :(.</p>
        <p id="empty-instructions">Search for a product to add items to list.</p>`;
    } else {
        template += `
      <ol class="rectangle-list" id="shopping-list">`;
        for (product of USER_INFO["shoppinglistlist"]) {
            template += `
          <li id="list-item"><a class="list-content"><img class="list-img" src="${product["img"]}"><div class="list-prod">${product["name"]}</div><div class="trash" name=${product["name"]} img=${product["img"]} prod-url=${product["url"]}><i class="fas fa-trash"></i></div></a></li>`; 
        }
        template += `
      </ol>`;
    }
    document.querySelector('#my-shopping-list').innerHTML = template;
    for (prod of document.querySelectorAll('.trash')) {
        prod.onclick = remove_from_shopping_list; 
    }
}

function generateSearchBarCss() {
    let x = document.querySelector('.search-hide');
    x.style.display = "none"
    let w = document.querySelector('.wrap');
    w.style.top = "15%";
    w.style.left = "25%";
    w.style.padding = "0";
    w.style.float = "left";
    w.style.transform = "translate(-50%. -50%)";
};