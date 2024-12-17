// docker run -it -–rm -–name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.10-management

const express = require('express');
const sendQueue = require('./queue/producer');
const postMessageFanout = require('./pubsub/post');
const sendMessageTopic = require('./topic/send.mail');
const sendMessageHeaders = require('./headers/headersPublisher');

const app = express();
app.use(express.json());

const PORT = 3000;

app.post('/send-to-queue', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  await sendQueue(message);
  res.json({ success: `Message sent to queue: ${message}` });
});
app.post('/send-from-fanout-to-queue', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  await postMessageFanout(message);
  res.json({ success: `Message sent to queue: ${message}` });
});

app.post('/send-from-topic-to-queue', async (req, res) => {
  const { message, topic } = req.body;
  if (!message || !topic) return res.status(400).json({ error: 'Message is required' });

  await sendMessageTopic(req.body);
  res.json({ success: `Message sent to queue: ${message},  ${topic}` });
});

app.post('/send-from-headers-to-queue', async (req, res) => {
  const { message, headers } = req.body;
  if (!message || !headers) return res.status(400).json({ error: 'Message is required' });

  await sendMessageHeaders(req.body);
  res.json({ success: `Message sent to queue: ${message},  ${headers}` });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
