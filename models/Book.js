const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    comments: { type: [String], default: [] }
  },
  { versionKey: false }
);

BookSchema.virtual('commentcount').get(function () {
  return this.comments.length;
});
BookSchema.set('toJSON', { virtuals: true });
BookSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Book', BookSchema);
