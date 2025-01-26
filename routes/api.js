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
  //get all books
    .get(asyncHandler(async (req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      let allBooks = req.params.library;
         
      try {    
  
      let filterResults = Object.assign(req.query);
          filterResults["books"] = allBooks
          
          const getBooks = await Book.find(filterResults);
          res.status(201).json(getBooks);
          
         }
      
         catch (e) {
          console.log(e.message);
          res.status(500).json({message: e.message});  }
         
    }))
 //add new book   
    .post(asyncHandler(async (req, res) => {
      let title = req.body.title;

      if (!title)
        { return res.status(201).json({error: "missing required field title"}) }

     try { 
      let newBook = new Book({
        title: req.body.title,
      }) 
 
      const addBook = await newBook.save();
      //return only id and book title
      res.status(201).json({ _id: addBook.id, title: addBook.title });

     }
     catch (e) {
      console.log(e.message);
      res.status(500).json({message: e.message});  
    }  
      //response will contain new book object including at least _id and title
    }))

    //delete all books
    .delete(asyncHandler(async (req, res) => {
      //if successful response will be 'complete delete successful'
    }));



  app.route('/api/books/:id')
  //get one book
    .get(asyncHandler(async (req, res) => {
      let bookid = req.params.id;      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
   
        try {    
             const getOne = await Book.findById(bookid);

             if (!getOne) 
             { return res.status(201).json({ error: 'no book exists' }) };

            
            res.status(201).json(getOne);  
         }
      
         catch (e) {
          console.log(e.message);
          if (e.message.includes('Cast to ObjectId failed'))
          {
            return res.status(201).json({ error: 'no book exists' })
          }
          else { res.status(500).json({message: e.message});      }
        }
      

    }))

    //add comment function
    .post(asyncHandler(async (req, res) =>{
    
      try {
        let bookid = req.params.id;
        let id = req.body._id;
        let comment = req.body.comment;

        const getOne = await Book.findById(bookid);

        let arrLength = getOne.comments.length;

        if (comment.length === 0 && getOne.comments.length === 0) 
          { return res.status(201).json({ error: 'mising required field comment' }) } 

        else {
          
          const addComment = await Book.updateOne(
            { _id: bookid }, 
            { $push: { comments: comment } });
          const updateCount = await Book.updateOne(
            { _id: bookid },
            { $set: { commentcount: arrLength } });

            //finds the book again to show all comments in the returned array
            let findAgain = await Book.findById(bookid)

              res.status(201).json({title: findAgain.title, _id: findAgain._id, comments: findAgain.comments, commentcount: findAgain.commentcount});
            }
          

          //    let resSuccess = "successfully updated";
            //  res.status(201).json({result: resSuccess, _id: bookid});
            }

      catch (e) {
        let comment = req.body.comment;

        console.log(e.message);
        if (e.message.includes('Cannot set headers'))
          {
            return res.status(201).json({ error: 'missing required field comment' })}
        
        if (e.message.includes('Cannot read properties'))
              {
                return res.status(201).json({ error: 'no book exists' })}
        
        if (e.message.includes('Cast to ObjectId failed'))
        {
          return res.status(201).json({ error: 'no book exists' })
        }
        else { res.status(500).json({message: e.message});      }
      }

      //json res format same as .get
    }))

    //delete one book
    .delete(asyncHandler(async (req, res) =>{
     // let bookid = req.body.id;
      //if successful response will be 'delete successful'

      try {

      const id = req.params.id;
      const deleteOne = await Book.findByIdAndDelete(id);

      if (!deleteOne)
      { return res.status(201).json({ error: 'no book exists' }) };
       res.status(201).json({message: 'delete successful'});
      }

      catch (e) {
        console.log(e.message);
          if (e.message.includes('Cast to ObjectId failed'))
          {
            return res.status(201).json({ error: 'no book found' })
          }
        res.status(500).json({message: e.message});  
      }  

    }));
  
};
