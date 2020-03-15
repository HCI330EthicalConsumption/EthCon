// import DatePicker from 'antd/es/date-picker'

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

window.onclick = function (event) {
    var modal = document.getElementById("myModal");
    var loginModal = document.getElementById("loginModal");
    var signupModal = document.getElementById("signupModal");
    if (event.target == modal) {
        modal.style.display = "none";
        wrap = document.querySelector('.wrap');
        wrap.style.display = "block"; 
    }
    else if (event.target == loginModal) {
        loginModal.style.display = "none";
        wrap = document.querySelector('.wrap');
        wrap.style.display = "block"; 
    }
    else if (event.target == signupModal) {
        signupModal.style.display = "none";
        wrap = document.querySelector('.wrap');
        wrap.style.display = "block"; 
    }
};

document.querySelector("#add_to_shopping_list").onclick = add_to_shopping_list;


document.querySelector('#rate').onclick = async () => {
    name = document.querySelector('#name1').value;
    rating = document.querySelector('#rating').value;
    review_text = document.querySelector('#review').value;
    recommend = document.querySelector('#recommend').value;
    product_url = document.querySelector('#modal_overall').getAttribute("product_url");
    email = document.querySelector('#email').value;
    console.log(document.querySelector('#modal_overall'));
    // product_url = product.product_url
    let product_info = {
        "name": name,
        "rating": rating,
        "review_text": review_text,
        "recommend": recommend,
        "product_url": product_url,
        "email": email
    };
    var correct = validateForm(product_info);
    if (correct == true) {
        console.log(product_info);
        send_to_db(product_info);
        // document.getElementsByClassName('.button').href = "#popup";
        // document.getElementsByClassName('.overlay').visibility = "visible";
        document.getElementById("review_form").reset();
        resetRatingStars();
        alert("Your review has been submitted!");
    }
};

document.querySelector('#rate').onclick = async () => {
    name = document.querySelector('#name1').value;
    rating = document.querySelector('#rating').value;
    review_text = document.querySelector('#review').value;
    recommend = document.querySelector('.recommend').value;
    product_url = document.querySelector('#modal_overall').getAttribute("product_url");
    email = document.querySelector('#email').value;
    console.log(document.querySelector('#modal_overall'));
    // product_url = product.product_url
    let product_info = {
        "name": name,
        "rating": rating,
        "review_text": review_text,
        "recommend": recommend,
        "product_url": product_url,
        "email": email
    };
    var correct = validateForm(product_info);
    if (correct == true) {
        console.log(product_info);
        send_to_db(product_info);
        // document.getElementsByClassName('.button').href = "#popup";
        // document.getElementsByClassName('.overlay').visibility = "visible";
        document.getElementById("review_form").reset();
        resetRatingStars();
        window.alert("Your review has been submitted!");
    }
};

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
    } else if (recommend == "None") {
        alert("Must choose whether to recommend");
        return false;
    }
    return true;
};



var current_star_statusses = [];

star_elements = $('.fa-star');

star_elements.each(function (i, elem) {
    current_star_statusses.push($(elem).hasClass('yellow'));
});

// star_elements.click(changeRatingStars);
// star_elements.mouseleave(resetRatingStars);


document.querySelector('#star1').onclick = async () => {
    document.querySelector('#rating').value = 1;
}

document.querySelector('#star2').onclick = async () => {
    document.querySelector('#rating').value = 2;
}

document.querySelector('#star3').onclick = async () => {
    document.querySelector('#rating').value = 3;
}

document.querySelector('#star4').onclick = async () => {
    document.querySelector('#rating').value = 4;
}

document.querySelector('#star5').onclick = async () => {
    document.querySelector('#rating').value = 5;
}

star_elements.click(changeRatingStars);

document.querySelector("#home-button").onclick = open_search_page;

document.querySelector('#yes').onclick = async () => {
    recommend = document.querySelector('.recommend').value = 'Yes';
}

document.querySelector('#no').onclick = async () => {
    recommend = document.querySelector('.recommend').value = 'No';
}

star_elements.click(changeRatingStars);




// login:
//  username and password required for login
// signup:
//  username, password, and name required for sign up
//
// package the info into a json object like:
// profile = {
//     "username": "",
//     "name": "",
//     "password": ""
// }
// 
// and then pass the json object as an argument to login() or signup()
// logout() will reset USER_INFO
//
// The login/sign up button is hard coded to login to "jackson", and changes the onclick function to be signout. This should instead open a popup that allows you to login or sign up.
// The Make an new user button is hard coded to create the same new user everytime. This should be removed and signing up should be in the popup
// login() also changes the shopping cart button text and makes it open the shopping list page