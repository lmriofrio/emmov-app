
const express = require('express');
const router = express.Router();

let clients = [];

router.get('/sse-tramites', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  res.flushHeaders();

  const clientId = Date.now();
  const newClient = { id: clientId, res };

  clients.push(newClient);

  req.on('close', () => {
    clients = clients.filter(client => client.id !== clientId);
  });
});


const sendEvent = (data) => {
  clients.forEach(client => {
    client.res.write(`data: ${JSON.stringify(data)}\n\n`);
  });
};

module.exports = { router, sendEvent };
