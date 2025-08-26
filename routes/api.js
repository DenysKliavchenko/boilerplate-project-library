/*
*
*       Complete the API routing below
*
*/

'use strict';

const Book = require('../models/Book');

module.exports = function (app) {

  app.route('/api/books')
    // GET all books: [{ _id, title, commentcount }]
    .get(async function (req, res){
      try {
        const books = await Book.find({}, { title: 1, comments: 1 });
        const list = books.map(b => ({
          _id: b._id,
          title: b.title,
          commentcount: b.comments.length
        }));
        res.json(list);
      } catch (e) {
        res.status(500).json({ error: 'server error' });
      }
    })
    
    // POST create book: body { title }
    .post(async function (req, res){
      try {
        const title = req.body.title;
        if (!title) return res.send('missing required field title');
        const book = await Book.create({ title });
        res.json({ _id: book._id, title: book.title });
      } catch (e) {
        res.status(500).json({ error: 'server error' });
      }
    })
    
    // DELETE all books
    .delete(async function(req, res){
      try {
        await Book.deleteMany({});
        res.send('complete delete successful');
      } catch (e) {
        res.status(500).json({ error: 'server error' });
      }
    });

  app.route('/api/books/:id')
    // GET one book: { _id, title, comments: [] }
    .get(async function (req, res){
      try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.send('no book exists');
        res.json({ _id: book._id, title: book.title, comments: book.comments });
      } catch (e) {
        // Якщо некоректний ObjectId
        res.send('no book exists');
      }
    })
    
    // POST add comment to book
    .post(async function(req, res){
      try {
        const comment = req.body.comment;
        if (!comment) return res.send('missing required field comment');

        const book = await Book.findById(req.params.id);
        if (!book) return res.send('no book exists');

        book.comments.push(comment);
        await book.save();

        res.json({ _id: book._id, title: book.title, comments: book.comments });
      } catch (e) {
        res.send('no book exists');
      }
    })
    
    // DELETE one book
    .delete(async function(req, res){
      try {
        const deleted = await Book.findByIdAndDelete(req.params.id);
        if (!deleted) return res.send('no book exists');
        res.send('delete successful');
      } catch (e) {
        res.send('no book exists');
      }
    });
};
