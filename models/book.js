"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize) => {
    
    class Book extends Sequelize.Model {}
    Book.init({

        title: {
            type: Sequelize.STRING,
            // Not relying on HTML form validation
            validate: {
                notEmpty: {
                    msg: "'Title' value cannot be empty."
                },
            },
        },
        author: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: "'Author' value cannot be empty.",
                },
            },
        },
        genre: Sequelize.STRING,
        year: Sequelize.INTEGER,

    }, {sequelize});

    return Book;
}