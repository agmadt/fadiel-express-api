const { validations, validateAll } = require('indicative/validator')
const { sanitizations, sanitize } = require('indicative/sanitizer')
const IndicativeErrorFormatter = require('../helpers/IndicativeErrorFormatter');
const aws = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { Media } = require('../models/Models');
const StoreMediaValidator = require('../validators/StoreMediaValidator')

const MediaController = {

  store: async (req, res) => {
    const s3 = new aws.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    req.body.file = req.file

    validateAll(req.body, StoreMediaValidator.rules, IndicativeErrorFormatter.messages())
    .then( async(data) => {
      s3.upload({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: uuidv4() + path.extname(req.file.originalname),
        Body: req.file.buffer,
        ACL: 'public-read',
        ContentType: req.file.mimetype
      }, async function(err, data) {
        if (err) throw err;
        const uploadedMedia = await Media.create({
          'filename': data.Key,
          'location': data.Location,
          'type': req.file.mimetype
        });

        return res.json({
          id: uploadedMedia.id,
          location: data.Location
        })
      });
    })
    .catch((err) => {
      return res.status(422).json({
        message: 'The given data was invalid',
        errors: IndicativeErrorFormatter.format(err)
      })
    });
  }
}

module.exports = MediaController;