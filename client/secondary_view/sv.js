import { mapicCrud } from "../CRUD.js";



const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

// searchInput.addEventListener("input", search());
// window.addEventListener('load', displayPics);
// window.addEventListener('load', showTrends);
window.addEventListener('load', displayTopTags);

async function displayTopTags() {
    const tagTemplate = document.querySelector("[data-tag-template]")
    const result = await mapicCrud.getTenMostCommonTags();
    const topTenTags = result.data;
    topTenTags.forEach(t => {
        const tag = tagTemplate.content.cloneNode(true).children[0]
        const tagBody = tag.querySelector("[data-tag-body]")
        tagBody.textContent = t;
        searchResults.append(tag);
    })
}

// /**
//  * Does not have an input param, gets the string directly from the searchInput element
//  * @return {void}
//  */
// async function search() {
//     const tagTemplate = document.querySelector("[data-tag-template]");
// }

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

// function showTrends() {
//     const trendTemplate = document.querySelector("[data-trend-template]")
//     let counter = 0;
//     pictures.forEach(doc => {
//         if(counter > 5) {
//             return;
//         }
//         if(doc.like >= 10) {
//             const trend = trendTemplate.content.cloneNode(true).children[0]
//             const trendImg = tag.getElementByClass('trending-img');
//             trendImg.src = doc.picBase64;
//             searchResults.append(trend);
//         }
//     })
// }
