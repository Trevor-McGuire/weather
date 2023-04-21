function getApi(name,lat,lng) {
  var request = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,relativehumidity_2m,weathercode,windspeed_10m&daily=weathercode&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timeformat=unixtime&timezone=America%2FChicago`
  fetch(request)
    .then(function (response) {
      if (response.status !== 200) {
        console.log("respone error !== 200")
      }
      return response.json();
    })
    .then(function (data) {
      var city = document.querySelector(".city")
      var date = document.querySelectorAll(".date")
      var code = document.querySelectorAll(".code")
      var temp = document.querySelectorAll(".temp")
      var wind = document.querySelectorAll(".wind")
      var humidity = document.querySelectorAll(".humidity")
      city.textContent = name
      for (i=0 ; i<date.length ; i++) {
        date[i].textContent = dayjs().add(i,"day",i).format("ddd")
        temp[i].textContent = parseInt(data.hourly.temperature_2m[24*i]) + data.hourly_units.temperature_2m
        wind[i].textContent = parseInt(data.hourly.windspeed_10m[24*i]) + " " + data.hourly_units.windspeed_10m
        humidity[i].textContent = parseInt(data.hourly.relativehumidity_2m[24*i]) + data.hourly_units.relativehumidity_2m
        switch(data.hourly.weathercode[24*i]) {
          case 0:code[i].textContent = "☀";break;
          case 1:code[i].textContent = "🌤";break;
          case 2:code[i].textContent = "⛅";break;
          case 3:code[i].textContent = "☁";break;
          case 45:code[i].textContent = "🌫";break;
          case 48:code[i].textContent = "🌫";break;
          case 51:code[i].textContent = "🌦";break;
          case 53:code[i].textContent = "🌧";break;
          case 55:code[i].textContent = "🌧";break;
          case 56:code[i].textContent = "🧊";break;
          case 57:code[i].textContent = "🧊";break;
          case 61:code[i].textContent = "🌧";break;
          case 63:code[i].textContent = "⛈";break;
          case 65:code[i].textContent = "⛈";break;
          case 66:code[i].textContent = "🧊";break;
          case 67:code[i].textContent = "🧊";break;
          case 71:code[i].textContent = "🌨";break;
          case 73:code[i].textContent = "🌨";break;
          case 75:code[i].textContent = "🌨";break;
          case 77:code[i].textContent = "🌨";break;
          case 80:code[i].textContent = "⛈";break;
          case 81:code[i].textContent = "⛈";break;
          case 82:code[i].textContent = "⛈";break;
          case 85:code[i].textContent = "🌨";break;
          case 86:code[i].textContent = "🌨";break;
          case 95:code[i].textContent = "⛈";break;
          case 96:code[i].textContent = "⛈";break;
          case 99:code[i].textContent = "⛈";break;

          default:code[i].textContent = "error"
        }
        
      }
    });
}


// credit attributed for this function to:
// https://webninjadeveloper.com/javascript/javascript-google-places-api-autocomplete-textbox-with-location-filters-plot-selected-location-in-map/
window.onload = () => {
  var input = document.getElementById("search-input");
  var options = {
    types: ["(cities)"],
    componentRestrictions: { country: ["us"] },
  };
  localStorageCities();
  var autocomplete = new google.maps.places.Autocomplete(input, options);
  autocomplete.addListener("place_changed", function () {
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }
    var lat = place.geometry.location.lat()
    var lng = place.geometry.location.lng()
    localStorageCities(place.name,lat,lng);
  })
}
function localStorageCities(name,lat,lng) {
  var cityList = JSON.parse(localStorage.getItem("cities") || '[]');
  if (cityList.length == 0) {
    console.log("default cities")
    cityList = [
      ["New York",40.7127753,-74.0059728],
      ["Los Angeles",34.0522342,-118.2436849],
      ["San Francisco",37.7749295,-122.4194155],
      ["Seattle",47.6062095,-122.3320708],
      ["Boston",42.3600825,-71.0588801],
      ["Philadelphia",39.9525839,-75.1652215],
      ["Washington",38.9071923,-77.0368707],
      ["Atlanta",33.748752,-84.38768449999999],
      ["Miami",25.7616798,-80.1917902],
      ["New Orleans",29.95106579999999,-90.0715323]
    ]
  }
  if (name) {
    cityList.push([name,lat,lng])
    cityList.shift()
    localStorage.setItem("cities", JSON.stringify(cityList));
  } 
  var btn = document.querySelectorAll("button")
  var cityList = cityList.reverse()
  for (i=0 ; i<btn.length ; i++) {
    btn[i].textContent = cityList[i][0]
    btn[i].dataset.lat = cityList[i][1]
    btn[i].dataset.lng = cityList[i][2]
    //todo add event listener so to btn to run getapi()
    btn[i].addEventListener("click",function() {
      var e = event.target
      getApi(e.textContent,e.dataset.lat,e.dataset.lng)
    })
  }
  getApi(cityList[0][0],cityList[0][1],cityList[0][2],);
}