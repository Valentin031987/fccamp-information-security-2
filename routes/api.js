'use strict';
const sMessage = require('../service.js').Message
let cMessage;

module.exports = function (app) {

  app.param('board', function (req, res, next, board) {
    cMessage = new sMessage(board);
    next();
  })

  // app.all('/api/threads/:board', function (req, res, next) {
  //   let board = req.params.board;
  //   console.log('all', board)
  //   cMessage = new sMessage(board);
  //   next();
  // })  

  app.route('/api/threads/:board')

    .get(async (req, res) => {
      let response = await cMessage.getThreads({})
      res.json(response)
    })

    .post(async (req, res) => {
      let { text, delete_password } = req.body;
      let response = await cMessage.createThread({ text, delete_password })
      res.json(response)
    })

    .put(async (req, res) => {
      let { thread_id } = req.body;
      let response = await cMessage.updateThread({ thread_id })
      res.send(response)
    })

    .delete(async (req, res) => {
      let { thread_id, delete_password } = req.body;
      console.log(req.body)
      let response = await cMessage.deleteThread({ thread_id, delete_password })

      //if (response.error) return res.send(response.error)

      res.send(response)


    });

  app.route('/api/replies/:board')

    .get(async (req, res) => {
      let { thread_id } = req.query;
      let response = await cMessage.getReplies({ thread_id })
      res.json(response)

    })

    .post(async (req, res) => {
      let { thread_id, text, delete_password } = req.body;
      let response = await cMessage.createReply({ thread_id, text, delete_password })
      res.json(response)
    })
  
    .put(async (req, res) => {
      let { thread_id, reply_id } = req.body;
      let response = await cMessage.updateReply({ thread_id, reply_id })
      res.send(response)

    })

    .delete(async (req, res) => {
      let { thread_id, reply_id, delete_password } = req.body;
      let response = await cMessage.deleteReply({ thread_id, reply_id, delete_password })
 
      res.send(response)
    })

};   
