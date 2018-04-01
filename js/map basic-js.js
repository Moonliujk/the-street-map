//  define the map's container
var map;
// define the markers' array
var markers = [];
//define place marker showing on the map
var placesMarker = [];

//loading google map
function initMap() {
    //load infobox_packed.js to custom infoWindow
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "js/infobox.js";
    document.getElementsByTagName('head')[0].appendChild(s);

    //define inforWindow styles
    /*var ibOptions = {
        disableAutoPan: false,
        maxWidth: 0,
    		pixelOffset: new google.maps.Size(-140, 0),
    		zIndex: null,
    		boxStyle: {
          padding: "0px 0px 0px 0px",
          width: "252px"
        },
        closeBoxURL : "",
        infoBoxClearance: new google.maps.Size(1, 1),
    		isHidden: false,
    		pane: "floatPane",
    		enableEventPropagation: false
    };*/

    //define the map's style --- quote
    var styles = [
        {
          "featureType": "landscape",
          "stylers": [
            { "visibility": "simplified" },
            { "color": "#2b3f57" },
            { "weight": 0.1 }
          ]
        },{
          "featureType": "administrative",
          "stylers": [
            { "visibility": "on" },
            { "hue": "#ff0000" },
            { "weight": 0.4 },
            { "color": "#ffffff" }
          ]
        },{
          "featureType": "road.highway",
          "elementType": "labels.text",
          "stylers": [
            { "weight": 1.3 },
            { "color": "#FFFFFF" }
          ]
        },{
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            { "color": "#f55f77" },
            { "weight": 3 }
          ]
        },{
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
            { "color": "#f55f77" },
            { "weight": 1.1 }
          ]
        },{
          "featureType": "road.local",
          "elementType": "geometry",
          "stylers": [
            { "color": "#f55f77" },
            { "weight": 0.4 }
          ]
        },{
        },{
          "featureType": "road.highway",
          "elementType": "labels",
          "stylers": [
            { "weight": 0.8 },
            { "color": "#ffffff" },
            { "visibility": "on" }
          ]
        },{
          "featureType": "road.local",
          "elementType": "labels",
          "stylers": [
            { "visibility": "off" }
          ]
        },{
          "featureType": "road.arterial",
          "elementType": "labels",
          "stylers": [
            { "color": "#ffffff" },
            { "weight": 0.7 }
          ]
        },{
          "featureType": "poi",
          "elementType": "labels",
          "stylers": [
            { "visibility": "off" }
          ]
        },{
          "featureType": "poi",
          "stylers": [
            { "color": "#6c5b7b" }
          ]
        },{
          "featureType": "water",
          "stylers": [
            { "color": "#f3b191" }
          ]
        },{
          "featureType": "transit.line",
          "stylers": [
            { "visibility": "on" }
          ]
        }
      ];
    //define the places' location
    var locations = [
        {title: '南京理工大学', location: {lat: 32.0352295, lng: 118.8531283}},
        {title: '明孝陵', location: {lat: 32.0582209, lng: 118.8323852}},
        {title: '灵谷寺', location: {lat: 32.0549885, lng: 118.8656373}},
        {title: '南京博物院', location: {lat: 32.0399793, lng: 118.8224308}},
        {title: '夫子庙', location: {lat: 32.020542, lng: 118.7867263}},
    ];


    var bounds = new google.maps.LatLngBounds();  ///用于将标记在地图上展现最佳视野

    map = new google.maps.Map(document.getElementById('map'), {
        //locate the NUST
        center: {lat: 32.03095880452671, lng: 118.85602},
        styles: styles,
        zoom: 13
    });

    // This autocomplete is for use in the geocoder entry box.
    var zoomAutocomplete = new google.maps.places.Autocomplete(
        document.getElementById('places-search'));
    //Bias the boundaries within the map for the zoom to area text.
    zoomAutocomplete.bindTo('bounds', map);

    // Create a searchbox in order to execute a places search
    var searchBox = new google.maps.places.SearchBox(
        document.getElementById('places-search'));
    // Bias the searchbox to within the bounds of the map.
    searchBox.setBounds(map.getBounds());
    //define search box event
    searchBox.addListener('places_changed', function() {
      searchBoxPlaces(this);
    });

    var iconDefault = {
        url: 'C:/Users/14117/Desktop/udacity/map applicationP4/map application/img/marker-default.svg',
        //optimized: false,
        size: new google.maps.Size(48, 48),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 48),
        scaledSize: new google.maps.Size(48, 48)
    };
    var lastInfoWindow; //define information window to show locations's information

    document.getElementById('go').addEventListener('click', function() {
      showPlace();
    });

    //show markers on the map
    for(let i=0; i<locations.length; i++) {
        let position = locations[i].location,
            title = locations[i].title;

        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: iconDefault,
            id: i
        });

        markers.push(marker);
        placesMarker.push(marker);

        marker.addListener('click', function() {
          showInforWindow(this, lastInfoWindow);
        });

        bounds.extend(markers[i].position);
    }

    map.fitBounds(bounds);
}
//trigger the event when click the certain marker
function showInforWindow(marker, lastInfoWindow) {
    if (marker.position != lastInfoWindow.getPosition()) {
      let service = new google.maps.places.PlacesService(map);
      let request = {
        location: marker.position,
        radius: '500',
        query: marker.title
      };
      //console.log('next, we will show photo!');
      service.textSearch(request, searchDetails);
      /*service.getDetails(request, function() {
        loadContent(results, status, locInformation);
      });*/
      function searchDetails(outResults, outStatus) {
        if (outStatus == google.maps.places.PlacesServiceStatus.OK) {
/*          let photos = results[0].photos;
          let placeId = results[0].place_id;*/
          let request = {
            placeId: outResults[0].place_id
          }

          let service = new google.maps.places.PlacesService(map);
          service.getDetails(request, loadContent);

          function loadContent(inResults, inStatus) {
            if (inStatus == google.maps.places.PlacesServiceStatus.OK) {
              let photos = inResults.photos;
              let phoneNumber = inResults.formatted_phone_number;
              let placeLocation = inResults.vicinity;
              //define inforWindow style
              let ibOptions = {
                  disableAutoPan: false,
                  maxWidth: 0,
              		pixelOffset: new google.maps.Size(-140, 0),
              		zIndex: null,
              		boxStyle: {
                    padding: "0px 0px 0px 0px",
                    width: "252px"
                  },
                  closeBoxURL : "",
                  infoBoxClearance: new google.maps.Size(1, 1),
              		isHidden: false,
              		pane: "floatPane",
              		enableEventPropagation: false
              };

              if (!photos) {
                console.log('there is no relative photo!');
                return;
              }

              let url = photos[0].getUrl({'maxWidth': 200, 'maxHeight': 200});

              //create infoWindow container to wrap the Content
              let boxText = document.createElement("div");
              boxText.style.cssText = "margin-top: 8px; background: yellow; padding: 0px;";
              boxText.innerHTML = `<div class='info-container'>
                          <span class='info-header'>${marker.title}</span>
                          <span class='info-image'>
                            <img src='${url}' />
                          </span>
                          <span class='info-telephone'>电话：${phoneNumber}</sapn>
                          <span class='info-place-location'>地址：${placeLocation}</span>
                        </div>`;


              /*let content = `<div class='info-container'>
                          <span class='info-header'>${marker.title}</span>
                          <span class='info-image'>
                            <img src='${url}' />
                          </span>
                          <span class='info-telephone'>电话：${phoneNumber}</sapn>
                          <span class='info-place-location'>地址：${placeLocation}</span>
                        </div>`;*/

              //console.log('show photo!');
              ibOptions.content = boxText;
              let ib = new InfoBox(ibOptions);
              ib.open(map, marker);
              map.panTo(ib.getPosition());
              lastInfoWindow = ib;
              /*locInformation.marker = marker;
              locInformation.setContent(content);
              locInformation.open(map, marker);*/

              /*locInformation.addListener('closeclick', function() {
                  locInformation.marker = null;
              });*/
            }
        }
      }
    }
  }
}

//hide markers to show certain marker
function hideMarkers(markers) {
  for (let i=0; i<markers.length; i++) {
    markers[i].setMap(null);
  }
}
//show certain places' markers on the map
function showMarkersForPlace(places) {
  var iconChosen = {
      url: 'C:/Users/14117/Desktop/udacity/map applicationP4/map application/img/marker-chosen.svg',
      optimized: false,
      size: new google.maps.Size(48, 48),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(20, 48),
      scaledSize: new google.maps.Size(48, 48)
  };

  for (let i=0; i<places.length; i++) {
    let place = places[i];

    let marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      title: place.name,
      animation: google.maps.Animation.DROP,
      icon: iconChosen,
      id: place.id
    });

    placesMarker.push(marker);
  }
}
//trigger places' change event
function searchBoxPlaces(searchBox) {
  hideMarkers(placesMarker);
  var places = searchBox.getPlaces();

  if (places.length === 0) {
    window.alert('无法查找到您输入的地点');
  } else {
    showMarkersForPlace(places);
  }
}
