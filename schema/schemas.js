const mongoose = require('mongoose');
const config = require('../config/config');

const readingSchema = new mongoose.Schema({
    time: { type: Number, required: false },
    location: { lat: { type: Number }, lon: { type: Number }, required: false },
    speed: { type: Number, required: false },
    speedLimit: { type: Number, required: false }
});

const tripSchema = new mongoose.Schema({
    id: { type: String, required: false },
    start: { time: { type: Date }, lat: { type: Number }, lon: { type: Number }, address: { type: String }, required: false },
    end: { time: { type: Date }, lat: { type: Number }, lon: { type: Number }, address: { type: String }, required: false },
    distance: { type: Number, required: false },
    duration: { type: Number, required: false },
    overspeedsCount: { type: Number, required: false },
    boundingBox: [{ lat: { type: Number }, lon: { type: Number }, required: false }]

});

const readingListSchema = new mongoose.Schema({ 
    readings: [readingSchema]
});

const tripListSchema = new mongoose.Schema({
    trips: [tripSchema]
});

const validationErrorSchema = (statusCode, errorCode, srcMessage, translatedMessage) => {
    return {
        statusCode,
        errorCode,
        srcMessage,
        translatedMessage        
    }
};

const trip = mongoose.model('trip', tripSchema);

module.exports = ({
    readingSchema,
    trip,
    readingListSchema,
    tripListSchema,
    validationErrorSchema,
    mongoose
})
