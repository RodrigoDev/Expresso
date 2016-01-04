var express = require('express');
var jwt = require('jsonwebtoken');
var User = require('../app/models/user');

// get an instance of the router for api routes
var router = express.Router();

router.post('/authenticate', function(req, res){
    User.findOne({
        name: req.body.name
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.json({ sucess: false, message: 'Auth failed, user not found.'});
        } else if (user) {
            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Auth failed, wrong password.'});
            } else {
                var token = jwt.sign(user, req.app.get('superSecret'), {
                    expiresIn: 1440
                });

                res.json({
                    success: true,
                    message: 'Auth success.',
                    token: token
                });
            }
        }
    });
});

router.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

         // verifies secret and checks exp
         jwt.verify(token, req.app.get('superSecret'), function(err, decoded) {
             if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
             } else {
                 // if everything is good, save to request for use in other routes
                 req.decoded = decoded;
                 next();
             }
         });

    } else {

         // if there is no token
         // return an error
         return res.status(403).send({
             success: false,
             message: 'No token provided.'
         });
    }
});

// route to show a random message (GET http://localhost:8080/api/)
router.get('/', function(req, res) {
    res.json({ message: 'Welcome to the coolest API on earth!' });
});

// route to return all users (GET http://localhost:8080/api/users)
router.get('/users', function(req, res) {
    User.find({}, function(err, users) {
        res.json(users);
    });
});

module.exports = router;
