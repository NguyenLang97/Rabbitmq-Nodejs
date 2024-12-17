const amqplib = require('amqplib');
const amqp_url_cloud = 'amqps://iwksjczm:ip6KO-Tx2DACmYXDub4hI0ISdUwF-_Qs@fuji.lmq.cloudamqp.com/iwksjczm';
const amqp_url_docker = 'amqp://localhost:5672'; // Changed to non-SSL

// const sendQueue = async ({ msg }) => {
const sendQueue = async (msg) => {
  try {
    // 1. Create a connection
    const conn = await amqplib.connect(amqp_url_docker);

    // 2. Create a channel
    const channel = await conn.createChannel();

    // 3. Create name queue
    const nameQueue = 'q2';

    // 4. Create queue
    await channel.assertQueue(nameQueue, { durable: true });

    // 5. Send message to queue
    await channel.sendToQueue(nameQueue, Buffer.from(msg), {
      persistent: true,
    });
  } catch (error) {
    console.log('🚀  error ==', error);
  }
};

// const msg = process.argv.slice(2).join(' ') || 'Hello';

// sendQueue({ msg });
module.exports = sendQueue;
