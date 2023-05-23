import { mapicCrud } from "../CRUD.js";
import { default_pic } from "../Profile/defaultPic.js";

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

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(getPosition);
} else {
  console.log("Your browser is not support location feature");
}

function closeAllPictures() {
  map.eachLayer(function (layer) {
    if (layer instanceof L.Popup) {
      map.closePopup(layer);
    }
  });
}

mapicCrud.readAllPictures().then((res) => {
//   console.log(res.data);
  for (let curr of res.data) {
    addPictureOnMap(curr);
  }
});

var imageCount = 0;

function addPictureOnMap(data) {
  let base64 = data.picBase64;
  let lat = data.exif.location.lat;
  let lng = data.exif.location.lng;
  let description = data.description;
  let ownerName = data.ownerName;
  let tags = data.tags;
  let time = data.exif.time;
  let id = data._id;
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
    clickPhoto(image,id, ownerName, description, tags, time);
  });
  imageCount++;
}

function isLogin() {
  if (localStorage.getItem("user") !== null) {
    return true;
  }
  return false;
}

if (isLogin()) {
    window.userName = localStorage.getItem("user");
    // console.lof(userName);
    document.getElementById("login").style.display = "none";
    document.getElementById("profile").style.display = "block";
    mapicCrud.readUser(userName).then((res) => {
        let currUser = res.data;
        if (currUser.profilePicture === undefined) {
            document.getElementById("avatar").src = "data:img/png;base64," + default_pic;
            document.getElementById("avatar").style.display = "block";
        } else {
            let avatar = "data:img/png;base64,"+ currUser.profilePicture;
            document.getElementById("avatar").src = avatar;
            document.getElementById("avatar").style.display = "block";
        }
    });
    
} else {
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
  
  document
  document.getElementsByClassName("put-button")[0].style.display = "none";
  if (document.getElementById("location-info") !== null) {
    document.getElementById("location-info").remove();
  }
  if (document.getElementById("description-box") !== null) {
    document.getElementById("description-box").remove();
  }
  if (document.getElementById("tag-box") !== null) {
    document.getElementById("tag-box").remove();
  }
}

document.getElementById("close-btn").addEventListener("click", () => {
  resetUpload();
});

document.getElementById("upload-btn").addEventListener("click", () => {
    if(isLogin()) {
        if (
        document.getElementById("upload-window").style.display == "" ||
        document.getElementById("upload-window").style.display == "none"
        ) {
        document.getElementById("upload-window").style.display = "flex";
        document.getElementsByClassName("put-button")[0].style.display = "none";
        } else {
        resetUpload();
        }
    } else {
        alert("Please login first to use this feature.");
    }
});

document
  .getElementsByClassName("put-button")[0]
  .addEventListener("click", () => {
    let lat = exifExtract.location.lat;
    let lng = exifExtract.location.lng;

    let tags = [];
    if (document.getElementById("tag-box") !== "") {
      tags = document.getElementById("tag-box").value.split(",");
    }
    let description = "";
    if (document.getElementById("description-box") !== null) {
      description = document.getElementById("description-box").value;
    }
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
    let time = exifExtract.time;
    document
      .getElementById(`img${imageCount}`)
      .addEventListener("click", () => {
        
        clickPhoto(image,"",  userName, description, tags, time);
      });
    imageCount++;

    mapicCrud
      .createPicture(userName, base64, tags, description, exifExtract)
      .then((res) => {
        console.log(res);
      });
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
  description.classList.add("input-d");

    let tag = document.createElement("input");
    tag.setAttribute("id", "tag-box");
    tag.setAttribute("type", "text");
    tag.setAttribute("placeholder", "Add Tags Here, Separated by ','");
    tag.classList.add("input");
    document.getElementById("upload-window").appendChild(tag);



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
        let addLocation = document.createElement("button");
        addLocation.setAttribute("id", "add-location");
        addLocation.textContent = "Add Location";
        location.appendChild(addLocation);
        addLocation.addEventListener("click", () => {
          location.textContent = "Click on the map to add location.";
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
  if (file && file.name) {
    var reader = new FileReader();
    reader.onload = function (e) {
      window.base64 = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};
var toolTip;
function clickPhoto(image,id ="", ownerName, description, tags=[], time) {
  const line_separator = document.createElement("hr");
  const line_break = document.createElement("br");
  let latlng = image.getLatLng();
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

  commentButton.addEventListener("click", () => {
    mapicCrud.addComment(id, commentInput.value, userName).then((res) => {
        
        let comment = document.createElement("div");
        comment.setAttribute("class", "comment");
        comment.textContent = `${userName}: ${commentInput.value}`;
        commentDiv.appendChild(comment);
        }
    );
    commentInput.style.display = "none";
    commentButton.style.display = "none";
  });
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
      .addTo(map);

  } else {

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

function getPosition(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;

  L.control
    .locate({
      position: "bottomright",
      // keepCurrentZoomLevel: true,
      initialZoomLevel: 17,
    })
    .addTo(map);
}
