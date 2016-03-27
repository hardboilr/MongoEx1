var express = require('express');
var router = express.Router();
var jokes = require('../model/joke');

//GET: All get requests
router.all('/', function (req, res, next) {
});

//GET: Get random joke
router.get('/joke/random', function (req, res, next) {
    jokes.getRandomJoke(function (err, data) {
        if (err) {
            res.json(getJsonError(err));
        }
        res.json(data);
    });
});

//GET: Get all jokes
router.get('/jokes', function (req, res, next) {
    jokes.allJokes(function (err, data) {
        if (err) {
            res.json(getJsonError(err));
        }
        res.json(data);
    });
});

//POST: create new joke
router.post('/joke', function (req, res, next) {
    jokes.createJoke(req.body, function (err, data) {
        if (err) {
            res.json(getJsonError(err));
        }
        res.json(data);
    });
});

//DELETE: delete existing joke
router.delete('/joke/:_id', function (req, res, next) {
    var id = req.params._id;
    jokes.removeJoke(id, function(err, data){
        if(err) {
            res.json(getJsonError(err));
        }
        res.json(data);
    });
});

//UPDATE: update existing joke
router.put('/joke', function (req, res, next) {
    var editJoke =
            {
                joke: req.body.joke,
                type: req.body.type,
                reference: req.body.reference,
                lastEdited: new Date().toISOString()
            };

    jokes.updateJoke(req.body._id, editJoke, function (err, data) {
        if (err) {
            res.json(getJsonError(err));
        }
        res.json(data);
    });
});

var getJsonError = function (err) {
    return {error: err};
};

module.exports = router;




