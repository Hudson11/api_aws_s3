const router = require('express').Router()
const S3Controller = require('../controllers/S3Controller');
const multer = require('multer')

router.get('/', S3Controller.listBuckets)
router.delete('/:bucket', S3Controller.deleteBucket)
router.post('/', S3Controller.createBucket)
router.get('/:bucket/objects', S3Controller.listBUcketObjects)
router.post('/:bucket/upload', multer().single('file'), async (req, res, next) => {
    if(!req.file)
        return res.json({error: "Required File"})
    S3Controller.uploadArqBucket(req.file, req, res)
})
router.delete('/:bucket/:key', S3Controller.removeBucketObject)

module.exports = router;