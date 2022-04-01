
const express = require('express');
const config = require('./config/config');
const schemas = require('./schema/schemas');
const app = express()
const port = config.API_PORT;

// Just for Control and Debug
console.log(`Your port is ${config.API_PATH}`); // 8626
const database = config.DB_PATH+':'+config.DB_PORT+config.DB_TABLE;
console.log("MongoDB: "+database);

main().catch(err => console.log(err));

async function main() {    
    await schemas.mongoose.connect(database);
};

const handleError = function (res, err) {
    console.log(err);
    res.status(404).send(schemas.validationErrorSchema(404,4,'Handler Error', 'Error de manejo'));
};

app.get(config.API_PATH, (req, res) => {
    // Assume that if the values are not defined, then make the query in full mode.
    let { start_gte=0, start_lte, distance_gte=0, limit, offset=0 } = req.query;
         
    start_gte = new Date(Number(start_gte));
    
    const query = schemas.trip.
    find({}).
    where('start.time').gt(start_gte).
    where('distance').gt(distance_gte);

    if(start_lte) {
        start_lte = new Date(Number(start_lte));
        query.where('start.time').lt(start_lte);
    }
    
    query.sort({ 'start.time': 'ascending' });

    query.exec(function (err, trip) {
        if (err) {
            return handleError(res, err);
        };

        console.log('Trip:', trip);

        if ( trip.length <= offset ) {
            res.status(422).send(schemas.validationErrorSchema(422,22,'Offset Error, is bigger than length result', 'Error de offset, es mayor que el largo del resultado'));
            return;
        };

        if( !limit ) {
            limit = trip.length;
        };

        
        let filterElements = trip.splice(offset, limit);
        console.log('Trip offset:', filterElements);
        res.status(200).send(filterElements);
    });
    
    // const silence = new schemas.trip({ start: {time:120}, distance: 666 });
    // console.log(silence.distance); // 'Silence'
    // silence.save().then(console.log("Fin"));

    // const silence2 = new schemas.trip({ start: {time:100}, distance: 22 });
    // console.log(silence2.distance); // 'Silence'
    // silence2.save().then(console.log("Fin"));

})

app.post('/', function (req, res) {
    res.send('Got a POST request');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
