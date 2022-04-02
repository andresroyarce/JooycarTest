const express = require('express');
const bodyParser = require('body-parser');
const status = require('http-status');
const geolib = require('geolib');
const nodeGeocoder = require('node-geocoder');
const config = require('./config/config');
const schemas = require('./schema/schemas');
const app = express();
const port = config.API_PORT;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

// Just for Control and Debug
console.log(`Your port is ${config.API_PATH}`); // 8626
const database = config.DB_PATH + ':' + config.DB_PORT + '/' + config.DB_TABLE;
console.log("MongoDB: " + database);

let options = {
    provider: 'openstreetmap'
};
let geoCoder = nodeGeocoder(options);

main().catch(err => console.log(err));

async function main() {
    await schemas.mongoose.connect(database);
};

const handleError = function (res, err) {
    console.log(err);
    res.status(status.BAD_REQUEST).send(schemas.validationErrorSchema(status.BAD_REQUEST, 20, 'Handler Error', 'Error de manejo'));
};

app.get(config.API_PATH, (req, res) => {
    // Assume that if the values are not defined, then make the query in full mode.
    let { start_gte = 0, start_lte, distance_gte = 0, limit, offset = 0 } = req.query;

    start_gte = new Date(Number(start_gte));

    const query = schemas.trip.
        find({}).
        where('start.time').gt(start_gte).
        where('distance').gt(distance_gte);

    if (start_lte) {
        start_lte = new Date(Number(start_lte));
        query.where('start.time').lt(start_lte);
    }

    query.sort({ 'start.time': 'ascending' });

    query.exec(function (err, trip) {
        if (err) {
            return handleError(res, err);
        };

        console.log('Trip:', trip);

        if (trip.length <= offset) {
            res.status(status.REQUESTED_RANGE_NOT_SATISFIABLE).send(schemas.validationErrorSchema(status.REQUESTED_RANGE_NOT_SATISFIABLE, 22, 'Offset Error, is bigger than length result', 'Error de offset, es mayor que el largo del resultado'));
            return;
        };

        if (!limit) {
            limit = trip.length;
        };


        let filterElements = trip.splice(offset, limit);
        console.log('Trip offset:', filterElements);
        res.status(status.OK).send(filterElements);
    });

});

app.get('/mock', (req, res) => {
    const trip1 = {
        //'_id': '5efc0d7da7076973f1515120',
        start: {
            time: 1642539928000,
            lat: -33.580158,
            lon: -70.567227,
            address: 'Avenida Apoquindo 291'
        },
        end: {
            time: 1642541428000,
            lat: -33.580462,
            lon: -70.567177,
            address: 'Avenida Grecia 1043'
        },
        distance: 10.4,
        duration: 1500000,
        overspeedsCount: 2,
        boundingBox: [
            { lat: -33.580462, lon: -70.567177 },
            { lat: -33.580432, lon: -70.567147 },
            { lat: -33.580432, lon: -70.567147 },
            { lat: -33.580433, lon: -70.567144 }
        ]
    };

    const trip2 = {
        '_id': '5efc0d7da7076973f1515333',
        start: {
            time: 1642539929000,
            lat: -33.580158,
            lon: -70.567227,
            address: 'Avenida La Florida 923'
        },
        end: {
            time: 1642541428000,
            lat: -33.580462,
            lon: -70.567177,
            address: 'Avenida El Peñón 65'
        },
        distance: 10.4,
        duration: 1500000,
        overspeedsCount: 2,
        boundingBox: [
            { lat: -33.580462, lon: -70.567177 },
            { lat: -33.580432, lon: -70.567147 },
            { lat: -33.580432, lon: -70.567147 },
            { lat: -33.580433, lon: -70.567144 }
        ]
    };

    const tripMock1 = new schemas.trip(trip1);
    const tripMock2 = new schemas.trip(trip2);

    tripMock1.save().then(console.log("Fin 1"));
    tripMock2.save().then(console.log("Fin 2"));

    res.send('Mock data saved');
});

app.post(config.API_PATH, function (req, res, next) {
    const readings = req.body.readings;
    if (readings.length < 5) {
        res.status(status.BAD_REQUEST).send(schemas.validationErrorSchema(status.BAD_REQUEST, 22, 'Need it at least 5 Readings', 'Se Necesitan al menos 5 Lecturas'));
        console.log("Missing Readings: " + readings.length);
        return;
    }

    const timeProperty = readings.filter(reading => {
        if (typeof reading.time === 'undefined') {
            return true;
        }
        return false;
    });

    if (timeProperty.length > 0) {
        res.status(status.PRECONDITION_FAILED).send(schemas.validationErrorSchema(status.PRECONDITION_FAILED, 28, 'Some Readings have the time property missing', 'Algunas Lecturas no poseen la propiedad de tiempo'));
        return next();
    }

    let readingmaxTime = { time: 0 };
    let readingminTime = { time: (8640000000000000) };
    let overspeeds = 0;
    let flagOverspeed = false;
    let locations = [];
    for (const reading of readings) {
        readingmaxTime = reading.time > readingmaxTime.time ? reading : readingmaxTime;
        readingminTime = reading.time < readingminTime.time ? reading : readingminTime;
        if (reading.speed > reading.speedLimit) {
            if (!flagOverspeed) {
                overspeeds++;
                flagOverspeed = true;
            };
        } else {
            flagOverspeed = false;
        };
        locations.push(reading.location);
    };

    let bounding = geolib.getBounds(locations);
    let distance = geolib.getPathLength(locations);

    // Epoch in miliseconds according to examples      
    const tripDoc = {};
    tripDoc.start = { time: readingminTime.time, ...readingminTime.location };
    tripDoc.end = { time: readingmaxTime.time, ...readingmaxTime.location };
    tripDoc.duration = tripDoc.end.time - tripDoc.start.time;
    tripDoc.distance = distance / 1000;
    tripDoc.overspeedsCount = overspeeds;

    tripDoc.boundingBox = [];
    tripDoc.boundingBox.push({ lat: bounding.minLat, lon: bounding.minLng });
    tripDoc.boundingBox.push({ lat: bounding.minLat, lon: bounding.maxLng });
    tripDoc.boundingBox.push({ lat: bounding.maxLat, lon: bounding.minLng });
    tripDoc.boundingBox.push({ lat: bounding.maxLat, lon: bounding.maxLng });

    //console.log(tripDoc);

    geoCoder.reverse(readingmaxTime.location)
        .then((resp) => {
            tripDoc.end.address = resp[0].formattedAddress;

            geoCoder.reverse(readingminTime.location)
                .then((respt) => {
                    tripDoc.start.address = respt[0].formattedAddress;

                    let tripPost = new schemas.trip(tripDoc);
                    tripPost.validate(function (err) {
                        if (err) handleError(res, err);
                        else {                            
                            tripPost.save().then(res.status(status.OK).send(tripPost));
                            return next();
                        }
                    });

                })
                .catch((err) => {
                    handleError(res, err);
                });
        })
        .catch((err) => {
            handleError(res, err);
        });

});

app.listen(port, () => {
    console.log(`Jooycar API Test listening in port: ${port}`);
});
