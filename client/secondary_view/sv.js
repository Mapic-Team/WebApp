import * as pdb from '../../server/pouchDB.js';

let pictures = pdb.dumpPictures();

const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

searchInput.addEventListener("input", search());
windows.addEventListener('load', displayPics);
windows.addEventListener('load', showTrends);

function search() {
    const tagTemplate = document.querySelector("[data-tag-template]")
    const v = searchInput.value;
    let counter = 0;
    pictures.forEach(doc => {
        doc.tags.forEach(t => {
            if(counter > 10) {
                return;
            }
            if(t.includes(v)) {
                const tag = tagTemplate.content.cloneNode(true).children[0]
                const tagBody = tag.querySelector("[data-tag-body]")
                tagBody.textContent = t;
                searchResults.append(tag);
            }
        })
    })
}

const imageScroll = document.getElementById('image-scroll-bar');

function displayPics() {
    const imgTemplate = document.querySelector("[data-img-template]");
    pictures.forEach(doc => {
        const imgDiv = imgTemplate.content.cloneNode(true).children[0];
        const pic = imgDiv.querySelector("[data-img-pic]");
        const description = imgDiv.querySelector("[data-img-description]");
        const like = imgDiv.querySelector("[data-img-like]");
        const comment = imgDiv.querySelector("[data-img-comment]");
        pic.src = doc.picBase64;
        pic.alt = doc.picId;
        description = doc.description;
        like = doc.like;
        comment = doc.comment;
        imageScroll.append(imgDiv);
    })
}

function showTrends() {
    const trendTemplate = document.querySelector("[data-trend-template]")
    let counter = 0;
    pictures.forEach(doc => {
        if(counter > 5) {
            return;
        }
        if(doc.like >= 10) {
            const trend = trendTemplate.content.cloneNode(true).children[0]
            const trendImg = tag.getElementByClass('trending-img');
            trendImg.src = doc.picBase64;
            searchResults.append(trend);
        }
    })
}
