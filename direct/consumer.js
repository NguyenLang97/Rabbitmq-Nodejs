const amqplib = require('amqplib');
const amqp_url_cloud = 'amqps://iwksjczm:ip6KO-Tx2DACmYXDub4hI0ISdUwF-_Qs@fuji.lmq.cloudamqp.com/iwksjczm';
const amqp_url_docker = 'amqp://localhost:5672'; // Changed to non-SSL

const receiveQueue = async () => {
  try {
    // 1. Tạo kết nối
    const conn = await amqplib.connect(amqp_url_cloud);

    // 2. Tạo channel
    const channel = await conn.createChannel();

    // 3. Tên exchange và queue
    const exchangeName = 'direct_logs';
    const routingKey = 'info';
    const nameQueue = 'q2';

    // 4. Khai báo exchange loại 'direct'
    await channel.assertExchange(exchangeName, 'direct', { durable: true });

    // 5. Tạo queue nếu chưa tồn tại
    await channel.assertQueue(nameQueue, { durable: true });

    // 6. Bind queue với exchange và routing key
    await channel.bindQueue(nameQueue, exchangeName, routingKey);

    // 7. Cấu hình prefetch để giới hạn số message chưa được xử lý
    const prefetchCount = 1; // Giới hạn số lượng tin nhắn chưa được xác nhận mà consumer có thể nhận
    channel.prefetch(prefetchCount);

    // 8. Nhận và xử lý message
    console.log(`Waiting for messages in ${nameQueue}. To exit press CTRL+C`);
    await channel.consume(
      nameQueue,
      (msg) => {
        if (msg !== null) {
          console.log('Received:', msg.content.toString());
          // Giả lập xử lý message mất thời gian
          // setTimeout(() => {
          //   console.log('Done processing:', msg.content.toString());
          //   channel.ack(msg); // Xác nhận sau khi xử lý xong
          // }, 2000); // 2 giây để xử lý
        }
      },
      { noAck: false } // Chế độ manual acknowledgment
    );
  } catch (error) {
    console.log('🚀  error ==', error);
  }
};

receiveQueue();

// node consumer.js
