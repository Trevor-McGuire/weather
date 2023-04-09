function getApi(lat,lng) {
  var request = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,relativehumidity_2m,windspeed_10m&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timeformat=unixtime`
  fetch(request)
    .then(function (response) {
      if (response.status !== 200) {
        console.log("respone error !== 200")
      }
      return response.json();
    })
    .then(function (data) {
      //todo print data values of City,Date,temp,wind,humidity for 6 days
      console.log(data)
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
//todo make it so that duplicate values are removed
function localStorageCities(name,lat,lng) {
  var cityList = JSON.parse(localStorage.getItem("cities") || '[]');
  if (cityList.length == 0) {
    console.log("default cities")
    cityList = [
      ["city0",20,40],
      ["city1",21,41],
      ["city2",22,42],
      ["city3",23,43],
      ["city4",24,44],
      ["city5",25,45],
      ["city6",26,46],
      ["city7",27,47],
      ["city8",28,48],
      ["city9",29,49],
    ]
  }
  if (name) {
    cityList.push([name,lat,lng])
    cityList.shift()
    localStorage.setItem("cities", JSON.stringify(cityList));
    getApi(lat,lng);
  } 
  var btn = $("button")
  var cityList = cityList.reverse()
  for (i=0 ; i<btn.length ; i++) {
    btn[i].textContent = cityList[i][0]
    btn[i].dataset.lat = cityList[i][1]
    btn[i].dataset.lng = cityList[i][2]
    //todo add event listener so to btn to run getapi()
  }
}