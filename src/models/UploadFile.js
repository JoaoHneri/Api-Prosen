const mongoose = require('mongoose');

const UploadFile = mongoose.model('uploadfile', {
    name: String,
    size: Number,
    key: String,
    url: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports =  UploadFile ;
  