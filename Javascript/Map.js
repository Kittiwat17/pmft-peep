"use strict";
var latitude,longitude
// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
function initAutocomplete() {
  var myLatlng = { lat: -25.363, lng: 131.044 };
  var map = new google.maps.Map(document.getElementById("map"), {
    center: myLatlng,
    zoom: 13,
    mapTypeId: "roadmap",
  });
  //add event listener
  var infoWindow = new google.maps.InfoWindow({
    content: "คลิกเพื่อเลือกตำแหน่งร้านของคุณ",
    position: myLatlng,
  });
  infoWindow.open(map);

  // Configure the click listener.
  map.addListener("click", function (mapsMouseEvent) {
    // Close the current InfoWindow.
    infoWindow.close();

    // Create a new InfoWindow.
    infoWindow = new google.maps.InfoWindow({
      position: mapsMouseEvent.latLng,
    });
    infoWindow.setContent("นี่คือจุดที่คุณเลือก");
    var currentLatLng = mapsMouseEvent.latLng;
    infoWindow.open(map);
    latitude = currentLatLng.lat()
    longitude = currentLatLng.lng()
    console.log(mapsMouseEvent.latLng.toString());
    console.log(currentLatLng.lat(),currentLatLng.lng());
  });
  // Create the search box and link it to the UI element.

  const input = document.getElementById("location-input");
  const searchBox = new google.maps.places.SearchBox(input);
  //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input); // Bias the SearchBox results towards current map's viewport.

  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });
  let markers = []; // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.

  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    } // Clear out the old markers.

    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers = []; // For each place, get the icon, name and location.

    const bounds = new google.maps.LatLngBounds();
    places.forEach((place) => {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }

      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      }; // Create a marker for each place.

      markers.push(
        new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location,
        })
      );

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}


function notRefresh(event){
    event.preventDefault();
}

function setLatLngToDatabase(){
  firebase.auth().onAuthStateChanged((user)=> {
    // console.log(latitude,longitude)
    if (user) {
      // User is signed in.
      firebase.database().ref("users-store/" + user.uid).update({"location": {"lat":latitude,"lng":longitude}})
      console.log(user)
    } else {
      // No user is signed in.
    }
  });
}