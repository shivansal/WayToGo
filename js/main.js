
var location1;
var location2;
var orgin;
var destination;
var mapCenter;
var mapCenterLong;
var mapCenterLast;
var geocoder;
var map;
var distance;

function initialize(){ //Find the two locations(Orgin and Destination)
  geocoder = new google.maps.Geocoder(); //geocoder to convert addreess to long/latitude

  orgin = $("#starting_point").val(); //take user input for different values
  destination = $("#destination").val();

  if(geocoder){//converting into coordinatates
    geocoder.geocode( { 'address': orgin}, function(results)
    {
      location1 = results[0].geometry.location;
    });
    geocoder.geocode( { 'address': destination}, function(results)
    {
      location2 = results[0].geometry.location;
      displayMap(); //in order to show the map
    });
    }
  }

  function displayMap(){
    mapCenterLong = (location1.lat()+location2.lat())/2;
    mapCenterLast = (location1.lng()+location2.lng())/2
    mapCenter = new google.maps.LatLng(mapCenterLong,mapCenterLast);

    var mapOptions =
      {
        zoom: 1,
        center: mapCenter,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

      //route
      directionsService = new google.maps.DirectionsService();
      directionsDisplay = new google.maps.DirectionsRenderer(
      {
        suppressMarkers: true,
        suppressInfoWindows: true
      });

      directionsDisplay.setMap(map);
      var request = {
          origin:orgin,
          destination:destination,
          travelMode: google.maps.DirectionsTravelMode.DRIVING
      };

      directionsService.route(request, function(response, status)
      {
      if (status == google.maps.DirectionsStatus.OK)
      {
        directionsDisplay.setDirections(response);
        distance = "The distance between the two points on the chosen route is: "+response.routes[0].legs[0].distance.text;
        distance += "<br/>The aproximative driving time is: "+response.routes[0].legs[0].duration.text;
        document.getElementById("distance_road").innerHTML = distance;
         }
      });

        // create the markers for the two locations
        var marker1 = new google.maps.Marker({
          map: map,
          position: location1,
          title: "First location"
      });

        var marker2 = new google.maps.Marker({
          map: map,
          position: location2,
          title: "Second location"
      });

        // create the text to be shown in the infowindows
        var orgintext = '<div id="content">'+
            '<h1 id="firstHeading">First location</h1>'+
            '<div id="bodyContent">'+
            '<p>Coordinates: '+location1+'</p>'+
            '<p>Address: '+orgin+'</p>'+
            '</div>'+
            '</div>';

        var destinationtext = '<div id="content">'+
          '<h1 id="firstHeading">Second location</h1>'+
          '<div id="bodyContent">'+
          '<p>Coordinates: '+location2+'</p>'+
          '<p>Address: '+destination+'</p>'+
          '</div>'+
          '</div>';

        // create info boxes for the two markers
        var infowindow1 = new google.maps.InfoWindow({
          content: orgintext
        });
        var infowindow2 = new google.maps.InfoWindow({
          content: destinationtext
        });
        // add action events so the info windows will be shown when the marker is clicked
          google.maps.event.addListener(marker1, 'click', function() {
            infowindow1.open(map,marker1);
          });
          google.maps.event.addListener(marker2, 'click', function() {
            infowindow2.open(map,marker1);
          });

          /*// compute distance between the two points
          var R = 6371;
          var distanceLat = toRad(location2.lat()-location1.lat());
          var distanceLon = toRad(location2.lng()-location1.lng());

          var distanceLat1 = toRad(location1.lat());
          var distanceLat2 = toRad(location2.lat());

          var a = Math.sin(distanceLat/2) * Math.sin(distanceLat/2) +
              Math.cos(distanceLat1) * Math.cos(distanceLat1) *
              Math.sin(distanceLon/2) * Math.sin(distanceLon/2);
          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          var d = R * c;*/

          document.getElementById("distancetraveled").innerHTML = d;
        }
    function toRad(deg){
      return deg * Math.PI/180;
      }
