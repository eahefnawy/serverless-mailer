/**
 * Serverless Helpers JS
 */


var ServerlessHelpers = {

  // Load Environment Variables
  loadEnv: function() {
    require('./env');
  }

};

// Export
module.exports = ServerlessHelpers;