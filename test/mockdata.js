const trip1 = {
  start: {
      time: '2022-01-18T19:05:28.000Z',
      lat: -33.580158,
      lon: -70.567227,
      address: 'Avenida Apoquindo 291'
  },
  end: {
      time: '2022-01-20T22:35:28.000Z',
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
  start: {
      time: '2022-03-22T11:05:28.000Z',
      lat: -33.580158,
      lon: -70.567227,
      address: 'Avenida La Florida 923'
  },
  end: {
      time: '2022-04-28T17:15:28.000Z',
      lat: -33.580462,
      lon: -70.567177,
      address: 'Avenida El Peñón 65'
  },
  distance: 54.8,
  duration: 1500000,
  overspeedsCount: 2,
  boundingBox: [
      { lat: -33.580462, lon: -70.567177 },
      { lat: -33.580432, lon: -70.567147 },
      { lat: -33.580432, lon: -70.567147 },
      { lat: -33.580433, lon: -70.567144 }
  ]
};

const readings = {
  "readings":[
      {
          "time": 1642500462000,
          "speed": 9,
          "speedLimit": 38,
          "location":{
              "lat": -33.519926,
              "lon": -70.703759
          }
      },
      {
          "time": 1642500462001,
          "speed": 49,
          "speedLimit": 38,
          "location":{
              "lat": -33.531937,
              "lon": -70.681475
          }
      },
      {
          "time": 1642500462002,
          "speed": 9,
          "speedLimit": 38,
          "location":{
              "lat": -33.478762,
              "lon": -70.655820
          }
      },
      {
          "time": 1642500462003,
          "speed": 99,
          "speedLimit": 38,
          "location":{
              "lat": -33.478119,
              "lon": -70.685454
          }
      },
      {
          "time": 1642500462004,
          "speed": 99,
          "speedLimit": 38,
          "location":{
              "lat": -33.519971,
              "lon": -70.703759
          }
      }
  ]
};

const resultsResponse = {
    start: {
      time: '2022-01-18T10:07:42.000Z',
      lat: -33.519926,
      lon: -70.703759,
      address: 'General Velásquez, José María Caro Rodríguez, Lo Espejo, Provincia de Santiago, Región Metropolitana de Santiago, 9140110, Chile'
    },
    end: {
      time: '2022-01-18T10:07:42.004Z',
      lat: -33.519971,
      lon: -70.703759,
      address: 'General Velásquez, José María Caro Rodríguez, Lo Espejo, Provincia de Santiago, Región Metropolitana de Santiago, 9140110, Chile'
    },
    distance: 16.554,
    duration: 4,
    overspeedsCount: 2,
    boundingBox: [
      { lat: -33.531937, lon: -70.703759 },
      { lat: -33.531937, lon: -70.65582 },
      { lat: -33.478119, lon: -70.703759 },
      { lat: -33.478119, lon: -70.65582 }
    ]
};

module.exports = ( { 
  trip1,
  trip2,
  readings,
  resultsResponse
})