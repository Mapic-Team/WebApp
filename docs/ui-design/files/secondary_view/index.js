
const resultsLoad = document.getElementById('results-load');
const lines = ['National Parker', 'National Barker', 'National Parade'];
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
    comment.textContent = 'Comment'
    comment.className = 'comment'
    const like = document.createElement('p');
    like.textContent = 'LIKE'
    like.className = 'like'
    const author = document.createElement('p');
    author.textContent = 'Iris Xia'
    author.className = 'author'
    img.appendChild(pic);
    img.appendChild(comment);
    img.appendChild(like);
    img.appendChild(author);
    imageScroll.appendChild(img);
}
