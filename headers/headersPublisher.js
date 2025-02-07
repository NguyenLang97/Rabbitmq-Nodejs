const amqplib = require('amqplib');
const amqp_url_cloud = 'amqps://iwksjczm:ip6KO-Tx2DACmYXDub4hI0ISdUwF-_Qs@fuji.lmq.cloudamqp.com/iwksjczm';
const amqp_url_docker = 'amqp://localhost:5672'; // Changed to non-SSL

const headersPublisher = async (msg) => {
  console.log('🚀  msg ==', msg);
  try {
    // 1. create Connect
    const conn = await amqplib.connect(amqp_url_cloud);
    // 2. create channel
    const channel = await conn.createChannel();

    // 3. create exchange
    const nameExchange = 'headers_exchange';

    await channel.assertExchange(nameExchange, 'headers', {
      durable: true,
    });

    // 4.publish
    await channel.publish(nameExchange, '', Buffer.from(msg.message), { headers: msg.headers });
    console.log(`Message sent to headers exchange with headers ${JSON.stringify(msg.headers)}: ${msg.message}`);

    // await channel.close();
    // await conn.close();
  } catch (error) {
    console.log('🚀  error ==', error);
  }
};

module.exports = headersPublisher;
