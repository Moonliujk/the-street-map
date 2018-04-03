//show loading error
function showErrorInfo() {
  $('#loading-information').removeClass('loading');
  $('#loading-information').addClass('loading-error');
  $('#loading-information').html('<span class="loading-error">网络错误，请重新刷新页面！</span>');
}
// define the map styles
//这里的地图样式借鉴了google map style中的一个地图样式
var mapStyles = [
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
// define location's LatLng
var defaultLocations = [
      {title: '南京理工大学', location: {lat: 32.0352295, lng: 118.8531283}},
      {title: '明孝陵', location: {lat: 32.0582209, lng: 118.8323852}},
      {title: '灵谷寺', location: {lat: 32.0549885, lng: 118.8656373}},
      {title: '南京博物院', location: {lat: 32.0399793, lng: 118.8224308}},
      {title: '夫子庙', location: {lat: 32.020542, lng: 118.7867263}},
      {title: '紫峰大厦', location: {lat: 32.062452, lng: 118.775866}}
  ];
