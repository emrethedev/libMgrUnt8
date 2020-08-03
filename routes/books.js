/* Imports & Dependencies */
const express = require("express");
const router = express.Router();
const Book = require("../models").Book;

/* Handler Function to Wrap Each Route */
// cb = callback 
function asyncHandler(cb){
    return async( req, res, next ) => {
        try {
            await cb( req, res, next )
        } catch(error) {
            res.status(500)
               .send(error);
            console.error("There has been a problem.");
            res.render("error"); // PUG
        }
    }
}

/** 
 * GET /books 
 * Shows the full list of books
*/
router.get("/", asyncHandler(async ( req, res ) => {
    const books = await Book.findAll();
    res.render("index", {books}); // index.pug - main book listing page
}));

/** 
 * GET /books/new
 * Shows the create new book form
 */
router.get("/new", ( req, res ) => {
    res.render("new-book"); // new-book.pug - new book form
});

/** 
 * POST /books/new
 * Posts a new book to the database
 */
router.post("/new", asyncHandler(async ( req, res ) => {
    let book;
    try {
        book = await Book.create( req.body );
        res.redirect(`/books/${book.id}`);
    } catch (error) {
        if ( error.name === "SequelizeValidationError") {
            book = await Book.build( req.body );
            res.render("new-book", { book, errors: error.errors });
        } else {
            throw error;
        }
    }
}));

/**
 * GET /books/:id
 * Shows book detail form
 */
router.get("/:id", asyncHandler(async (req,res) => {
    const book = await Book.findByPk( req.params.id );

    if (book) {
        res.render("update-book", {book}); // update-book.pug - the update book form
    } else {
        res.render("error"); // error.pug - displaying a user friendly error message
    };
}));

/**
 * POST /books/:id
 * Updates book info in the database
 */
router.post("/:id", asyncHandler(async (req, res) => {
    let book;
    try {
        book = await Book.findByPk(req.params.id);

        if (book) {
            await book.update(req.body);
            res.redirect(`/books/${book.id}`);
        } else {
            res.sendStatus(404)
               .render("error");
        }
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            book = await Book.build(req.body);
            book.id = req.params.id;
            res.render("update-book", {book, errors: error.errors})
        } else {
            throw error;
        }
    };
}));

/**
 * POST /books/:id/delete
 * Deletes a book
 */
router.post("/:id/delete", asyncHandler(async (req,res) => {
    const book = await Book.findByPk(req.params.id);

    if (book) {
        await book.destroy();
        res.redirect("/books");
    } else {
        res.sendStatus(404)
           .render("page-not-found");
    };
}));

module.exports = router;