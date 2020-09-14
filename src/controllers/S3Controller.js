const AWS = require('../config/AwsInstance')
const uuid = require('uuid')

class S3Controller {

  constructor() { }

  createBucket(req, res) {
    var bucketPromise = new AWS.S3({ apiVersion: '2006-03-01' })
    if (!req.body.name)
      return res.json({ error: "Field name is empty" })
    bucketPromise.createBucket({
      Bucket: req.body.name
    }).promise().then((data) => {
      console.log(data)
      return res.json(data)
    }).catch((err) => {
      return res.status(400).json({ erro: 'Error', stack: err.stack })
    })
  }

  deleteBucket(req, res) {
    var bucketPromise = new AWS.S3({ apiVersion: '2006-03-01' })
    const { bucket } = req.params
    bucketPromise.listObjects({
      Bucket: bucket
    }, (err, data) => {
      if (err){
        return res.status(400).json(err)
      }
      else{
        let list = []
        if(data.Contents.length > 0){
          data.Contents.map((value) => list.push({Key: value.Key}))
          bucketPromise.deleteObjects({
            Bucket: bucket,
            Delete: {
              Objects: list
            },
          }, (err, data) => {
            if(err){
              return res.status(400).json(err)
            }
            else{
              bucketPromise.deleteBucket({
                Bucket: bucket
              }, (err, data) => {
                if(err)
                  return res.status(400).json(err)
                return res.json(data)
              })
            }
          })
        }
        else{
          bucketPromise.deleteBucket({
            Bucket: bucket
          }, (err, data) => {
            if(err)
              return res.status(400).json(err)
            return res.json(data)
          })
        }
      }
    })
  }


  listBuckets(req, res) {
    var bucketPromise = new AWS.S3({ apiVersion: '2006-03-01' })
    bucketPromise.listBuckets().promise().then((data) => {
      return res.json(data)
    }).catch((err) => {
      return res.status(400).json({ erro: 'Error', stack: err.stack })
    })
  }

  listBUcketObjects(req, res) {
    var bucketPromise = new AWS.S3({ apiVersion: '2006-03-01' })
    const { bucket } = req.params
    bucketPromise.listObjects({
      Bucket: bucket
    }, (err, data) => {
      if (err)
        return res.status(400).json(err)
      return res.json(data)
    })
  }

  uploadArqBucket(req, res) {
    var bucketPromise = new AWS.S3({ apiVersion: '2006-03-01' })
    const { bucket } = req.params
    if (!req.file)
      return res.json({ error: "Required File" })
    if (!bucket)
      return res.json({ error: 'error', message: 'bucket: required field' })
    bucketPromise.upload({
      Bucket: bucket,
      Key: `${uuid.v4()}-${req.file.originalname}`,
      Body: req.file.buffer,
    }, (err, data) => {
      if (err)
        return res.status(500).json({ error: 'error' })
      return res.json(data)
    })
  }

  removeBucketObject(req, res) {
    var bucketPromise = new AWS.S3({ apiVersion: '2006-03-01' })
    const { bucket, key } = req.params
    if (!bucket)
      return res.json({ error: 'error', message: 'bucket: required field' })
    else if (!key)
      return res.json({ error: 'error', message: 'key: required field' })
    bucketPromise.deleteObject({
      Bucket: bucket,
      Key: key,
    }, (err, data) => {
      if (err)
        return res.status(500).json({ error: err })
      return res.json(data)
    })
  }

  getBucketObject(req, res) {
    var bucketPromise = new AWS.S3({ apiVersion: '2006-03-01' })
    const { bucket, key } = req.params
    if (!bucket)
      return res.json({ error: 'error', message: 'bucket: required field' })
    else if (!key)
      return res.json({ error: 'error', message: 'key: required field' })
    bucketPromise.getSignedUrl('getObject', {
      Bucket: bucket,
      Key: key
    }, (err, url) => {
      if (err)
        return res.status(500).json({ error: err })
      return res.json({url: url})
    })
  }

}

module.exports = new S3Controller()