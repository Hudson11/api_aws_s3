const s3Controller = require('./controllers/S3Controller')

//s3Controller.createBucket({name: 'bucket-random-teste'})
//s3Controller.deleteBucket({name: 'bucket-random-teste'})
s3Controller.listBuckets()