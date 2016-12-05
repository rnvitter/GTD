$(document).ready(function() {
// create map
var map = L.map('map', {
  center: [15.78219,11.2044942],
  zoom: 3,
  minZoom: 3,
  zoomControl: false
});

L.control.zoom({position:'bottomright'}).addTo(map);

$('.scrollbar-macosx').scrollbar();

//basemap
var CartoDB_Midnight = L.tileLayer('https://cartocdn_{s}.global.ssl.fastly.net/base-midnight/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>, Data: <a href="https://www.start.umd.edu/gtd/">START GTD</a>'
}).addTo(map);

//MarkerClusterGroup that collects all GeoJSON objects
var group = new L.markerClusterGroup({ disableClusteringAtZoom: 9, maxClusterRadius: 120}).addTo(map);

//styles
var point_sty = {
  radius: 7,
  fillColor: "#7B00B4",
  color: "#000",
  weight: 0,
  opacity: 1,
  fillOpacity: 0.7
};

function highlightFeature(e) {
  	var layer = e.target;

  	if (!L.Browser.ie && !L.Browser.opera) {
  		layer.bringToFront();
  	}

    layer.setStyle({
        weight: 2,
        color: 'white',
        fillOpacity: 0.7
    });

}

function clickFeature(e) {
  var layer = e.target;

  if (!L.Browser.ie && !L.Browser.opera) {
    layer.bringToFront();
  }
  info.update(layer.feature.properties);
}

function resetHighlight(e) {
  var layer = e.target;

  layer.setStyle(point_sty);
}

function onEachFeature(feature, layer) {
  	layer.on({
  		mouseover: highlightFeature,
  		mouseout: resetHighlight,
      click: clickFeature
  	});
}

//info panel
var info = L.control();

info.onAdd = function (map) {
    this.info = L.DomUtil.get("count"); // get that DIV
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
  count.innerHTML = (props ?
    '</label><br /><strong>TERRORIST GROUP: </strong><label>' + props.gname
    + '</label><br /><strong>DATE: </strong><label>' + props.imonth + '/' + props.iday + '/' + props.iyear
    + '</label><br /><strong>COUNTRY: </strong><label>' + props.country_tx
    + '</label><br /><strong>PROVINCE/STATE: </strong><label>' + props.provstate
    + '</label><br /><strong>CITY: </strong><label>' + props.city
    + '</label><br /><strong>LOCATION DETAILS: </strong><label>' + props.location
    + '</label><br /><strong>ATTACK TYPE: </strong><label>' + props.attackty_1
    + '</label><br /><strong>MOTIVE: </strong><label>' + props.Motive
    + '</label><br /><strong>NUMBER KILLED: </strong><label>' + props.nkill
    + '</label><br /><strong>TARGET: </strong><label>' + props.targsubt_1
    + '</label><br /><strong>WEAPON CATEGORY: </strong><label>' + props.weaptype1_
    + '</label><br /><strong>WEAPON TYPE: </strong><label>' + props.weapsubt_1
    + '</label><br /><strong>WEAPON DETAIL: </strong><label>' + props.weapdetail
    + '</label><br /><strong>SUMMARY: </strong><label>' + props.summary + '...'
    :
    '</label><br /><strong>TERRORIST GROUP: </strong><label>' + ' '
    + '</label><br /><strong>DATE: </strong><label>' + ' '
    + '</label><br /><strong>COUNTRY: </strong><label>' + ' '
    + '</label><br /><strong>PROVINCE/STATE: </strong><label>' + ' '
    + '</label><br /><strong>CITY: </strong><label>' + ' '
    + '</label><br /><strong>LOCATION DETAILS: </strong><label>' + ' '
    + '</label><br /><strong>ATTACK TYPE: </strong><label>' + ' '
    + '</label><br /><strong>MOTIVE: </strong><label>' + ' '
    + '</label><br /><strong>NUMBER KILLED: </strong><label>' + ' '
    + '</label><br /><strong>TARGET: </strong><label>' + ' '
    + '</label><br /><strong>WEAPON CATEGORY: </strong><label>' + ' '
    + '</label><br /><strong>WEAPON TYPE: </strong><label>' + ' '
    + '</label><br /><strong>WEAPON DETAIL: </strong><label>' + ' '
    + '</label><br /><strong>SUMMARY: </strong><label>' + ' ');
};

var column = null;
var search = null;

$(document).delegate('#group a', 'click', function(e) {
  group.clearLayers();
  column = $(this).attr("class");
  search = $(this).attr("id");
  QueryRun();
});

$(document).delegate('#country a', 'click', function(e) {
  group.clearLayers();
  column = $(this).attr("class");
  search = $(this).attr("id");
  QueryRun();
});

$(document).delegate('#attack a', 'click', function(e) {
  group.clearLayers();
  column = $(this).attr("class");
  search = $(this).attr("id");
  QueryRun();
});

function QueryRun() {
var querystem = "http://ryanvitter.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM gtd_11to14_all WHERE ";
var query = querystem + column + " ILIKE '" + search + "'";
console.log("Initial query: " + query);

$.getJSON(query, function(cartodbdata) {
  geojsonlayer = L.geoJson(cartodbdata,{
    // add popup with info to each geosjon feature
    onEachFeature: onEachFeature,
    //style the point marker
    pointToLayer: function (feature, latlng) {
return L.circleMarker(latlng, point_sty);
}
}).addTo(group);
var bounds = group.getBounds();
      map.fitBounds(bounds);
});
}

})
