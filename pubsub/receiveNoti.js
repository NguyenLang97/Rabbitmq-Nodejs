const amqplib = require('amqplib');
const amqp_url_cloud = 'amqps://iwksjczm:ip6KO-Tx2DACmYXDub4hI0ISdUwF-_Qs@fuji.lmq.cloudamqp.com/iwksjczm';
const amqp_url_docker = 'amqp://localhost:5672'; // Changed to non-SSL

const receiveNoti = async () => {
  try {
    // 1. create Connect
    const conn = await amqplib.connect(amqp_url_docker);
    // 2. create channel
    const channel = await conn.createChannel();

    // 3. create exchange
    const nameExchange = 'video';

    await channel.assertExchange(nameExchange, 'fanout', {
      durable: false,
    });

    // 4.create queue
    const { queue } = await channel.assertQueue('', {
      exclusive: true,
    });
    console.log('🚀  nameQueue ==', queue);

    // 5. binding
    await channel.bindQueue(queue, nameExchange, '');
    await channel.consume(
      queue,
      (msg) => {
        console.log('🚀  msg ==', msg.content.toString());
      },
      {
        noAck: true,
      }
    );
  } catch (error) {
    console.log('🚀  error ==', error);
  }
};

const msg = process.argv.slice(2).join(' ') || 'Hello exchange';
console.log('🚀  msg ==', msg);
receiveNoti({ msg });
