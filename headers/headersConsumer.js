const amqplib = require('amqplib');
const amqp_url_cloud = 'amqps://iwksjczm:ip6KO-Tx2DACmYXDub4hI0ISdUwF-_Qs@fuji.lmq.cloudamqp.com/iwksjczm';
const amqp_url_docker = 'amqp://localhost:5672'; // Changed to non-SSL

const headersConsumer = async (expectedHeaders) => {
  console.log('🚀  expectedHeaders ==', expectedHeaders);
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
    const { queue } = await channel.assertQueue('', { exclusive: true });
    console.log('🚀 Created queue ==', queue);

    // 4. bind queue to exchange
    await channel.bindQueue(queue, nameExchange, '', { 'x-match': 'all', ...expectedHeaders });

    await channel.consume(queue, (msg) => {
      console.log('🚀  Message received ==', msg.content.toString());
      console.log('🚀  Headers ==', msg.properties.headers);
      channel.ack(msg);
    });
  } catch (error) {
    console.log('🚀  error ==', error);
  }
};

// Đọc headers từ dòng lệnh
const args = process.argv.slice(2);
if (!args[0]) {
  console.error('Usage: node headersConsumer.js \'{"key": "value"}\'');
  process.exit(1);
}

try {
  const headers = JSON.parse(args[0]); // Parse JSON từ tham số dòng lệnh
  console.log('🚀  headers ==', headers);
  headersConsumer(headers);
} catch (error) {
  console.error('Invalid JSON format. Please provide headers as a valid JSON string.');
  process.exit(1);
}

// chạy
// node headersConsumer.js '{"type": "log","level": "info"}'
