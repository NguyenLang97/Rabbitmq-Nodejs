const amqplib = require('amqplib');
const amqp_url_cloud = 'amqps://iwksjczm:ip6KO-Tx2DACmYXDub4hI0ISdUwF-_Qs@fuji.lmq.cloudamqp.com/iwksjczm';
const amqp_url_docker = 'amqp://localhost:5672'; // Changed to non-SSL

// const postVideo = async ({ msg }) => {
const postVideo = async (msg) => {
  try {
    // 1. create Connect
    const conn = await amqplib.connect(amqp_url_cloud);
    // 2. create channel
    const channel = await conn.createChannel();

    // 3. create exchange
    const nameExchange = 'video';

    await channel.assertExchange(nameExchange, 'fanout', {
      durable: false,
    });

    // 4.publish video
    await channel.publish(nameExchange, '', Buffer.from(msg));
    console.log('🚀  send OK ==', msg);
  } catch (error) {
    console.log('🚀  error ==', error);
  }
};
module.exports = postVideo;

// const msg = process.argv.slice(2).join(' ') || 'Hello exchange';
// postVideo({ msg });
