var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Test error handling
// router.get('/', (req, res) => {
//   throw new Error('💥 test error');
// });


module.exports = router;
