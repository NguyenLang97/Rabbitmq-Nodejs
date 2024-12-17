const amqplib = require('amqplib');
const amqp_url_cloud = 'amqps://iwksjczm:ip6KO-Tx2DACmYXDub4hI0ISdUwF-_Qs@fuji.lmq.cloudamqp.com/iwksjczm';
const amqp_url_docker = 'amqp://localhost:5672'; // Changed to non-SSL

const receiveQueue = async () => {
  try {
    // 1. Tạo kết nối
    const conn = await amqplib.connect(amqp_url_docker);

    // 2. Tạo channel
    const channel = await conn.createChannel();

    // 3. Tên queue
    const nameQueue = 'q2';

    // 4. Tạo queue nếu chưa tồn tại
    await channel.assertQueue(nameQueue, { durable: true });

    // 5. Cấu hình prefetch để giới hạn số message chưa được xử lý
    const prefetchCount = 1; // Mỗi consumer chỉ nhận 1 message tại một thời điểm
    channel.prefetch(prefetchCount);

    // 6. Nhận và xử lý message
    console.log(`Waiting for messages in ${nameQueue}. To exit press CTRL+C`);
    await channel.consume(
      nameQueue,
      (msg) => {
        if (msg !== null) {
          console.log('Received:', msg.content.toString());
          // Giả lập xử lý message mất thời gian
          // setTimeout(() => {
          //   console.log('Done processing:', msg.content.toString());
          //   // channel.ack(msg); // Xác nhận sau khi xử lý xong
          // }, 2000); // 2 giây để xử lý
        }
      },
      { noAck: true } // Chế độ manual acknowledgment
      //   noAck = false: Consumer phải gửi ACK sau khi xử lý xong
      // trường hợp false ở đây có nghĩa consumer chưa xử lý được tác vụ này, nên nó sẽ chuyển consumer này sang consumer khác, khi nào xử lý được thì thôi
    );
  } catch (error) {
    console.log('🚀  error ==', error);
  }
};

receiveQueue();
