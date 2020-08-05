// Creating map object
var myMap = L.map("map", {
  center: [51.5074, -0.1278],
  zoom: 1.5,
  layer: greymap
});

// Adding tile layer
var greymap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// Getting JSON countries data from the below URL
d3.json("https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson").then(function (countriesData) {

  // Perform a GET request to the query URL
  d3.json("/api/suicides_by_country").then(function (data) {

    var country = Object.keys(data)
    var suicides = Object.values(data)

    countriesData.features.forEach(function (country) {
      var countryCode = country.properties.ISO_A3;
      var countryName = country.properties.ADMIN;

      if (countryCode in data) {
        country.properties.suicides = data[countryCode].suicides
      }
      else {
        country.properties.suicides = " Data Not Available";;
      }
    })

    console.log(data);

    function color(suicides) {
      switch (true) {
        case suicides >= 100000:
          return '#b6003b';
        case suicides >= 10000:
          return '#e52c00';
        case suicides >= 1000:
          return '#fe522a';
        case suicides >= 100:
          return '#fe9882';
        default:
          return '#ffded5';

      }
    }
    //  Create a new choropleth layer
    var geojson = L.choropleth(countriesData, {
      // Define what  property in the features to use
      valueProperty: "suicides",
      // Set color scale
      scale:  ["#ffffb2", "#b10026"],
      // Number of breaks in step range
      steps: 10,
      // q for quartile, e for equidistant, k for k-means
      mode: "q",
      style: {
        // Border color
        color: "#fff",
        weight: 1,
        fillOpacity: 0.8
      },

      // Binding a pop-up to each layer
      onEachFeature: function (feature, layer) {
        layer.bindPopup("Country: " + feature.properties.ADMIN + "<br>" + "No of Suicides:" + feature.properties.suicides);
      }
    }).addTo(myMap);

    // Add legend to the map
    var legend = L.control({ position: 'bottomleft' });

    legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend'),
        suicides = [0, 10, 100, 1000, 10000, 100000];
      div.innerHTML += "<b>Suicides Per Country</b><hr/>" + "<br>";
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < suicides.length; i++) {

        div.innerHTML +=
          "<i style='background:" + color(suicides[i]) + "'></i> " +
          suicides[i] + (suicides[i + 1] ? "&ndash;" + suicides[i + 1] + "<br>" : "+");
      }

      return div;
    };

    legend.addTo(myMap);

  });
});

  