const amqplib = require('amqplib');
const amqp_url_cloud = 'amqps://iwksjczm:ip6KO-Tx2DACmYXDub4hI0ISdUwF-_Qs@fuji.lmq.cloudamqp.com/iwksjczm';
const amqp_url_docker = 'amqp://localhost:5672'; // Changed to non-SSL

const receiveEmail = async () => {
  try {
    // 1. create Connect
    const conn = await amqplib.connect(amqp_url_docker);
    // 2. create channel
    const channel = await conn.createChannel();

    // 3. create exchange
    const nameExchange = 'send__mail';

    await channel.assertExchange(nameExchange, 'topic', {
      durable: false,
    });
    // 4. create queue
    const { queue } = await channel.assertQueue('', {
      exclusive: true,
    });
    // 5. binding
    const agrs = process.argv.slice(2);
    if (!agrs.length) {
      process.exit(0);
    }
    // * có nghĩa là phù hợn với bất kỳ từ nào
    // # khớp với một or nhiều từ bất kỳ
    console.log(`queue::::${queue} topic:::::${agrs}`);
    agrs.forEach(async (key) => {
      await channel.bindQueue(queue, nameExchange, key);
    });

    // 4.publish email

    await channel.consume(queue, (msg) => {
      console.log('🚀  msg ==', msg);
      console.log(`Routing key::${msg.fields.routingKey}, msg::: ${msg.content.toString()}`);
    });
  } catch (error) {
    console.log('🚀  error ==', error);
  }
};

receiveEmail();
