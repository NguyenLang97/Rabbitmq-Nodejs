const amqplib = require('amqplib');
const amqp_url_cloud = 'amqps://iwksjczm:ip6KO-Tx2DACmYXDub4hI0ISdUwF-_Qs@fuji.lmq.cloudamqp.com/iwksjczm';
const amqp_url_docker = 'amqp://localhost:5672'; // Changed to non-SSL

const sendEmail = async (msgInput) => {
  try {
    // 1. create Connect
    const conn = await amqplib.connect(amqp_url_cloud);
    // 2. create channel
    const channel = await conn.createChannel();

    // 3. create exchange
    const nameExchange = 'send__mail';

    await channel.assertExchange(nameExchange, 'topic', {
      durable: false,
    });

    // const agrs = process.argv.slice(2);
    const agrs = msgInput;
    // const msg = agrs[1] || 'Fixed';
    const msg = agrs.message;
    // const topic = agrs[0];
    const topic = agrs.topic;
    console.log('🚀  topic ==', topic);
    console.log('🚀  msg ==', msg);

    // 4.publish email
    await channel.publish(nameExchange, topic, Buffer.from(msg));
  } catch (error) {
    console.log('🚀  error ==', error);
  }
};

// sendEmail();
module.exports = sendEmail;
