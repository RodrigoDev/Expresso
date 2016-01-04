var express = require('express');
var User = require('../app/models/user');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost/');
});

router.get('/setup', function(req, res){
    // create a sample user
    var user = new User({
       name: 'Rodrigo Carneiro',
       password: 'password',
       admin: true
    });

    // save the sample user
    user.save(function(err) {
       if (err) throw err;

       console.log('User saved successfully');
       res.json({ success: true });
    });
});

module.exports = router;
