document.querySelector("#home-search-button").onclick = open_search_page;
document.querySelector("#home-button").onclick = open_search_page;

document.querySelector("#login-button").onclick = async (event) => {
    let username = document.querySelector("#login-username").value;
    if (await get_user_info_from_username(username)) {
        open_home_page();
    }
}
document.querySelector('#login-username').onkeypress = async (event) => {
    enter_pressed = search_on_enter(event); //determine if enter was the key pressed
    if (enter_pressed) { // if so, get products and load them
        let username = document.querySelector("#login-username").value;
        if (await get_user_info_from_username(username)) {
            open_home_page();
        }
    };
};
document.querySelector("#signup-button").onclick = async (event) => {
    let username = document.querySelector("#signup-username").value;
    if (await make_user(username)) {
        open_home_page();
    }
}
document.querySelector('#signup-username').onkeypress = async (event) => {
    enter_pressed = search_on_enter(event); //determine if enter was the key pressed
    if (enter_pressed) { // if so, get products and load them
        console.log("about to make user");
        let username = document.querySelector("#signup-username").value;
        // console.log(await make_user(username));
        if (await make_user(username)) {
            console.log("user is made");
            open_home_page();
        }
        console.log("returned not true");
    };
};