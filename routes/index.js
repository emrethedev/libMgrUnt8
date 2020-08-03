const express = require('express');
const router = express.Router();

/* GET home page
Immediately takes the user to books path/route */
router.get("/", (req, res, next) => {
  res.redirect("/books")
});

module.exports = router;