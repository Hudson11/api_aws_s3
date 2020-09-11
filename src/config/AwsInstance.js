var AWS = require('aws-sdk');
require('dotenv').config()
// configure access key e secret access key
AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey
})

module.exports = AWS