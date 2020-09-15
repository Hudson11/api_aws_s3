const router = require('express').Router()
const S3Controller = require('../controllers/S3Controller');
const AuthController = require('../controllers/AuthController')
const multer = require('multer')

router.get('/', AuthController.tokenVerify, S3Controller.listBuckets)
router.delete('/:bucket', AuthController.tokenVerify, S3Controller.deleteBucket)
router.post('/', AuthController.tokenVerify, S3Controller.createBucket)
router.get('/:bucket/objects', AuthController.tokenVerify, S3Controller.listBUcketObjects)
router.post('/:bucket/upload', AuthController.tokenVerify, multer().single('file'), S3Controller.uploadArqBucket)
router.delete('/:bucket/:key', AuthController.tokenVerify, S3Controller.removeBucketObject)
router.get('/:bucket/:key', AuthController.tokenVerify, S3Controller.getBucketObject)

module.exports = router;