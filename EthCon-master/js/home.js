document.querySelector("#sign-in").onclick = () => {
    get_user_info_from_username("jacksonschuster2021@u.northwestern.edu");
    // make_user("newUserUntilThisIsExecutedOnce");
}

document.querySelector("#home-search-button").onclick = open_search_page;

document.getElementById('button').addEventListener("click", function() {
	document.querySelector('.bg-modal').style.display = "flex";
});

document.querySelector('.close').addEventListener("click", function() {
	document.querySelector('.bg-modal').style.display = "none";
});
