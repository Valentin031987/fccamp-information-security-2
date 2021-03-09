const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
const board = 'chaiBoard';
let idThread = '';
let idReply = '';

suite('Functional Tests', function () {

    test('Creating a new thread: POST request to /api/threads/{board}', function (done) {
        let input = { text: 'chaiText', delete_password: '12345' };
        chai.request(server)
            .post(`/api/threads/${board}`)
            .send(input)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body, '_id');
                assert.property(res.body, 'text');
                assert.property(res.body, 'delete_password');
                assert.property(res.body, 'created_on');
                assert.property(res.body, 'bumped_on');
                assert.property(res.body, 'reported');

                assert.equal(res.body.text, input.text)
                assert.equal(res.body.delete_password, input.delete_password)

                assert.isBoolean(res.body.reported);
                assert.isArray(res.body.reply);
                idThread = res.body._id;
                done();
            });
    })

    test('Viewing the 10 most recent threads with 3 replies each: GET request to /api/threads/{board}', function (done) {
        chai.request(server)
            .get(`/api/threads/${board}`)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isArray(res.body);
                assert.isAtMost(res.body.length, 10); //length <= 10
                for (i = 0; i < res.body.length-1; ++i) {
                    assert.property(res.body[i], '_id');
                    assert.property(res.body[i], 'text');
                    //assert.property(res.body[i], 'delete_password');
                    assert.property(res.body[i], 'created_on');
                    assert.property(res.body[i], 'bumped_on');
                    //assert.property(res.body[i], 'reported');
                    //assert.isBoolean(res.body[i].reported);
                    assert.isArray(res.body[i].reply, 'loop be an array');
                    assert.isAtMost(res.body[i].reply.length, 3); //length <= 3
                }
                done();
            });
    })

    test('Deleting a thread with the incorrect password: DELETE request to /api/threads/{board} with an invalid delete_password', function (done) {
        let input = { thread_id: idThread, delete_password: 'wrong pass' };
        chai.request(server)
            .delete(`/api/threads/${board}`)
            .send(input)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.text, 'incorrect password')
                done();
            });
    })

    test('Deleting a thread with the correct password: DELETE request to /api/threads/{board} with a valid delete_password', function (done) {
        let input = { thread_id: idThread, delete_password: '12345' };
        chai.request(server)
            .delete(`/api/threads/${board}`)
            .send(input)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.text, 'success')
                done();
            });
    })

    test('Reporting a thread: PUT request to /api/threads/{board}', function (done) {
        let input = { board: board, thread_id: idThread };
        chai.request(server)
            .put(`/api/threads/${board}`)
            .send(input)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.text, 'success');
                done();
            });
    })

    test('Creating a new reply: POST request to /api/replies/{board}', function (done) {
        let input = { text: 'chaiText', delete_password: '12345', thread_id: idThread };
        chai.request(server)
            .post(`/api/replies/${board}`)
            .send(input)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body, '_id');
                assert.property(res.body, 'delete_password');
                assert.property(res.body, 'created_on');
                assert.property(res.body, 'reported');
                idReply = res.body.reply[0]._id;
                done();
            });
    })

    test('Viewing a single thread with all replies: GET request to /api/replies/{board}', function (done) {
        let input = { thread_id: idThread }
        chai.request(server)
            .get(`/api/replies/${board}`)
            .query(input)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isArray(res.body);
                assert.isAtMost(res.body.length-1, 1); //length <= 1
                for (i = 0; i < res.body.length; ++i) {
                    assert.property(res.body[i], '_id');
                    assert.property(res.body[i], 'text');
                    //assert.property(res.body[i], 'delete_password');
                    assert.property(res.body[i], 'created_on');
                    assert.property(res.body[i], 'bumped_on');
                    //assert.property(res.body[i], 'reported');
                    //assert.isBoolean(res.body[i].reported);
                    assert.isArray(res.body[i].reply);
                    //assert.isAtMost(res.body[i].reply.length, 3); //length <= 3
                }
                done();
            });
    })

    test('Deleting a reply with the incorrect password: DELETE request to /api/replies/{board} with an invalid delete_password', function (done) {
        let input = { thread_id: idThread, reply_id: idReply, delete_password: 'wrong pass' };
        chai.request(server)
            .delete(`/api/replies/${board}`)
            .send(input)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.text, 'incorrect password')
                done();
            });
    })

    test('Deleting a reply with the correct password: DELETE request to /api/replies/{board} with a valid delete_password', function (done) {
        let input = { thread_id: idThread, reply_id: idReply, delete_password: '12345' };
        chai.request(server)
            .delete(`/api/replies/${board}`)
            .send(input)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.text, 'success')
                done();
            });
    })

    test('Reporting a reply: PUT request to /api/replies/{board}', function (done) {
        let input = { board: board, thread_id: idThread, reply_id: idReply};
        chai.request(server)
            .put(`/api/replies/${board}`)
            .send(input)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.text, 'success');
                done();
            });
    })

});