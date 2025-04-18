const mongoose = require('mongoose');
const User = require('./user');

const reportschema = mongoose.Schema({
  reports: [{
    report: { 
      type: String, 
      required: true 
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
});

const Report = mongoose.model('Report', reportschema);
module.exports = Report;
