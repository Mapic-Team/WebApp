// initialize the map on the "map" div with a given center and zoom
// var map = L.map('map', {
//     center: [51.505, -0.09],
//     zoom: 13,
//     zoomControl: false
// });
// import * as db from '/server/database.js';

import { mapicCrud } from "../CRUD.js";

var amherst = [42.373034, -72.519632];

var map = L.map("map", {
  zoomControl: false,
  closePopupOnClick: false,
}).setView(amherst, 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  minZoom: 3,
  worldCopyJump: true,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// console.log(navigator.geolocation);

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(getPosition);
} else {
  // alert("Your browser is not support location feature");
  console.log("Your browser is not support location feature");
}
// var latlng = [42.3635899, -72.5362909];

// L.control.zoom({animate: true}).addTo(map);

// var inCopyWorld = false;

// map.on('moveend', function() {
//     var center = map.getCenter();
//     var wrappedCenter = map.wrapLatLng(center);
//     var nowInCopyWorld = !center.equals(wrappedCenter);

//     if (nowInCopyWorld !== inCopyWorld) {
//         inCopyWorld = nowInCopyWorld;

//         if (inCopyWorld) {
//             console.log("Moved to 'copy' world");
//         } else {
//             console.log("Moved back to 'original' world");
//         }
//     }
// });
// let totalDeltaLng = 0;
// let worldCounter = 0;

// map.on('move', function(e) {
//     const newCenter = map.getCenter();
//     const deltaLng = newCenter.lng - oldCenter.lng;

//     // Detect crossing the antimeridian
//     if (deltaLng > 180) {
//         totalDeltaLng -= 360 - deltaLng;
//     } else if (deltaLng < -180) {
//         totalDeltaLng += 360 + deltaLng;
//     } else {
//         totalDeltaLng += deltaLng;
//     }

//     const newWorldCounter = Math.floor((totalDeltaLng + 180) / 360);

//     if (newWorldCounter !== worldCounter) {
//         worldCounter = newWorldCounter;
//         if (worldCounter === 0) {
//             console.log('Moved back to "original" world');
//         } else {
//             console.log(`Moved to "copy" world ${worldCounter}`);
//         }
//     }

//     oldCenter = newCenter;
// });

// let oldCenter = map.getCenter();

// function updatePicturesInView() {

// }

function closeAllPictures() {
  map.eachLayer(function (layer) {
    if (layer instanceof L.Popup) {
      map.closePopup(layer);
    }
  });
}

// function currBounds() {
//     var bounds = map.getBounds();
//     var southWest = bounds.getSouthWest();
//     var northEast = bounds.getNorthEast();

//     console.log("Southwest corner: ", southWest);
// console.log("Northeast corner: ", northEast);
//     // return {southWest: southWest, northEast: northEast};
// }

// map.on('moveend', function() {
//     currBounds();
//     console.log("--------------------")
// });

// var bounds = map.getBounds();
// var southWest = bounds.getSouthWest();
// var northEast = bounds.getNorthEast();

// console.log("Southwest corner: ", southWest);
// console.log("Northeast corner: ", northEast);

// var currentZoomLevel = map.getZoom();

// map.on('zoomend', function() {
//     var newZoomLevel = map.getZoom();
//     if (newZoomLevel > currentZoomLevel) {
//         // The map has been zoomed in
//         console.log('Map has been zoomed in to level ' + newZoomLevel);
//     } else if (newZoomLevel < currentZoomLevel) {
//         // The map has been zoomed out
//         console.log('Map has been zoomed out to level ' + newZoomLevel);
//     }
//     currentZoomLevel = newZoomLevel;
// });

// var image2 = L.popup([42.3635899, -72.5362909], {autoPan: false, autoClose: false, closeButton: false})
// // .setLatLng()
// // .setContent('<img src="/images/1.jpeg" style="width: 300px height: 100%"/>')
// .setContent('<div class="photo"><img src="../Mapic/images/2.jpeg" id="2" style="width: inherit;"/></div>')
// .openOn(map);

// var image3 = L.popup([42.388361, -72.531052], {autoPan: false, autoClose: false, closeButton: false})
// // .setLatLng()
// // .setContent('<img src="/images/1.jpeg" style="width: 300px height: 100%"/>')
// .setContent('<div class="photo"><img src="../Mapic/images/3.jpeg" id="3" style="width: inherit;"/></div>')
// .openOn(map);

// var image4 = L.popup([42.519944, -72.294846], {autoPan: false, autoClose: false, closeButton: false})
// // .setLatLng()
// // .setContent('<img src="/images/1.jpeg" style="width: 300px height: 100%"/>')
// .setContent('<div class="photo"><img src="../Mapic/images/4.jpeg" id="4" style="width: inherit;"/></div>')
// .openOn(map);

// var tooltip = L.tooltip()
// .setLatLng([51.513, -0.09])
// .setContent('Hello world!<br />This is a nice tooltip.')
// .addTo(map);

// var popup = L.popup();

// function onMapClick(e) {
//     // popup
//     //     .setLatLng(e.latlng)
//     //     .setContent("You clicked the map at " + e.latlng.toString())
//     //     .openOn(map);
//     return e.latlng;
// }
// closeAllPictures();
// fetch('http://localhost:3000/readPicture?picId=lhprjr1813macmaha', {
//     method: 'GET',
//     headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//         }
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log(data);
//         addPictureOnMap(data.data);
//     }
// );

// fetch('http://localhost:3000/readAllPictures', {
//     method: 'GET',
//     headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//         }
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log(data.data);
//         // for (let i = 0; i < 2; i++) {
//         //     addPictureOnMap(data.data[i]);
//         // }
//         for (let curr of data.data) {
//             addPictureOnMap(curr);
//         }
// console.log(imageCount);
//     }
// );
mapicCrud.readAllPictures().then((res) => {
  console.log(res.data);
  for (let curr of res.data) {
    addPictureOnMap(curr);
  }
});

// }

// map.on('click', onMapClick);

var imageCount = 0;

function addPictureOnMap(data) {
  let base64 = data.picBase64;
  let lat = data.exif.location.lat;
  let lng = data.exif.location.lng;
  let description = data.description;
  let ownerName = data.ownerName;
  let tags = data.tags;
  let time = data.createdTime;
  var image = L.popup([lat, lng], {
    autoPan: false,
    autoClose: false,
    closeButton: false,
  })
    .setContent(
      `<div class="photo"><img src=${base64} id="img${imageCount}" style="width: inherit;"/></div>`
    )
    .openOn(map);
  document.getElementById(`img${imageCount}`).addEventListener("click", () => {
    clickPhoto(image, ownerName, description, tags, time);
  });
  imageCount++;
}

if (localStorage.getItem("user") !== null) {
    window.userName = localStorage.getItem("user");
    // console.lof(userName);
    document.getElementById("login").style.display = "none";
    document.getElementById("profile").style.display = "block";
} else {
  // alert("Please login first");
  document.getElementById("profile").style.display = "block";
  document.getElementById("login").style.display = "block";
}

function resetUpload() {
  document.getElementById("upload-window").style.display = "none";
  document.getElementById("upload-title").style.display = "block";
  document.getElementById("upload").value = "";
  if (document.getElementById("upload-preview") !== null) {
    document.getElementById("upload-preview").remove();
  }
  document.getElementsByClassName("file-button")[0].style.display = "block";
  document.getElementsByClassName("put-button")[0].style.display = "none";
  if (document.getElementById("location-info") !== null) {
    document.getElementById("location-info").remove();
  }
  if (document.getElementById("description-box") !== null) {
    document.getElementById("description-box").remove();
  }
}

document.getElementById("close-btn").addEventListener("click", () => {
  resetUpload();
});

document.getElementById("upload-btn").addEventListener("click", () => {
  if (
    document.getElementById("upload-window").style.display == "" ||
    document.getElementById("upload-window").style.display == "none"
  ) {
    document.getElementById("upload-window").style.display = "flex";
    document.getElementsByClassName("put-button")[0].style.display = "none";
  } else {
    resetUpload();
  }
});

document
  .getElementsByClassName("put-button")[0]
  .addEventListener("click", () => {
    let lat = exifExtract.location.lat;
    let lng = exifExtract.location.lng;

    let tags = [];
    if (document.getElementById("tag-box") !== null) {
      tags = document.getElementById("tag-box").value.split(",");
    }
    let description = "";
    if (document.getElementById("description-box") !== null) {
      description = document.getElementById("description-box").value;
    }
    // let userName = "Iris";
    // if (localStorage.getItem("user") !== null) {
    //     userName = localStorage.getItem("user");
    // }
    // console.log(userName);

    // let src = document.getElementById("upload-preview").src;
    // let div = document.createElement("div");
    // div.setAttribute("class", "photo");
    // let img = document.createElement("img");
    // img.setAttribute("src", base64);
    // img.setAttribute("id", `img${imageCount}`);
    // img.setAttribute("style", "width: inherit;");
    // div.appendChild(img);
    var image = L.popup([lat, lng], {
      autoPan: false,
      autoClose: false,
      closeButton: false,
    })
      .setContent(
        `<div class="photo"><img src=${base64} id="img${imageCount}" style="width: inherit;"/></div>`
      )
      .openOn(map);

    resetUpload();

    document
      .getElementById(`img${imageCount}`)
      .addEventListener("click", () => {
        clickPhoto(image, userName, description, tags, time);
      });
    imageCount++;

    mapicCrud
      .createPicture(userName, base64, tags, description, exifExtract)
      .then((res) => {
        console.log(res);
      });

    // fetch('http://localhost:3000/createPicture', {
    //     method: 'POST',
    //     headers: {
    //         // 'mode': 'cors',
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json'
    //         },
    //     body: JSON.stringify({
    //             ownerName: userName,
    //             imgBase: base64,
    //             tags: tags,
    //             description: description,
    //             exif: exifExtract
    //             })
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log(data);
    //     }
    // );
    // fetch('http://localhost:3000/readPicture?picId=lhqhn62j2we4vu0wb', {
    //     method: 'DELETE',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json'
    //         }
    //         })
    //         .then(response => response.json())
    //         .then(data => {
    //             console.log(data);
    //         }
    //         );

    // fetch(`http://localhost:3000/createPicture?userName=${userName}&picBase64=${src}&tag=${tags}&description=${description}&exif=${exifExtract}`, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json'
    //     },
    // body: JSON.stringify({
    //     userName: userName,
    //     picBase64: window.base64,
    //     tags: tags,
    //     description: description,
    //     exif: exifExtract
    // })
    // })
    // .then(response => response.json())
    // .then(data => {
    //     console.log(data);
    // }
    // );
    // fetch('http://localhost:3000/readUser?userName=Iris', {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json'
    //         }
    //         })
    //         .then(response => response.json())
    //         .then(data => {
    //             console.log(data);
    //         }
    //         );
  });

document.getElementById("upload").onchange = function (e) {
  document.getElementById("upload-title").style.display = "none";
  document.getElementsByClassName("file-button")[0].style.display = "none";
  let img = document.createElement("img");
  img.setAttribute("src", URL.createObjectURL(e.target.files[0]));
  img.setAttribute("id", "upload-preview");
  document.getElementById("upload-window").appendChild(img);

  let description = document.createElement("textarea");
  description.setAttribute("id", "description-box");
  description.setAttribute("placeholder", "Write Description Here...");
  document.getElementById("upload-window").appendChild(description);

  document.getElementsByClassName("put-button")[0].style.display = "block";
  var file = e.target.files[0];
  window.exifExtract = {};
  // {time: 0,
  // location: {lat: 0, lng: 0},
  // exposure_time: 0,
  // aperture: 0,
  // iso: 0}
  EXIF.getData(file, function () {
    var exifData = EXIF.pretty(this);
    var allMetaData = EXIF.getAllTags(this);
    // console.log(allMetaData);
    if (exifData) {
      let exifLat = 0;
      let exifLng = 0;
      if (allMetaData.GPSLatitude && allMetaData.GPSLongitude) {
        const latArr = allMetaData.GPSLatitude;
        const lngArr = allMetaData.GPSLongitude;

        const longLat =
          latArr[0].numerator / latArr[0].denominator +
          latArr[1].numerator / latArr[1].denominator / 60 +
          latArr[2].numerator / latArr[2].denominator / 3600;

        const longLng =
          lngArr[0].numerator / lngArr[0].denominator +
          lngArr[1].numerator / lngArr[1].denominator / 60 +
          lngArr[2].numerator / lngArr[2].denominator / 3600;

        exifLat = longLat.toFixed(8);
        exifLng = longLng.toFixed(8);
        exifLng = -exifLng;
      }

      exifExtract = {
        time: allMetaData.DateTimeOriginal,
        location: { lat: exifLat, lng: exifLng },
        exposure_time:
          allMetaData.ExposureTime.numerator +
          "/" +
          allMetaData.ExposureTime.denominator,
        aperture:
          "f/" +
          allMetaData.FNumber.numerator / allMetaData.FNumber.denominator,
        iso: allMetaData.ISOSpeedRatings,
      };
      // console.log(exifExtract);
      let location = document.createElement("div");
      location.setAttribute("id", "location-info");
      location.textContent =
        "Location: " +
        exifExtract.location.lat +
        ", " +
        exifExtract.location.lng;
      if (exifExtract.location.lat !== 0 && exifExtract.location.lng !== 0) {
        location.textContent =
          "Location: " +
          exifExtract.location.lat +
          ", " +
          exifExtract.location.lng;
      } else {
        location.textContent = "No location data found in image.";
        // click button to manually add location on map
        let addLocation = document.createElement("button");
        addLocation.setAttribute("id", "add-location");
        addLocation.textContent = "Add Location";
        location.appendChild(addLocation);
        addLocation.addEventListener("click", () => {
          location.textContent = "Click on the map to add location.";
          //change cursor to crosshair
          document.getElementById("map").style.cursor = "crosshair";

          map.on("click", function (e) {
            exifExtract.location.lat = e.latlng.lat;
            exifExtract.location.lng = e.latlng.lng;
            location.textContent =
              "Location: " +
              exifExtract.location.lat +
              ", " +
              exifExtract.location.lng;
            document.getElementById("map").style.cursor = "grab";
            map.off("click");
          });
        });
      }
      document.getElementById("upload-window").appendChild(location);
    } else {
      alert("No EXIF data found in image '" + file.name + "'.");
    }
  });
  // console.log(exifExtract);

  // let userName = "testUser";
  // let tags = ["testTag1", "testTag2"];
  // let description = "testDescription";
  // console.log(exifExtract);
  if (file && file.name) {
    var reader = new FileReader();
    reader.onload = function (e) {
      window.base64 = e.target.result;
      // console.log(base64);
      // db.createPicture(userName, base64, tags, description, exifExtract);
    };
    reader.readAsDataURL(file);
  }

  // console.log(base64);
  // console.log(exifExtract);
};
var toolTip;
function clickPhoto(image, ownerName, description, tags, time) {
  const line_separator = document.createElement("hr");
  const line_break = document.createElement("br");
  let latlng = image.getLatLng();
  // console.log(image.getContent());
  // let imageName = image.getContent().split(" ")[2].split("/")[3].split('"')[0];
  // console.log(imageName);
  // if (toolTip == undefined) {
  let photoDiv = document.createElement("div");
  photoDiv.setAttribute("id", "photo-div");
  photoDiv.style.padding = "20px";

  let closeButton = document.createElement("button");
  closeButton.setAttribute("id", "close-button");
  closeButton.textContent = "X";
  closeButton.style.backgroundColor = "red";
  closeButton.style.color = "white";
  closeButton.style.border = "none";
  closeButton.style.padding = "2px 5px";
  closeButton.style.fontSize = "12px";

  let img = document.createElement("img");
  let src = image.getContent().split(" ")[2].split("src=")[1];
  img.setAttribute("src", src);
  img.setAttribute("style", "width:inherit");

  let nameTimeContainer = document.createElement("div");
  nameTimeContainer.style.display = "flex";
  nameTimeContainer.style.justifyContent = "space-between";

  let ownerNameSection = document.createElement("div");
  ownerNameSection.setAttribute("id", "ownerName");
  ownerNameSection.textContent = ownerName;
  ownerNameSection.style.fontWeight = "bold";

  let timeSection = document.createElement("div");
  timeSection.textContent = time;

  nameTimeContainer.appendChild(ownerNameSection);
  nameTimeContainer.appendChild(timeSection);

  let descriptionPara = document.createElement("div");
  descriptionPara.setAttribute("id", "description");
  descriptionPara.textContent =
    description === "" ? "Shares a Photo" : description;
  descriptionPara.style.textAlign = "center";

  let tagSection = document.createElement("div");
  tagSection.setAttribute("id", "tags");
  tagSection.textContent = "Tags:";
  if (tags.length !== 0) {
    tags.map((tag) => {
      tagSection.textContent += ` [${tag}] `;
    });
  } else {
    tagSection.textContent += ` ${ownerName} has not added any tags yet. :-(`;
  }

  let commentDiv = document.createElement("div");
  commentDiv.setAttribute("id", "comment-div");

  let commentInput = document.createElement("input");
  commentInput.setAttribute("id", "comment");
  commentInput.setAttribute("type", "text");
  commentInput.setAttribute("placeholder", "Write a comment...");
  commentInput.setAttribute("style", "border-radius: 10px");

  let commentButton = document.createElement("button");
  commentButton.setAttribute("id", "comment-button");
  commentButton.textContent = "Send";
  commentButton.setAttribute("style", "border-radius: 10px");
  commentDiv.appendChild(commentInput);
  commentDiv.appendChild(commentButton);

  photoDiv.appendChild(closeButton);
  photoDiv.appendChild(img);
  photoDiv.appendChild(line_separator);
  photoDiv.appendChild(nameTimeContainer);
  photoDiv.appendChild(line_separator);
  photoDiv.appendChild(descriptionPara);
  photoDiv.appendChild(tagSection);
  photoDiv.appendChild(line_break);
  photoDiv.appendChild(commentDiv);
  // }
  // console.log(toolTip);
  if (toolTip == undefined) {
    toolTip = L.tooltip([latlng.lat, latlng.lng], {
      direction: "top",
      opacity: 1,
      interactive: true,
      permanent: true,
    })
      .setContent(photoDiv)
      // .setContent('<div id="photo-div"><button id="close-button">&#215</button><img src="/images/2.jpeg" style="width:inherit"/>' +
      // '<div id="description"></div><div id="comment-div"><input id="comment" type="text"/><button id="comment-button">Send</button></div></div>')
      // .setContent('<div class="photo"><img src="/images/2.jpeg" style="width: inherit;"/></div>')
      .addTo(map);
    // let descriptionPara = document.getElementById("description");
    // descriptionPara.textContent = description;
  } else {
    // console.log("else");
    // toolTip.openOn(map);
    // let descriptionPara = document.getElementById("description");
    // descriptionPara.textContent = description;
  }
  let closeBtn = document.getElementById("close-button");
  closeBtn.addEventListener("click", closeTooltip);

  function closeTooltip() {
    if (toolTip != undefined) {
      map.closeTooltip(toolTip);
      toolTip = undefined;
    }
  }
}

// function toCurrentlocation(position) {
//     let lat = position.coords.latitude;
//     let long = position.coords.longitude;
//     let accuracy = position.coords.accuracy;
//     map.panTo([lat, long]);
// }

function getPosition(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  let accuracy = position.coords.accuracy;
  // console.log("Your position is: Lat: " + lat + " Long : " + long + " Accuracy: " + accuracy + ".");

  // let marker = L.marker([lat, long])
  // let circle = L.circle([lat, long],accuracy);
  // L.map('map').setView([lat, long], 1)

  L.control
    .locate({
      position: "bottomright",
      // keepCurrentZoomLevel: true,
      initialZoomLevel: 17,
    })
    .addTo(map);

  // map.panTo([lat, long]);
  // console.log("Your position is: Lat: " + lat + " Long : " + long + " Accuracy: " + accuracy + ".");
}
