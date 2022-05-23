var express = require('express');
var app = express();
var axios = require('axios');
var  GeoPoint = require('geopoint');

function distanceOfUserFromLondon(user) {
    var london = { latitude: 51.50853, longitude: -0.12574 };
    var point1 = new GeoPoint(london.latitude, london.longitude);
    var point2 = new GeoPoint(user.latitude*1, user.longitude*1);
    return point1.distanceTo(point2, false);
}

app.get('/', function (req, res) {
    res.send('Make a get request to /london-users to get the users in London');
});

app.get('/london-users', async function (req, res) {
    try {
        // get the users in london
        var apiResponse = await axios.get('https://bpdts-test-app.herokuapp.com/city/London/users');
        var londonUsers = apiResponse.data;

        // get all the users
        var apiResponse = await axios.get('https://bpdts-test-app.herokuapp.com/users');
        var allUsers = apiResponse.data;

        // only select those that live less than 50m away
        allUsers.forEach(function (user) {
            var distance = distanceOfUserFromLondon(user);
            if (distance < 50) {
                londonUsers.push(user);
            }
        });

        res.send(londonUsers);
    } catch (error) {
        res.status(500).json({message: error});
    }
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});