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
    const imageScrollBar = document.getElementById('image-scroll-bar');
    const template = document.querySelector('[data-img-template]');
  
    for (let i = 0; i < 10; i++) {
      const picture = await mapicCrud.readOnePicture();
  
      if (picture.success) {
        const imageElement = template.content.querySelector('[data-img-pic]');
        const descriptionElement = template.content.querySelector('[data-img-description]');
  
        imageElement.src = picture.data.picBase64;
        imageElement.alt = picture.data._id;
        descriptionElement.textContent = picture.data.description;
  
        imageScrollBar.appendChild(template.content.cloneNode(true));
      }
    }
  }

async function displayPics() {
    console.log('eneterd function')
    const scrollPosition = imageScrollBar.scrollTop;
    const scrollHeight = imageScrollBar.scrollHeight;
    const clientHeight = imageScrollBar.clientHeight;
    
    console.log(`scrollPosition: ${scrollPosition}, scrollHeight: ${scrollHeight}, clientHeight: ${clientHeight}`);
    if (scrollPosition >= scrollHeight - clientHeight - 905) {
      // User has scrolled to the bottom or beyond
      console.log(scrollPosition);
      const picture = await mapicCrud.readOnePicture();
  
      if (picture.success) {
        // Picture data is available
        const template = document.querySelector('[data-img-template]');
        const imageElement = template.content.querySelector('[data-img-pic]');
        const descriptionElement = template.content.querySelector('[data-img-description]');
  
        imageElement.src = picture.data.picBase64;
        imageElement.alt = picture.data._id;
        descriptionElement.textContent = picture.data.description;
  
        // Append the cloned template to the imageScrollBar
        imageScrollBar.appendChild(template.content.cloneNode(true));
      }
    }
}


