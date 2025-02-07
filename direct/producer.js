const amqplib = require('amqplib');
const amqp_url_cloud = 'amqps://iwksjczm:ip6KO-Tx2DACmYXDub4hI0ISdUwF-_Qs@fuji.lmq.cloudamqp.com/iwksjczm';
const amqp_url_docker = 'amqp://localhost:5672'; // Changed to non-SSL

// const sendQueue = async ({ msg }) => {
const sendQueue = async (msg) => {
  try {
    // 1. Create a connection
    const conn = await amqplib.connect(amqp_url_cloud);

    // 2. Create a channel
    const channel = await conn.createChannel();

    // 3. Create name exchange
    const exchangeName = 'direct_logs';
    const routingKey = 'info';

    // 4. Khai báo exchange loại 'direct'
    await channel.assertExchange(exchangeName, 'direct', { durable: true });

    // 5. Gửi tin nhắn đến exchange
    await channel.publish(exchangeName, routingKey, Buffer.from(msg), {
      persistent: true,
    });

    console.log(" [x] Sent %s: '%s'", routingKey, msg);
    // Đóng kết nối sau một khoảng thời gian
    // setTimeout(() => {
    //   conn.close();
    // }, 500);
  } catch (error) {
    console.log('🚀  error ==', error);
  }
};

// const msg = process.argv.slice(2).join(' ') || 'Hello';

// sendQueue({ msg });
module.exports = sendQueue;
