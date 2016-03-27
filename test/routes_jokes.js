var expect = require('chai').expect;
var request = require('request');
var http = require('http');
var app = require('../app');
var db = require("../db/db");
var server;
var TEST_PORT = 3300;

before(function (done) {
    db.connect("mongodb://localhost:27017/test");
    server = http.createServer(app);
    server = http.createServer(app);
    server.listen(TEST_PORT, function () {
        done();
    });
});

after(function (done) {
    server.close();
    done();
});

describe('Test get all jokes', function () {
    var options = {
        url: 'http://localhost:' + TEST_PORT + '/api/jokes',
        method: 'GET',
        json: true
    };
    it('should get json formatted list of all jokes from document jokes', function (done) {
        request(options, function (err, res, body) {
            if (err) {
                throw new Error(err);
            }
            var jokes = body.data;
            console.log(jokes);
            done();
        });
    });
});

