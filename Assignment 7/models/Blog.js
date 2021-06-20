const { Schema, model } = require('mongoose');

const blogSchema = Schema({
  heading: {
    type: String,
    required: true,
  },
  blog: {
    type: String,
    required: true,
  },
  userID: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

module.exports = model('blog', blogSchema);
