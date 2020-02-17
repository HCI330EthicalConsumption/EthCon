// let fetch = require('node-fetch');
const get = async (url) => {
    console.log(url);
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    // const proxyurl = "https://localhost:8080/";
    console.log(proxyurl + url);
    let data = await fetch(proxyurl + url);
    return data;
}
// takes in keywords to search for and returns a list of product json objects. Returns up to 21 products.
// MUST USE THE KEYWORD "await" WHEN CALLING OR IT WILL RETURN A Promise OBJECT WHICH I CAN'T FIND A USE FOR
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
    const url = "https://www.goodguide.com/catalog/search.json?filter=" + keywords + "&sort=" + sort_term + "&page=" + pagenum;

    const resp = await get(url);
    console.log(resp);
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

document.querySelector('#go').onclick = async () => {
    console.log(document.getElementById("search-terms").value);
    sortby = document.getElementById("sortby").value;
    console.log(sortby);
    search_terms = document.getElementById("search-terms").value
    data = await search_gg(search_terms, sortby, 1);
    // data = await search_wal(search_terms);
    console.log(JSON.stringify(data));
    document.getElementById("place").innerHTML += JSON.stringify(data);
};