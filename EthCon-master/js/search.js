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

var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
span.onclick = function () {
    modal.style.display = "none";
};

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

document.querySelector("#add_to_shopping_list").onclick = add_to_shopping_list;

document.querySelector('#rate').onclick = async () => {
    name = document.querySelector('#name1').value;
    rating = document.querySelector('#rating').value;
    review_text = document.querySelector('#review').value;
    recommend = document.querySelector('#recommend').value;
    product_url = document.querySelector('#modal_overall').getAttribute("product_url");
    console.log(document.querySelector('#modal_overall'));
    // product_url = product.product_url
    let product_info = {
        "name": name,
        "rating": rating,
        "review_text": review_text,
        "recommend": recommend,
        "product_url": product_url
    };
    console.log(product_info);
    send_to_db(product_info);
    document.getElementById("review_form").reset();
    resetRatingStars();
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

document.querySelector("#home-button").onclick = open_home_page;