const get = async (url) => {
    console.log(url);
    // const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const proxyurl = "https://jtschuster1.azurewebsites.net/"; // Web app that gives us unlimited requests
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
    const url = "www.goodguide.com/catalog/search.json?filter=" + keywords + "&sort=" + sort_term + "&page=" + pagenum;

    const resp = await get(url);
    //console.log(resp);
    let data = await resp.json();
    console.log(data);
    // load_results(data.products);
    return data.products;
}
//Not useable yet
const search_wal = async (keywords) => {
    // const url = "https://www.walmart.com/search/?query=" + keywords;
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

const get_products = async () => {
    console.log(document.getElementById("search-terms").value);
    sortby = document.getElementById("sortby").value;
    console.log(sortby);
    search_terms = document.getElementById("search-terms").value
    data = await search_gg(search_terms, sortby, 1);
    // data = await search_wal(search_terms);
    // load_results(data);
    return data;
};

// Used as keypress event listener, determines whether the enter key was pressed in event
//  returns true if enter was pressed, else false.
const search_on_enter = (event) => {
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
        const template = `<section class="product-card" id="${product.id}">
          <div class="left">
              <img src="${product.image}">
          </div>
          <div class ="right">
              <h4>${product.name}</h4>
              <h4>Brand: ${product.brand.name}</h4>
              <h4>Rating: ${product.rating}</h4>
          </div>
      </section>`
        document.querySelector('#products').innerHTML += template;
    };
};

document.querySelector('#go').onclick = () => {
    get_products()
        .then((products) => {
            load_results(products);
        });
    document.querySelectorAll("p[data-boi='hello'")[0].innerHTML = "world";


    let amazon_data = `<div data-asin="" data-index="1" class="sg-col-20-of-24 s-result-item sg-col-0-of-12 sg-col-28-of-32 sg-col-16-of-20 sg-col s-flex-geom sg-col-32-of-36 sg-col-12-of-16 sg-col-24-of-28" data-cel-widget="search_result_1"><div class="sg-col-inner"> <span cel_widget_id="SEARCH_RESULTS-VISUAL_NAVIGATION" class="celwidget slot=SEARCH_RESULTS template=VISUAL_NAVIGATION pd_rd_w=DVeFq widget=loom-desktop-inline-slot_sxwds-sbc pf_rd_p=6d81377b-6d6c-4363-ae02-8fa202ed7b50 pf_rd_r=FAVZ44MXGKC1JPDQDZP8 pd_rd_r=8d07903c-8728-4f7f-bc0e-5332217f701f pd_rd_wg=0vbLX widgetId=loom-desktop-inline-slot_sxwds-sbc index=1" data-cel-widget="SEARCH_RESULTS-VISUAL_NAVIGATION"> <div class="s-include-content-margin s-border-bottom s-border-top-overlap s-widget-padding-bottom"> <div class="sg-row"> <div class="sg-col-20-of-24 sg-col-28-of-32 sg-col-16-of-20 sg-col sg-col-32-of-36 sg-col-8-of-12 sg-col-12-of-16 sg-col-24-of-28"><div class="sg-col-inner"> <div class="a-section a-spacing-top-medium s-visual-card-navigation-desktop"> <div tabindex="0" class="s-visual-card-navigation-carousel-title-wrapper"> <div aria-label="Shop by category in shampoo" class="a-section a-spacing-base s-visual-card-navigation-carousel-title s-visual-card-navigation-line-clamp-2"> <h5 class="a-size-large a-color-base a-text-normal"> <span dir="auto">Shop by category</span> </h5> </div> </div> <span data-component-type="s-searchgrid-carousel" data-component-props="{&quot;name&quot;:&quot;loom-desktop-inline-slot_sxwds-sbc&quot;}" class="rush-component s-visual-card-navigation-carousel-wrapper" data-component-id="13"> <div data-a-carousel-options="{&quot;set_size&quot;:3,&quot;show_partial_next&quot;:true,&quot;name&quot;:&quot;loom-desktop-inline-slot_sxwds-sbc&quot;,&quot;circular&quot;:false,&quot;first_item_flush_left&quot;:true}" data-a-display-strategy="searchgrid" data-a-transition-strategy="s-carousel-searchgrid" data-a-ajax-strategy="none" data-a-class="desktop" class="a-begin a-carousel-container a-carousel-display-searchgrid a-carousel-transition-s-carousel-searchgrid s-searchgrid-carousel a-carousel-initialized"><input autocomplete="on" type="hidden" class="a-carousel-firstvisibleitem"> <div class="a-row a-carousel-controls a-carousel-row"><div class="a-carousel-row-inner"><div class="a-carousel-col a-carousel-center"><div class="a-carousel-viewport" id="anonCarousel4"><ol class="a-carousel" role="list" style="width: 741px;"><li class="a-carousel-card s-visual-card-navigation-carousel-card" role="listitem" aria-setsize="3" aria-posinset="1" aria-hidden="false" style="width: 185.25px;"> <div class="sg-col-3-of-12 sg-col-3-of-32 sg-col-3-of-20 sg-col-3-of-16 sg-col sg-col-3-of-36 sg-col-3-of-24 aok-align-center sg-col-3-of-28"><div class="sg-col-inner"> <div class="a-section s-visual-card-navigation-carousel-card-image aok-relative s-image-square-aspect"> <div class="a-section s-visual-card-navigation-carousel-card-image-overlay s-position-absolute-full-occupy s-visual-card-navigation-carousel-card-image-background-black"></div> <div class="a-section a-padding-small s-visual-card-navigation-carousel-card-image-inner s-position-absolute-full-occupy aok-block"> <div class="a-section s-visual-card-navigation-carousel-card-image-locator aok-relative"> <a class="a-link-normal" href="/s?k=shampoo&amp;nav_sdd=aps&amp;n=11057651&amp;ref=sxwds-sbc_c1&amp;pd_rd_w=DVeFq&amp;pf_rd_p=6d81377b-6d6c-4363-ae02-8fa202ed7b50&amp;pf_rd_r=FAVZ44MXGKC1JPDQDZP8&amp;pd_rd_r=8d07903c-8728-4f7f-bc0e-5332217f701f&amp;pd_rd_wg=0vbLX&amp;qid=1582051159"><img alt="Hair Shampoo" src="https://images-na.ssl-images-amazon.com/images/I/81F5Aj82JIL._UL256_AC_.jpg" class="s-image"></a> </div> </div> </div> <div class="a-section a-spacing-medium a-spacing-top-mini s-visual-card-navigation-carousel-card-title s-visual-card-navigation-line-clamp-2 aok-block"> <div class="a-row a-color-base"> <a class="a-size-base-plus a-link-normal s-no-hover" href="/s?k=shampoo&amp;nav_sdd=aps&amp;n=11057651&amp;ref=sxwds-sbc_c1&amp;pd_rd_w=DVeFq&amp;pf_rd_p=6d81377b-6d6c-4363-ae02-8fa202ed7b50&amp;pf_rd_r=FAVZ44MXGKC1JPDQDZP8&amp;pd_rd_r=8d07903c-8728-4f7f-bc0e-5332217f701f&amp;pd_rd_wg=0vbLX&amp;qid=1582051159"> Hair Shampoo </a> </div> </div> </div></div> </li><li class="a-carousel-card s-visual-card-navigation-carousel-card" role="listitem" aria-setsize="3" aria-posinset="2" aria-hidden="false" style="width: 185.25px;"> <div class="sg-col-3-of-12 sg-col-3-of-32 sg-col-3-of-20 sg-col-3-of-16 sg-col sg-col-3-of-36 sg-col-3-of-24 aok-align-center sg-col-3-of-28"><div class="sg-col-inner"> <div class="a-section s-visual-card-navigation-carousel-card-image aok-relative s-image-square-aspect"> <div class="a-section s-visual-card-navigation-carousel-card-image-overlay s-position-absolute-full-occupy s-visual-card-navigation-carousel-card-image-background-black"></div> <div class="a-section a-padding-small s-visual-card-navigation-carousel-card-image-inner s-position-absolute-full-occupy aok-block"> <div class="a-section s-visual-card-navigation-carousel-card-image-locator aok-relative"> <a class="a-link-normal" href="/s?k=shampoo&amp;nav_sdd=aps&amp;n=11057441&amp;ref=sxwds-sbc_c2&amp;pd_rd_w=DVeFq&amp;pf_rd_p=6d81377b-6d6c-4363-ae02-8fa202ed7b50&amp;pf_rd_r=FAVZ44MXGKC1JPDQDZP8&amp;pd_rd_r=8d07903c-8728-4f7f-bc0e-5332217f701f&amp;pd_rd_wg=0vbLX&amp;qid=1582051159"><img alt="Shampoo &amp; Conditioner Sets" src="https://images-na.ssl-images-amazon.com/images/I/81dK5eJyMbL._UL256_AC_.jpg" class="s-image"></a> </div> </div> </div> <div class="a-section a-spacing-medium a-spacing-top-mini s-visual-card-navigation-carousel-card-title s-visual-card-navigation-line-clamp-2 aok-block"> <div class="a-row a-color-base"> <a class="a-size-base-plus a-link-normal s-no-hover" href="/s?k=shampoo&amp;nav_sdd=aps&amp;n=11057441&amp;ref=sxwds-sbc_c2&amp;pd_rd_w=DVeFq&amp;pf_rd_p=6d81377b-6d6c-4363-ae02-8fa202ed7b50&amp;pf_rd_r=FAVZ44MXGKC1JPDQDZP8&amp;pd_rd_r=8d07903c-8728-4f7f-bc0e-5332217f701f&amp;pd_rd_wg=0vbLX&amp;qid=1582051159"> Shampoo &amp; Conditioner Sets </a> </div> </div> </div></div> </li><li class="a-carousel-card s-visual-card-navigation-carousel-card" role="listitem" aria-setsize="3" aria-posinset="3" aria-hidden="false" style="width: 185.25px;"> <div class="sg-col-3-of-12 sg-col-3-of-32 sg-col-3-of-20 sg-col-3-of-16 sg-col sg-col-3-of-36 sg-col-3-of-24 aok-align-center sg-col-3-of-28"><div class="sg-col-inner"> <div class="a-section s-visual-card-navigation-carousel-card-image aok-relative s-image-square-aspect"> <div class="a-section s-visual-card-navigation-carousel-card-image-overlay s-position-absolute-full-occupy s-visual-card-navigation-carousel-card-image-background-black"></div> <div class="a-section a-padding-small s-visual-card-navigation-carousel-card-image-inner s-position-absolute-full-occupy aok-block"> <div class="a-section s-visual-card-navigation-carousel-card-image-locator aok-relative"> <a class="a-link-normal" href="/s?k=shampoo&amp;nav_sdd=aps&amp;n=11057251&amp;ref=sxwds-sbc_c3&amp;pd_rd_w=DVeFq&amp;pf_rd_p=6d81377b-6d6c-4363-ae02-8fa202ed7b50&amp;pf_rd_r=FAVZ44MXGKC1JPDQDZP8&amp;pd_rd_r=8d07903c-8728-4f7f-bc0e-5332217f701f&amp;pd_rd_wg=0vbLX&amp;qid=1582051159"><img alt="Hair Conditioner, End of 'Shop by category ' list" src="https://images-na.ssl-images-amazon.com/images/I/81CKjVxG82L._UL256_AC_.jpg" class="s-image"></a> </div> </div> </div> <div class="a-section a-spacing-medium a-spacing-top-mini s-visual-card-navigation-carousel-card-title s-visual-card-navigation-line-clamp-2 aok-block"> <div class="a-row a-color-base"> <a class="a-size-base-plus a-link-normal s-no-hover" href="/s?k=shampoo&amp;nav_sdd=aps&amp;n=11057251&amp;ref=sxwds-sbc_c3&amp;pd_rd_w=DVeFq&amp;pf_rd_p=6d81377b-6d6c-4363-ae02-8fa202ed7b50&amp;pf_rd_r=FAVZ44MXGKC1JPDQDZP8&amp;pd_rd_r=8d07903c-8728-4f7f-bc0e-5332217f701f&amp;pd_rd_wg=0vbLX&amp;qid=1582051159"> Hair Conditioner </a> </div> </div> </div></div> </li></ol></div></div></div></div> <div class="a-row s-visual-card-navigation-carousel-buttons"> <a class="a-link-normal a-carousel-goto-prevpage s-carousel-button aok-hidden" href="#" aria-disabled="true"> <i class="a-icon a-icon-previous aok-align-center" role="img"></i> </a> <a aria-label="See more categories" class="a-link-normal a-carousel-goto-nextpage s-carousel-button aok-hidden" href="#" aria-disabled="false"> <i class="a-icon a-icon-next aok-align-center" role="img"></i> </a> </div> <span class="a-end aok-hidden"></span></div> </span> </div> </div></div> </div> </div> </span> </div></div>`;
    let htmlObj = document.createElement("div");
    htmlObj.innerHTML = amazon_data;
    htmlObj.querySelectorAll("div[data-index='1']");

    console.log(htmlObj.querySelectorAll("div[data-index='1']")[0].innerHTML);


};


document.querySelector('#search-terms').onkeypress = (event) => {
    enter_pressed = search_on_enter(event); //determine if enter was the key pressed
    if (enter_pressed) { // if so, get products and load them
        get_products()
            .then((products) => {
                load_results(products);
            });
    };
};