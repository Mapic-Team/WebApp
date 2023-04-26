import * as pdb from '../pouchDB.js';

console.log(pdb.readPicture("lgx06aqo284bcff6x"));
let pictures = pdb.dumpPictures();

const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

console.log(pictures);

searchInput.addEventListener("input", search());

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
                const tagBody = card.querySelector("[data-tag-body]")
                tagBody.textContent = t;
                searchResults.append(tag);
            }
        })
    })
}

for(let i = 0; i < lines.length; i++) {
    const r = document.createElement('p');
    r.textContent = lines[i];
    resultsLoad.appendChild(r);
}

const imageScroll = document.getElementById('image-scroll-bar');
for(let i = 0; i < 10; i++) {
    const img = document.createElement('div');
    img.className = ('image-container');

    const pic = document.createElement('img');
    pic["src"] = i % 2 === 0 ? './sample_image.jpg' : './sample_image_2.jpg';
    pic.className = 'pic';

    const comment = document.createElement('p');
    comment.textContent = 'Comment';
    comment.className = 'comment';

    const description = document.createElement('p');
    description.textContent = 'Description';
    description.className = 'description';
    function toggle() {
        let opened = false;
        const popup = document.createElement('div');
        popup.className = ('popup')
        popup.innerHTML = '<p> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>';
        function open() {
            if(!opened) {
                description.appendChild(popup);
                opened = true;
            } else {
                description.removeChild(popup);  
                opened = false;
            } 
        }
        return open;    
    }
    description.addEventListener('click', toggle());

    const like = document.createElement('p');
    like.textContent = 'LIKE'
    like.className = 'like'

    const author = document.createElement('p');
    author.textContent = 'Iris Xia'
    author.className = 'author'

    img.appendChild(pic);
    img.appendChild(comment);
    img.appendChild(like);
    img.appendChild(description);
    img.appendChild(author);
    imageScroll.appendChild(img);
}
