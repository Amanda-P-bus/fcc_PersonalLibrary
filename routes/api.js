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
          
         let getRes = (results ) => results.forEach((result) => {
            let book = result.toJSON()
            book["commentcount"] = book.comments.length
            allBooks.push(book)
          }) 

          const showAll = await Book.find(getRes)
          res.json(allBooks);
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
        comments: []
      }) 
 
      const addBook = await newBook.save();
      res.status(201).json(addBook);
     }
     catch (e) {
      console.log(e.message);
      res.status(500).json({message: e.message});  }  
      //response will contain new book object including at least _id and title
    }))
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
