/*
*
*
*       Complete the API routing below
*       
*       
*/

"use strict";
const mongoose = require("mongoose");
const Book = require("../models/bookModel");
const asyncHandler = require("express-async-handler");

module.exports = function (app) {

  app.route("/api/books")
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
        { return res.status(201).json("missing required field title") }

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
      //if successful response will be "complete delete successful"
      try {
        const deleteAll = await Book.deleteMany({ library: "books" })

        if (!deleteAll)
          { 
            return res.status(201).json("no book exists") 
          };
        
       res.status(201).json("complete delete successful");
       
      }

      catch (e) {
        console.log(e.message);
        if (e.message.includes("Cast to ObjectId failed"))
          
          {return res.json("no book found") }
        res.status(500).json({message: e.message});  
      }  
    }));



  app.route("/api/books/:id")
  //get one book
    .get(asyncHandler(async (req, res) => {
      let bookid = req.params.id;      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
   
        try {    
             const getOne = await Book.findById(bookid);

             if (!getOne) 
             { return res.status(201).json("no book exists") };

            
            res.status(201).json(getOne);  
         }
      
         catch (e) {
          console.log(e.message);
          if (e.message.includes("Cast to ObjectId failed"))
          {
            return res.status(201).json("no book exists")
          }
          else { res.status(500).json({message: e.message});      }
        }
      

    }))

    //add comment function
    .post(asyncHandler(async (req, res) =>{
      let comment = req.body.comment;
      let bookid = req.params.id;
      try {
        let getNew = await Book.findByIdAndUpdate(	bookid, {$push: {comments: comment}}, {new: true});

        if (!getNew) {
          res.status(201).json("no book exists")
        }

        if (!comment)
          {res.status(201).json("missing required field comment")}


       else {let counter = getNew.comments.length
        let addTo = await Book.findByIdAndUpdate(	bookid, {$set: {commentcount: counter}}, {new: true});

          res.json(addTo) }
        
            }//end try

    catch (e) {
          if (e.message.includes("Cast to"))
          {res.status(500).json("no book exists")}
          else {
           res.status(500).json({message: e.message}); } 
          }
    
      //json res format same as .get
    }))

    //delete one book
    .delete(asyncHandler(async (req, res) =>{
     // let bookid = req.body.id;
      //if successful response will be "delete successful"

      try {

      const id = req.params.id;
      const deleteOne = await Book.findByIdAndDelete(id);

      if (!deleteOne)
      { return res.status(201).json("no book exists") };
       res.status(201).json("delete successful");
      }

      catch (e) {
        console.log(e.message);

        if (e.message.includes("Cast to ObjectId failed"))
          
          {return res.status(201).json("no book found") }

        res.status(500).json({message: e.message});  
      }  

    }));
  
};
