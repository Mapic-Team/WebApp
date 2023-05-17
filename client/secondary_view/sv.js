import { mapicCrud } from "../CRUD.js";

const searchResults = document.getElementById('search-results');
const searchInput = document.getElementById('search-input');
const trendResults = document.getElementById('trend-results');
const imageScrollBar = document.getElementById('image-scroll-bar');

window.addEventListener('load', displayTopTags);
searchInput.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        search();
      }
});
window.addEventListener('load', showTrends);
window.addEventListener('load', fillImageScrollBar);
imageScrollBar.addEventListener('scroll', displayPics);

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
    pictures.forEach(pic => {
        const trendImg = trendTemplate.content.cloneNode(true).children[0];
        trendImg.src = pic.picBase64;
        trendImg.alt = pic._id;
        trendResults.append(trendImg);
    });
}

async function fillImageScrollBar() {
    const template = document.querySelector('[data-img-template]');
  
    for (let i = 0; i < 10; i++) {
      const picture = await mapicCrud.readOnePicture();
  
      if (picture.success) {
        loadOnePic(picture);
      }
    }
  }

async function displayPics() {
    const scrollPosition = imageScrollBar.scrollTop;
    const scrollHeight = imageScrollBar.scrollHeight;
    const clientHeight = imageScrollBar.clientHeight;
    
    if (scrollPosition >= scrollHeight - clientHeight - 905) {
      // User has scrolled to the bottom or beyond
      const picture = await mapicCrud.readOnePicture();
  
      if (picture.success) {
        // Picture data is available
        loadOnePic(picture);
      }
    }
}

async function loadOnePic(picture) {
  const template = document.querySelector('[data-img-template]');
        const imageElement = template.content.querySelector('[data-img-pic]');
        const descriptionElement = template.content.querySelector('[data-img-description]');
        const likeButton = template.content.querySelector('[data-img-like]');
        const commentButton = template.content.querySelector('[data-img-comment]');
        const tagsElement = template.content.querySelector('[data-img-tags]');
        const ownerElement = template.content.querySelector('[data-img-owner]');
        const timeElement = template.content.querySelector('[data-img-time]');

        console.log(picture.data);
  
        imageElement.src = picture.data.picBase64;
        imageElement.alt = picture.data._id;
        descriptionElement.textContent = picture.data.description;
        likeButton.textContent = picture.data.like;
        tagsElement.textContent = picture.data.tags;
        ownerElement.textContent = picture.data.ownerName;
        const date = new Date(picture.data.createdTime);
        timeElement.textContent = date.toDateString();
        commentButton.textContent = "COMMENT";
  
        // Append the cloned template to the imageScrollBar
        imageScrollBar.appendChild(template.content.cloneNode(true));
}

