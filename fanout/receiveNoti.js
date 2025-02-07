const amqplib = require('amqplib');
const amqp_url_cloud = 'amqps://iwksjczm:ip6KO-Tx2DACmYXDub4hI0ISdUwF-_Qs@fuji.lmq.cloudamqp.com/iwksjczm';
const amqp_url_docker = 'amqp://localhost:5672'; // Changed to non-SSL

const receiveNoti = async () => {
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

    // 4.create queue
    const { queue } = await channel.assertQueue('', {
      exclusive: true,
    });
    console.log('🚀  nameQueue ==', queue);

    // 5. binding
    await channel.bindQueue(queue, nameExchange, '');
    await channel.prefetch(1); // Giới hạn số lượng tin nhắn chưa được xác nhận mà consumer có thể nhận
    await channel.consume(
      queue,
      (msg) => {
        if (msg !== null) {
          console.log('Received:', msg.content.toString());
          // Giả lập xử lý message mất thời gian
          setTimeout(() => {
            console.log('Done processing:', msg.content.toString());
            channel.ack(msg); // Xác nhận sau khi xử lý xong
          }, 2000); // 2 giây để xử lý
        }
      },
      {
        noAck: false,
      }
    );
  } catch (error) {
    console.log('🚀  error ==', error);
  }
};

// const msg = process.argv.slice(2).join(' ') || 'Hello exchange';
// console.log('🚀  msg ==', msg);
// receiveNoti({ msg });

receiveNoti();
// node receiveNoti.js
