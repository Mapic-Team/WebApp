import { mapicCrud } from "../CRUD.js";

const searchResults = document.getElementById('search-results');
const searchInput = document.getElementById('search-input');
const trendResults = document.getElementById('trend-results');


// window.addEventListener('load', displayPics);
window.addEventListener('load', displayTopTags);
searchInput.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        search();
      }
});
window.addEventListener('load', showTrends);

/**
 * displays up to ten most common tags when nothing is searched.
 * @returns {Promise<void>}
 */
async function displayTopTags() {
    const tagTemplate = document.querySelector("[data-tag-template]")
    const result = await mapicCrud.getTenMostCommonTags();
    const topTenTags = result.data;
    topTenTags.forEach(t => {
        const tag = tagTemplate.content.cloneNode(true).children[0]
        const tagBody = tag.querySelector("[data-tag-body]")
        tagBody.textContent = t;
        searchResults.append(tag);
    });
}

/**
 * Does not have an input param, gets the string directly from the searchInput element
 * case sensitive matching
 * @return {Promise<void>}
 */
async function search() {
    const tagTemplate = document.querySelector("[data-tag-template]");
    const v = searchInput.value;
    searchResults.innerHTML = '';
    const result = await mapicCrud.matchTags(v);
    const topTenTags = result.data;
    if(topTenTags) {
        topTenTags.forEach(t => {
            const tag = tagTemplate.content.cloneNode(true).children[0]
            const tagBody = tag.querySelector("[data-tag-body]")
            tagBody.textContent = t;
            searchResults.append(tag);
        });
    }
}

async function showTrends() {
    const trendTemplate = document.querySelector("[data-trend-template]")
    const result = await mapicCrud.getTrending();
    const pictures = result.data;
    console.log(pictures);
    pictures.forEach(pic => {
        const trendImg = trendTemplate.content.cloneNode(true).children[0];
        trendImg.src = pic.picBase64;
        trendImg.alt = pic._id;
        console.log(trendResults);
        trendResults.append(trendImg);
    });
}

// const imageScroll = document.getElementById('image-scroll-bar');

// function displayPics() {
//     const imgTemplate = document.querySelector("[data-img-template]");
//     pictures.forEach(doc => {
//         const imgDiv = imgTemplate.content.cloneNode(true).children[0];
//         const pic = imgDiv.querySelector("[data-img-pic]");
//         const description = imgDiv.querySelector("[data-img-description]");
//         const like = imgDiv.querySelector("[data-img-like]");
//         const comment = imgDiv.querySelector("[data-img-comment]");
//         pic.src = doc.picBase64;
//         pic.alt = doc.picId;
//         description = doc.description;
//         like = doc.like;
//         comment = doc.comment;
//         imageScroll.append(imgDiv);
//     })
// }


