const { app, dbMongo } = require('./app');
const config = require('./config/config');

// Just for Control and Debug
console.log(`Your port is ${config.API_PATH}`); // 8626
const database = config.DB_PATH + ':' + config.DB_PORT + '/' + config.DB_TABLE;
console.log("MongoDB: " + database);


main().catch(err => console.log(err));

async function main() {
    await dbMongo.connect(database);
};


const server = app.listen(config.API_PORT, () => {
    console.log(`Jooycar API Test listening in port: ${config.API_PORT}`);
});
