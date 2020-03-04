const searchHTMLbody = `
<header id="header" class="header">
<div id="name_div">
  <a id="home-button">
    <h1 id="name">Buy Better</h1>
  </a>
</div>
<div class="wrap">
  <div class="search"></div>
  <input id="search-terms" class="search-terms" type="text" placeholder="Enter a search term">
  <select name="sortby" id="sortby" class="select-css">
    <option value="rating">Rating</option>
    <option value="relevance">Relevance</option>
  </select>
  <button type="submit" class="go" id="go">
    <!-- <Icon type="search" theme="filled"/> -->
    <i class="fas fa-search"></i>
  </button>
  
</div>
</div>
</header>



<section id="product-section">
<div id="navigation">

</div>
     <h1 id="results"> Searching... </h1>
     <section id="products">

       </section>
  
</section>
<p data-boi="hello">
</p>

<!-- The Modal -->
<div id="myModal" class="modal">

<!-- Modal content -->
<div class="modal-content">
  <span class="close">&times;</span>
  <div class="modal-body"></div>
  <div class="reviews">
    <h1>Reviews</h1>
    <div class="prev_reviews">
      <section class="review-card"></section>
    </div>
    <form class="review_form" id="review_form">
      <label for="name1" >Name</label><br>
      <input type="text" id="name1" name="name1" placeholder="Enter your name" required/><br>
      <label for="email">Email</label><br>
      <input type="email" id="email" name="email" placeholder="Enter your email" required /><br>
      <label for="rating">Rating</label><br>
      <!-- <input type="text" id="rating" name="rating" placeholder="0"><br> -->
      <ul class="list-inline rating-list" id="rating" name="rating" required />
      <li><i class="fa fa-star gray" id="star1"></i></li>
      <li><i class="fa fa-star gray" id="star2"></i></li>
      <li><i class="fa fa-star gray" id="star3"></i></li>
      <li><i class="fa fa-star gray" id="star4"></i></li>
      <li><i class="fa fa-star gray" id="star5"></i></li>
      </ul>
      <label for="review_text">Write a review</label><br>
      <input type="text" id="review" name="review" placeholder="Write a review" required /><br><br>
      <label for="recommend">Would you recommend this product?</label>
      <input type="radio" id="recommend" name="recommend" value="Yes">
      <label for="recommend">Yes</label><br>
      <input type="radio" id="no" name="no" value="No">
      <label for="no">No</label><br>
    </form>
    <a class="button" href="#popup">
      <button type="submit" class="rate" id="rate">Submit</button>
    </a>
    <div id="popup" class="overlay">
      <div class="popup">
        <a class="close" href="#">&times;</a>
        <div class="content">
          Your review has been submitted!
        </div>
      </div>
    </div>
    <!-- <div class="stars-outer">
      <div class="stars-inner"></div>
    </div> -->
    <!-- <div class="stars"data-rating="0">
      <a class="star off" title="did not like it" href="#" ref="bm_rtg_st1_bsh">1 of 5 stars</a>
      <a class="star off" title="it was ok" href="#" ref="bm_rtg_st2_bsh">2 of 5 stars</a>
      <a class="star off" title="liked it" href="#" ref="bm_rtg_st3_bsh">3 of 5 stars</a>
      <a class="star off" title="really liked it" href="#" ref="bm_rtg_st4_bsh">4 of 5 stars</a>
      <a class="star off" title="it was amazing" href="#" ref="bm_rtg_st5_bsh">5 of 5 stars</a>
    </div> -->
    <!-- <ul class="list-inline rating-list">
      <li><i class="fa fa-star gray"></i></li>
      <li><i class="fa fa-star gray"></i></li>
      <li><i class="fa fa-star gray"></i></li>
      <li><i class="fa fa-star gray"></i></li>
      <li><i class="fa fa-star gray"></i></li>
  </ul> -->
  </div>
  <button type="submit" class="add" id="add_to_shopping_list">Add to Shopping List</button>
</div>
</div>
`
let USER_INFO = {
    "username": "",
    "objectId": "",
    "shoppinglistlist": [],
    "shoppinglist": "[]"
};

const open_search_page = () => {
    console.log("asdf");
    document.querySelector("body").innerHTML = searchHTMLbody;

    let css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "css/style.css";
    document.querySelector("head").appendChild(css);
    let jqueryscript = document.createElement("script");
    jqueryscript.charset = "utf-8";
    jqueryscript.src = "https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.4.1.min.js";
    document.querySelector("body").appendChild(jqueryscript);

    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "./js/db.js";
    document.querySelector("body").appendChild(script);

    let fontawesome = document.createElement("script");
    fontawesome.type = "text/javascript";
    fontawesome.src = "https://kit.fontawesome.com/62a7c74d0d.js";
    document.querySelector("body").appendChild(fontawesome);
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
document.querySelector("#sign-in").onclick = () => {
    get_user_info_from_username("jacksonschuster2021@u.northwestern.edu");
    // make_user("newUserUntilThisIsExecutedOnce");
}

document.querySelector("#home-search-button").onclick = open_search_page;
}