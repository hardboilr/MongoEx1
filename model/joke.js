var connection = require('../db/db');
var ObjectId = require('mongodb').ObjectID;


var allJokes = function (callback) {
    var db = connection.get();
    db.collection('jokes').find().toArray(function (err, data) {
        if (err) {
            callback(err);
        }
        callback(null, data);
    });
};

var getRandomJoke = function (callback) {
    // Math.floor: Round a number downward to its nearest integer -> 1.6 becomes 1.
    // Math.random(): Return a random number between 0 (inclusive) and 1 (exclusive): --> 0.8783364845439792
    // return jokes[Math.floor(Math.random() * jokes.length)];

    var db = connection.get();

    var getAllJokes = function (callback) {
        db.collection('jokes').find().toArray(function (err, data) {
            if (err) {
                callback(err);
            }
            callback(null, data);
        });
    };

    getAllJokes(function (err, data) {
        if (err) {
            callback(err);
        }
        callback(null, data[Math.floor(Math.random() * data.length)]);
    });
};

var getJoke = function (id, callback) {
    var db = getConnection();

    db.collection('jokes').findOne({'_id': new ObjectId(id)}, function (err, data) {
        if (err) {
            callback(err);
        }
        callback(null, data);
    });
};

var updateJoke = function (id, joke, callback) {
    var db = getConnection();

    db.collection('jokes').replaceOne({'_id': new ObjectId(id)}, joke, function (err, data) {
        if (err) {
            callback(err);
        }
        callback(null, data);
    });
};

var removeJoke = function (id, callback) {
    var db = getConnection();

    db.collection('jokes').deleteOne({'_id': new ObjectId(id)}, function (err, data) {
        if (err) {
            callback(err);
        }
        callback(null, data);
    });
};

var createJoke = function (joke, callback) {
    var db = getConnection();

    joke.lastEdited = new Date().toISOString();

    db.collection('jokes').insertOne(joke, function (err, data) {
        if (err) {
            callback(err);
        }
        callback(null, data);
    });
};

var getConnection = function () {
    return connection.get();
};

module.exports = {
    allJokes: allJokes,
    getJoke: getJoke,
    removeJoke: removeJoke,
    createJoke: createJoke,
    updateJoke: updateJoke,
    getRandomJoke: getRandomJoke
};