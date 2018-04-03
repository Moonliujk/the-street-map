// load function when map finish loading
google.maps.event.addDomListener(window, 'load', initialize);

//  define the map's container
var map;
// define the markers' array
var markers = [];
// define place marker showing on the map
var placesMarker = [];
// define the map bounds
var bounds;
// define markers styles
var iconDefault = {},
    iconChosen = {};
// define lastInfoWindow
var lastInfoWindow;

//define KnockOut Object
var viewModel = {};
// define the infoWindow styles
var infoStyle = 'background: rgba(51, 51, 51, 0.9); border: 4px solid white; border-radius: 8px; padding: 5px 0 8px 8px;'
// define map

function initialize() {
    bounds = new google.maps.LatLngBounds();  // 用于将标记在地图上展现最佳视野
    lastInfoWindow = new InfoBox();
    // set default markers style
    iconDefault = {
        url: 'img/marker-default.svg',
        // optimized: false,
        size: new google.maps.Size(48, 48),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 48),
        scaledSize: new google.maps.Size(48, 48)
    };

    iconChosen = {
        url: 'img/marker-chosen.svg',
        // optimized: false,
        size: new google.maps.Size(48, 48),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 48),
        scaledSize: new google.maps.Size(48, 48)
    };

    map = new google.maps.Map(document.getElementById('map'), {
        // locate the NUST
        center: {lat: 32.03095880452671, lng: 118.85602},
        styles: mapStyles,
        zoom: 13
    });

    // show map when all titles loaded
    google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
        // do something only the first time the map is loaded
        $('.start-interface').fadeOut(500, function() {
          $('.container').addClass("show-map");
        });
        // $('.container').fadeIn();
        // console.log('页面加载完毕！');
    });

    defineMapApp();
    setMarker(defaultLocations, iconDefault);
    // define the weather searching module
    searchWeather();
    sidebarbuttom();

    var ViewModel = function() {
        var self = this;

        self.search = ko.observable('');

        self.listClick = function(data, event) {
          let itemValue = event.target.innerHTML;
          //let place = [];
          hideMarkers(placesMarker);

          for (let i=0; i<defaultLocations.length; i++) {
              if (defaultLocations[i].title === itemValue) {
                  //place.push(defaultLocations[i]);
                  setMarker([defaultLocations[i]], iconChosen);
                  //google.maps.event.trigger(place[0].marker, "click");
                  break;
              }
          }

          //单个元素转化为数组元素

          google.maps.event.trigger(placesMarker[0], "click");
        };

        self.searchPlace = ko.computed(function() {
            if (!self.search()) {
                return defaultLocations.map(function(element) {
                    return element.title;
                });
            } else {
                return defaultLocations.map(function(element) {
                    if (element.title.indexOf(self.search()) != -1) {
                        return element.title;
                    }
                });
            }
        });

    };
    ko.applyBindings(new ViewModel());
}
// define the map basic application
function defineMapApp() {
    // This autocomplete is for use in the geocoder entry box.
    /*var zoomAutocomplete = new google.maps.places.Autocomplete(
        document.getElementById('places-search'));*/
    // Bias the boundaries within the map for the zoom to area text.
    //zoomAutocomplete.bindTo('bounds', map);

    // Create a searchbox in order to execute a places search
    var searchBox = new google.maps.places.SearchBox(
        document.getElementById('places-search'));
    // Bias the searchbox to within the bounds of the map.
    searchBox.setBounds(map.getBounds());
    // define search box event
    searchBox.addListener('places_changed', function() {
      searchBoxPlaces(this);
    });
    document.getElementById('go').addEventListener('click', textSearchPlace);

}
// set Markers on the map
function setMarker(locations, iconStyle) {
    // show markers on the map
    if (placesMarker.length !== 0) {
      placesMarker = [];
    }
    for(let i=0; i<locations.length; i++) {
        let position = locations[i].location || locations[i].geometry.location,
            title = locations[i].title || locations[i].name;

        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: iconStyle,
            id: i
        });

        //markers.push(marker);
        placesMarker.push(marker);

        marker.addListener('click', function() {
          showInforWindow(this);
        });

        bounds.extend(marker.position);
    }
    map.fitBounds(bounds);
}
// trigger the event when click certain marker
function showInforWindow(marker) {
    if (marker.position == lastInfoWindow.getPosition()) {
      return;
    }
    lastInfoWindow.close();

    if (marker.position) {
      let service = new google.maps.places.PlacesService(map);
      let boundsTxt = map.getBounds();
      let request = {
        bounds: boundsTxt,
        query: marker.title
      };

      service.textSearch(request, searchDetails);

      function searchDetails(outResults, outStatus) {
        if (outStatus == google.maps.places.PlacesServiceStatus.OK) {

          let request;
          let latDiff,
              lngDiff;

          for (let i=0; i<outResults.length; i++) {
            /*console.log(outResults[i].geometry.location.lat());
              console.log(marker.position.lat());*/
              /*在搜索相同地点时，返回的搜索结果应该与marker的position相关，这点由设置合适的经纬度差值所保证*/
              latDiff = Math.abs(outResults[i].geometry.location.lat() - marker.position.lat()) < 0.005 ? true : false;
              lngDiff = Math.abs(outResults[i].geometry.location.lng() - marker.position.lng()) < 0.005 ? true : false;
              if (lngDiff && latDiff) {
                  request = {
                    placeId: outResults[i].place_id
                  }
                  break;
              }
          }

          let service = new google.maps.places.PlacesService(map);
          service.getDetails(request, loadContent);

          function loadContent(inResults, inStatus) {
            if (inStatus == google.maps.places.PlacesServiceStatus.OK) {
              let photos = inResults.photos;
              let phoneNumber = inResults.formatted_phone_number || '暂无详细电话';
              let placeLocation = inResults.vicinity;
              // define inforWindow style
              let ibOptions = {
                  disableAutoPan: false,
                  maxWidth: 0,
              		pixelOffset: new google.maps.Size(-100, 10),
              		zIndex: null,
	                boxStyle: {
                    width: "240px"
                  },
                  closeBoxURL: "img/关闭.svg",
                  closeBoxMargin: "10px",
                  infoBoxClearance: new google.maps.Size(1, 1),
              		isHidden: false,
              		pane: "floatPane",
              		enableEventPropagation: false
              };

              let url;

              if (!photos) {
                console.log('there is no relative photo!');
                url = 'img/no photo.jpg';
              } else {
                url = photos[0].getUrl({'maxWidth': 200, 'maxHeight': 200});
              }

              // create infoWindow container to wrap the Content
              let boxText = document.createElement("div");
              boxText.style.cssText = infoStyle;
              boxText.innerHTML = `<div class='info-container'>
                          <span class='info-header'>${marker.title}</span>
                          <span class='info-image'>
                            <img src='${url}' />
                          </span>
                          <span class='info-telephone'>电话：${phoneNumber}</sapn>
                          <span class='info-place-location'>地址：${placeLocation}</span>
                        </div>`;

              ibOptions.content = boxText;
              let ib = new InfoBox(ibOptions);
              ib.open(map, marker);
              map.panTo(ib.getPosition());
              lastInfoWindow = ib;
              lastInfoWindow.addListener('closeclick', function() {
                  lastInfoWindow = new InfoBox();
              });
            } else {
              window.alert('网络问题，请刷新后再次尝试！');
            }
        }
      } else {
        window.alert('网络问题，请刷新后再次尝试！');
      }
    }
  }
}
// hide markers to show certain marker
function hideMarkers(markers) {
    for (let i=0; i<markers.length; i++) {
      markers[i].setMap(null);
    }
}
// trigger places' change event
function searchBoxPlaces(searchBox) {
    hideMarkers(placesMarker);
    lastInfoWindow.close();
    let places = searchBox.getPlaces();

    if (places.length === 0) {
      window.alert('无法查找到您输入的地点');
    } else {
      setMarker(places, iconChosen);
    }
}
// using text to search certain places
function textSearchPlace() {
    let bounds = map.getBounds();
    let placeService = new google.maps.places.PlacesService(map);

    hideMarkers(placesMarker);
    lastInfoWindow.close();

    placeService.textSearch({
      query: document.getElementById('places-search').value,
      bounds: bounds
    }, function(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        setMarker(results, iconChosen);
      } else {
        window.alert('网络问题，请刷新后再次尝试！');
      }
    })
}
// https://free-api.heweather.com/s6/weather/forecast?location=nanjing&key=1458cfbc2d244ac6ac31a866e8455bd8
function searchWeather() {
  $('#weather-search').on('click', function() {
    if ($('#weather-list').hasClass('open-list')) {
      $('#weather-list').removeClass('open-list');
      $('#weather-list').on('transitionend', deleteList);

      listAnimation('天气查询');

    } else {

      $('#weather-list').addClass('open-list');
      fetch('https://free-api.heweather.com/s6/weather/forecast?location=nanjing&key=1458cfbc2d244ac6ac31a866e8455bd8')
      .then(response => response.json())
      .then(addWeatherInfo)
      .catch(e => window.alert(e));

      //listAnimation('&#9206');
    }
  });
}
// show weather on the screen
function addWeatherInfo(results) {
  listAnimation('&#9206');

  let weatherList = $('#weather-list');
  let weatherInfo = results.HeWeather6[0];
  let content = '';

  for (let i=0; i<weatherInfo.daily_forecast.length; i++) {
    let date = '';

    if (i === 0) {
      date = 'Today';
    } else {
      date = formatDate(weatherInfo.daily_forecast[i].date);
    }

    content = content + `<li><span class="date">${date}</span>
    <span class="temperature">${weatherInfo.daily_forecast[i].tmp_min} ~ ${weatherInfo.daily_forecast[i].tmp_max} &#8451 </span>
    <span class="condition">${weatherInfo.daily_forecast[i].cond_txt_d}</span></li>`;
  }

  weatherList.html(content);
}
// define 'list' animation
function listAnimation(text) {

  $('#weather-search').addClass('fade-out');
  $('#weather-search').on('animationend', changeTxt(text));
  $('#weather-search').addClass('fade-in');
  $('#weather-search').on('animationend', deleteClass);
}
// delete 'list' after' transition' end
function deleteList() {
  $('#weather-list').html('');
  $('#weather-list').off('transitionend', deleteList);
}
//change content in the element 'a'
function changeTxt(text) {
  $('#weather-search').off('animationend', changeTxt);
  $('#weather-search').html(text);
  $('#weather-search').removeClass();
}
//delete class name after animation end
function deleteClass() {
  $('#weather-search').removeClass();
  $('#weather-search').off('animationend', deleteClass);
}
// date formatting
function formatDate(text) {
  let dates = text.split('-');

  dates.shift();
  dates[0] = parseInt(dates[0]);
  dates[1] = parseInt(dates[1]);

  return dates.join('.');
}
// control the sidebar show & hide
function sidebarbuttom() {

  $('.show-sidebar').click(function() {
      $(".show-sidebar").fadeOut();
      $(".searching-container").fadeOut();
      $(".sidebar-container").addClass("sidebar-open");
  });

  $('.hide-sidebar').click(function() {
      $(".sidebar-container").removeClass("sidebar-open");
      //$("#refer-place-searching").val('');
      $(".show-sidebar").fadeIn();
      $(".searching-container").fadeIn();
  });
}
