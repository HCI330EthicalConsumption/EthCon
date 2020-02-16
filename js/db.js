// var fetch = require('node-fetch');
const get = async (url) => {
    console.log(url);
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    let data = await fetch(proxyurl + url);
    console.log(data);
    return data;
}

const search = async (keywords) => {
    let url = "https://www.goodguide.com/catalog/search.json?filter=" + keywords;
    let resp = await get(url);
    console.log(resp);
    let data = await resp.json();
    console.log(data);
    return data.products;
}

document.querySelector('#go').onclick = async () => {
    console.log(document.getElementById("search-terms").value)
    data = await search(document.getElementById("search-terms").value);
    console.log(data);
    document.getElementById("place").innerHTML += JSON.stringify(data);
};