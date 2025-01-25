/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require('mongoose');
const Book = require('../models/bookModel');
const asyncHandler = require('express-async-handler');

module.exports = function (app) {

  app.route('/api/books')
    .get(asyncHandler(async (req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      let allBooks = [];
         
      try {    
        //const showAll = await Book.find({}, 
          
         }
      
         catch (e) {
          console.log(e.message);
          res.status(500).json({message: e.message});  }
         
    }))
    
    .post(asyncHandler(async (req, res) => {
      let title = req.body.title;

      if (!title)
        {return res.status(201).json({error: "missing required field title"}) }

     try { 
      let newBook = new Book({
        title: req.body.title,
      }) 
 
      const addBook = await newBook.save();
      res.status(201).json(addBook);
     }
     catch (e) {
      console.log(e.message);
      res.status(500).json({message: e.message});  }  
      //response will contain new book object including at least _id and title
    }))

    //delete all books
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
  //get one book
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    //add comment function
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;

      /*await MyModel.updateOne(
        { _id: myDoc._id }, 
        { $push: { comments: 'another string' } });

      */

      //json res format same as .get
    })

    //delete one book
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
