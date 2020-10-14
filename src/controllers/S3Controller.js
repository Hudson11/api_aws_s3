const AWS = require('../config/AwsInstance')
const uuid = require('uuid')
const sharp = require('sharp')
require('dotenv').config()

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
      if (err) {
        return res.status(400).json(err)
      }
      else {
        let list = []
        if (data.Contents.length > 0) {
          data.Contents.map((value) => list.push({ Key: value.Key }))
          bucketPromise.deleteObjects({
            Bucket: bucket,
            Delete: {
              Objects: list
            },
          }, (err, data) => {
            if (err) {
              return res.status(400).json(err)
            }
            else {
              bucketPromise.deleteBucket({
                Bucket: bucket
              }, (err, data) => {
                if (err)
                  return res.status(400).json(err)
                return res.json(data)
              })
            }
          })
        }
        else {
          bucketPromise.deleteBucket({
            Bucket: bucket
          }, (err, data) => {
            if (err)
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
      return res.json({ url: url })
    })
  }

  getBucketObjectQuery(req, res) {
    var bucketPromise = new AWS.S3({ apiVersion: '2006-03-01' })
    const { key } = req.query
    const { bucket } = req.params
    if (!bucket)
      return res.json({ error: 'error', message: 'bucket: required field' })
    else if (!key)
      return res.json({ error: 'error', message: 'key: required field' })
    bucketPromise.getSignedUrl('getObject', {
      Bucket: bucket,
      Key: key
    }, (err, data) => {
      if (err) {
        return res.status(400).json(err)
      }
      return res.status(200).json({ url: data })
    })
  }

  removeBucketObjectQuery(req, res) {
    var bucketPromise = new AWS.S3({ apiVersion: '2006-03-01' })
    const { key } = req.query
    const { bucket } = req.params
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

  async rekognitionUpload(req, res) {
    try {
      var s3 = new AWS.S3({ apiVersion: '2006-03-01' })
      var rekoginition = new AWS.Rekognition()

      if (!req.file) {
        return res.json({ error: "Required File" })
      }

      const { originalname, minetype } = req.file
      const key = `${uuid.v4()}-${originalname}`
      const bucket = 'serverless-rekognition-person'

      await s3.upload({
        Bucket: bucket,
        Key: key,
        Body: req.file.buffer,
        ContentType: minetype,
      }).promise()

      const params = {
        Image: {
          S3Object: {
            Bucket: bucket,
            Name: key
          }
        }
      }

      const keys = []
      var count = 0

      const faces = await rekoginition.detectFaces(params).promise()

      if (faces.FaceDetails.length > 0) {
        await Promise.all(faces.FaceDetails.map(async value => {
          const { Width, Height, Left, Top } = value.BoundingBox

          const image = await s3.getObject({
            Bucket: bucket,
            Key: key,
          }).promise()

          const { width, height, format } = await sharp(image.Body).metadata()

          const coords = {
            width: parseInt(width * Width) | 0,
            height: parseInt(height * Height) | 0,
            left: parseInt(width * Left) | 0,
            top: parseInt(height * Top) | 0
          }

          const buffer = await sharp(image.Body).extract(coords).toBuffer()
          const newKey = `faces/${key}-${count++}.${format}`

          await s3.putObject({
            Bucket: bucket,
            Key: newKey,
            Body: buffer,
            ContentType: `image/${format}`
          }).promise()

          const url = s3.getSignedUrl('getObject', {
            Bucket: bucket,
            Key: newKey,
          })

          keys.push({ key: newKey, url: url})
        }))
      } else {
        await s3.deleteObject({
          Bucket: bucket,
          Key: key
        }).promise()
      }
      return res.status(200).json(keys)
    } catch (err) {
      return res.status(400).json(err)
    }
  }

}

module.exports = new S3Controller()