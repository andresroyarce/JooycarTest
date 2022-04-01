
module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
  ***************************************************************************/

  connections: {
    mongo: {
      adapter: 'sails-mongo',
      host: process.env.MONGO_URI,
      port: 27017,
      database: 'anaconda'
    }
  },

  models: {
    connection: 'mongo'
  },
  mailgunKey: 'key-7f3aa45707398cbf992f9495a3d54671',

};
