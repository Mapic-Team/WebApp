import { mapicCrud } from "../CRUD.js";

const searchResults = document.getElementById("search-results");
const searchInput = document.getElementById("search-input");
const trendResults = document.getElementById("trend-results");
const imageScrollBar = document.getElementById("image-scroll-bar");
const imgResults = document.getElementById("img-results");

window.addEventListener("load", displayTopTags);
searchInput.addEventListener("change", search);
window.addEventListener("load", showTrends);
window.addEventListener("load", fillImageScrollBar);
imageScrollBar.addEventListener("scroll", displayPics);

/**
 * displays up to ten most common tags when nothing is searched.
 * @returns {Promise<void>}
 */
async function displayTopTags() {
  const result = await mapicCrud.getTenMostCommonTags();
  const topTenTags = result.data;
  const regex = /^\s*$/;
  topTenTags.forEach((t) => {
    if (!regex.test(t)) {
      loadOneTag(t);
    }
  });
}

/**
 * Does not have an input param, gets the string directly from the searchInput element
 * case sensitive matching
 * @return {Promise<void>}
 */
async function search() {
  const v = searchInput.value;
  const regex = /^\s*$/;
  searchResults.innerHTML = "";
  if (!regex.test(v) && v !== null) {
    const result = await mapicCrud.matchTags(v);
    const topTenTags = result.data;
    if (topTenTags) {
      topTenTags.forEach((t) => {
        if (!regex.test(t)) {
          loadOneTag(t);
        }
      });
    }
  } else {
    displayTopTags();
  }
}

async function loadOneTag(t) {
  const tagTemplate = document.querySelector("[data-tag-template]");
  const tag = tagTemplate.content.cloneNode(true).children[0];
  const tagBody = tag.querySelector("[data-tag-body]");
  tagBody.textContent = t;
  tagBody.addEventListener("click", () => reloadByTag(t));
  searchResults.append(tag);
}

async function reloadByTag(t) {
  const result = await mapicCrud.getPictureByTag(t);
  if (result.success) {
    imgResults.innerHTML = "";
    for (const picture of result.data) {
      loadOnePic(picture);
    }
  }
}

async function showTrends() {
  const trendTemplate = document.querySelector("[data-trend-template]");
  const result = await mapicCrud.getTrending();
  const pictures = result.data;
  pictures.forEach((pic) => {
    const trendImg = trendTemplate.content.cloneNode(true).children[0];
    trendImg.src = pic.picBase64;
    trendImg.alt = pic._id;
    trendResults.append(trendImg);
  });
}

async function fillImageScrollBar() {
  const template = document.querySelector("[data-img-template]");

  for (let i = 0; i < 10; i++) {
    const result = await mapicCrud.readOnePicture();

    if (result.success) {
      loadOnePic(result.data);
    }
  }
}

async function displayPics() {
  const scrollPosition = imageScrollBar.scrollTop;
  const scrollHeight = imageScrollBar.scrollHeight;
  const clientHeight = imageScrollBar.clientHeight;

  if (scrollPosition >= scrollHeight - clientHeight - 905) {
    // User has scrolled to the bottom or beyond
    const result = await mapicCrud.readOnePicture();

    if (result.success) {
      // Picture data is available
      loadOnePic(result.data);
    }
  }
}

async function loadOnePic(picture) {
  const line_break = document.createElement("br");

  const template = document.querySelector("[data-img-template]");

  const imageElement = template.content.querySelector("[data-img-pic]");
  const descriptionElement = template.content.querySelector(
    "[data-img-description]"
  );
  const likeButton = template.content.querySelector("[data-img-like]");
  const commentButton = template.content.querySelector("[data-img-comment]");
  const tagsElement = template.content.querySelector("[data-img-tags]");
  const ownerElement = template.content.querySelector("[data-img-owner]");
  const timeElement = template.content.querySelector("[data-img-time]");

  imageElement.src = picture.picBase64;
  imageElement.alt = picture._id;
  descriptionElement.textContent =
    picture.description === ""
      ? `${picture.ownerName} Shares a Photo`
      : picture.description;
  likeButton.textContent = picture.like;
  tagsElement.textContent = "Tags: ";

  if (picture.tags.length !== 0) {
    picture.tags.map((tag) => {
      let tagButton = document.createElement("button");
      tagButton.classList.add("tag-in-post");
      tagButton.textContent += tag;
      tagsElement.appendChild(tagButton);
    });
  } else {
    tagsElement.textContent += ` ${picture.ownerName} has not added any tags yet. :-(`;
  }
  ownerElement.textContent = picture.ownerName;
  const date = new Date(picture.createdTime);
  timeElement.textContent = date.toDateString();
  commentButton.textContent = "COMMENT";
  imgResults.addEventListener("click", async function (event) {
    if (event.target.matches("[data-img-like]")) {
      console.log(event.target);
      await mapicCrud.changeLikeBy(event.target.picId, picture.like + 1); //need to fix
      event.target.textContent = picture.like + 1;
    }
  });
  imgResults.addEventListener("click", async function (event) {
    if (event.target.matches("[data-img-comment]")) {
      console.log(event.target);
      await mapicCrud.addComment(picture._id); //need to fix
    }
  });

  // Append the cloned template to the imageScrollBar
  imgResults.appendChild(line_break);
  imgResults.appendChild(template.content.cloneNode(true));
  imgResults.appendChild(line_break);
}
