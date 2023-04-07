    // initialize the map on the "map" div with a given center and zoom
// var map = L.map('map', {
//     center: [51.505, -0.09],
//     zoom: 13,
//     zoomControl: false
// });
var map = L.map('map', {
    zoom: 13,
    zoomControl: false,
    closePopupOnClick: false
}).setView([42.3635899, -72.5362909], 13);

// map.panTo([51.505, -0.09], 1);


L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var latlng = [42.3635899, -72.5362909];

// L.control.zoom({animate: true}).addTo(map);

var image2 = L.popup([42.3635899, -72.5362909], {autoPan: false, autoClose: false, closeButton: false})
// .setLatLng()
// .setContent('<img src="/images/1.jpeg" style="width: 300px height: 100%"/>')
.setContent('<div class="photo"><img src="/images/2.jpeg" id="2" style="width: inherit;"/></div>')
.openOn(map);

var image3 = L.popup([42.388361, -72.531052], {autoPan: false, autoClose: false, closeButton: false})
// .setLatLng()
// .setContent('<img src="/images/1.jpeg" style="width: 300px height: 100%"/>')
.setContent('<div class="photo"><img src="/images/3.jpeg" id="3" style="width: inherit;"/></div>')
.openOn(map);

var image4 = L.popup([42.519944, -72.294846], {autoPan: false, autoClose: false, closeButton: false})
// .setLatLng()
// .setContent('<img src="/images/1.jpeg" style="width: 300px height: 100%"/>')
.setContent('<div class="photo"><img src="/images/4.jpeg" id="4" style="width: inherit;"/></div>')
.openOn(map);

// var tooltip = L.tooltip()
// .setLatLng([51.513, -0.09])
// .setContent('Hello world!<br />This is a nice tooltip.')
// .addTo(map);


// var popup = L.popup();

// function onMapClick(e) {
//     // tooltip
//     popup
//         .setLatLng(e.latlng)
//         .setContent("You clicked the map at " + e.latlng.toString())
//         .openOn(map);
// }

// map.on('click', onMapClick);

if (navigator.geolocation) {
    var location = navigator.geolocation.getCurrentPosition(getPosition);

} else {
    console.log("Your browser is not support location feature")
}

// console.log(image2.getLatLng().lat);
let photo = document.getElementsByClassName("photo");
photo[0].addEventListener("click", () => {clickPhoto(image2)});
photo[1].addEventListener("click", () => {clickPhoto(image3)});
photo[2].addEventListener("click", () => {clickPhoto(image4)});



var toolTip;
var description = "Consequuntur reiciendis illo non suscipit necessitatibus dolores doloribus sed atque. Quos rem excepturi ut eum et eaque facere et. Illo quos voluptatem ratione sint numquam dolor assumenda. Ea et et sapiente distinctio et aut aspernatur necessitatibus est. Est velit debitis enim "
//  'Esse et et quos animi animi. Quibusdam et porro et praesentium maiores dolores facilis.' +
//  'Voluptas molestias sapiente aperiam culpa. Et doloribus maiores omnis quisquam dolores.' +
// 'Esse est et ut rem et praesentium quibusdam eaque. Aut consectetur illum placeat repellendus nam.' +
//  'Exercitationem dolorem tempora.';

function clickPhoto(image) {
    let latlng = image.getLatLng();
    // console.log(image.getContent());
    let imageName = image.getContent().split(" ")[2].split("/")[2].split('"')[0];
    // console.log(imageName);
    let photoDiv = document.createElement("div");
    photoDiv.setAttribute("id", "photo-div");
    let closeButton = document.createElement("button");
    closeButton.setAttribute("id", "close-button");
    closeButton.textContent = "X";
    let img = document.createElement("img");
    img.setAttribute("src", "/images/"+imageName);
    img.setAttribute("style", "width:inherit");
    let descriptionPara = document.createElement("div");
    descriptionPara.setAttribute("id", "description");
    descriptionPara.textContent = description;
    let commentDiv = document.createElement("div");
    commentDiv.setAttribute("id", "comment-div");
    let commentInput = document.createElement("input");
    commentInput.setAttribute("id", "comment");
    commentInput.setAttribute("type", "text");
    commentInput.setAttribute("placeholder", "Write a comment...");
    commentInput.setAttribute("style", "border-radius: 10px")
    let commentButton = document.createElement("button");
    commentButton.setAttribute("id", "comment-button");
    commentButton.textContent = "Send";
    commentButton.setAttribute("style", "border-radius: 10px")
    commentDiv.appendChild(commentInput);
    commentDiv.appendChild(commentButton);
    photoDiv.appendChild(closeButton);
    photoDiv.appendChild(img);
    photoDiv.appendChild(descriptionPara);
    photoDiv.appendChild(commentDiv);

    if(toolTip == undefined) {
    toolTip = L.tooltip([latlng.lat, latlng.lng],{direction: 'top', opacity:1, interactive: true, permanent: true})
    .setContent(photoDiv)
    // .setContent('<div id="photo-div"><button id="close-button">&#215</button><img src="/images/2.jpeg" style="width:inherit"/>' +
    // '<div id="description"></div><div id="comment-div"><input id="comment" type="text"/><button id="comment-button">Send</button></div></div>')
    // .setContent('<div class="photo"><img src="/images/2.jpeg" style="width: inherit;"/></div>')
    .addTo(map);
    // let descriptionPara = document.getElementById("description");
    // descriptionPara.textContent = description;
    } else {
        toolTip.openOn(map);
        // let descriptionPara = document.getElementById("description");
        // descriptionPara.textContent = description;
    }
    let closeBtn = document.getElementById("close-button");
    closeBtn.addEventListener("click", closeTooltip);

    function closeTooltip() {
        toolTip.close();
        toolTip = undefined;
        // alert("close");
    }
}


function toCurrentlocation(position) {
    let lat = position.coords.latitude;
    let long = position.coords.longitude; 
    let accuracy = position.coords.accuracy;
    map.panTo([lat, long]);
}



function getPosition(position) {
    let lat = position.coords.latitude;
    let long = position.coords.longitude; 
    let accuracy = position.coords.accuracy;

    let marker = L.marker([lat, long])
    let circle = L.circle([lat, long],accuracy);
    // L.map('map').setView([lat, long], 1)
    L.control.locate({
        position: "bottomleft",
        // strings: {
        //   title: "Show me where I am, yo!"
        // }
    }).addTo(map);
    // map.panTo([lat, long]);
    // console.log("Your position is: Lat: " + lat + " Long : " + long + " Accuracy: " + accuracy + ".");
}
