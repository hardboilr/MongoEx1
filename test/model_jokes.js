var joke = require('../model/joke');
var expect = require('chai').expect;
var db = require("../db/db");
var ObjectId = require('mongodb').ObjectID;
var connection_string = "mongodb://localhost:27017/test";


function Joke(joke, type, reference) {
    this.joke = joke;
    this.type = type;
    this.reference = reference;
}

before(function (done) {
    db.connect(connection_string, function (err) {
        if (err) {
            console.log("Could not connect to Database");
            return;
        }
        done();
    });
});

var id1;
var id2;
var id3;

beforeEach(function (done) {
    // clear jokes collection
    this.db = db.get();
    this.db.collection('jokes').deleteMany();

    // insert test data
    joke.createJoke(new Joke('test joke 1', ['short', 'joke'], {author: 'Tobias', link: 'google.com'}), function (err, data) {
        joke.createJoke(new Joke('test joke 2', ['story', 'joke'], {author: 'Jens', link: 'jens.com'}), function (err, data) {
            joke.createJoke(new Joke('test joke 3', ['misc', 'joke'], {author: 'Lars', link: 'niels.com'}), function (err, data) {
                joke.allJokes(function (err, data) {
                    if (err) {
                        throw new Error(err);
                    }
                    id1 = data[0]._id;
                    id2 = data[1]._id;
                    id3 = data[2]._id;
                    done();
                });
            });
        });
    });
});

after(function (done) {
    // clear jokes collection
    this.db = db.get();
    this.db.collection('jokes').deleteMany();
    done();
});

describe('test allJokes-->', function () {
    it('should get all jokes in json formatted array', function (done) {
        joke.allJokes(function (err, data) {
            if (err) {
                throw new Error(err);
            }
            expect(data.length).to.be.equal(3);
            done();
        });
    });
});

describe('test getRandomJoke-->', function () {
    it('should get random joke from jokes collection', function (done) {
        joke.getRandomJoke(function (err, data) {
            if (err) {
                throw new Error(err);
            }
            expect(data.joke).to.be.a('string');
            done();
        });
    });
});

describe('test getJoke-->', function () {
    it('should get a joke with id from jokes', function (done) {
        joke.getJoke(id1.toString(), function (err, data) {
            if (err) {
                throw new Error(err);
            }
            expect(data._id).to.be.eql(id1);
            done();
        });
    });
});

describe('test updateJoke-->', function () {
    it('should replace contents of existing joke from jokes collection', function (done) {

        joke.allJokes(function (err, data) {
            if (err) {
                throw new Error(err);
            }

            var id = data[data.length - 1]._id;
            var newJoke = 'new edited joke';
            var newType = ['type1', 'type2', 'type3'];
            var newReference = {author: 'Jens Jensen', link: 'www.google.com'};
            var newLastEdited = new Date().toISOString();

            var editJoke =
                    {
                        joke: newJoke,
                        type: newType,
                        reference: newReference,
                        lastEdited: newLastEdited
                    };

            joke.updateJoke(id, editJoke, function (err, data) {
                if (err) {
                    throw new Error(err);
                }

                var result = {ok: 1, nModified: 1, n: 1};
                expect(data.result).to.be.eql(result);

                joke.getJoke(id, function (err, data) {
                    if (err) {
                        throw new Error(err);
                    }
                    expect(data._id).to.be.eql(id);
                    expect(data.joke).to.be.equal(newJoke);
                    expect(data.type).to.be.eql(newType);
                    expect(data.reference).to.be.eql(newReference);
                    expect(data.lastEdited).to.be.equal(newLastEdited);
                    done();
                });
            });
        });

    });
});

describe('test removeJoke', function () {
    it('should remove existing joke from jokes collection', function (done) {
        joke.allJokes(function (err, data) {
            expect(data.length).to.be.equal(3);

            joke.removeJoke(id3.toString(), function (err, data) {
                var result = {ok: 1, n: 1};
                expect(data.result).to.be.eql(result);

                joke.allJokes(function (err, data) {
                    expect(data.length).to.be.equal(2);
                    done();
                });
            });
        });
    });
});

describe('test creteJoke', function () {
    it('should add new joke to jokes collection', function (done) {

        var newJoke = {
            joke: "new joke",
            type: ["new type", "joke", "new type 1"],
            reference: {"author": "Tobias Jacobsen", "link": "another url"}
        };

        joke.createJoke(newJoke, function (err, data) {

            joke.allJokes(function (err, data) {
                var joke = data[data.length - 1];

                expect(joke.joke).to.be.equal(newJoke.joke);
                expect(joke.type).to.be.eql(newJoke.type);
                expect(joke.reference).to.be.eql(newJoke.reference);
                done();
            });
        });
    });
});

