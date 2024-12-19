import "dotenv/config";
import amqp from "amqplib/callback_api.js";

amqp.connect("amqp://localhost", (error0, connection) => {
  if (error0) {
    throw error0;
  }

  const queue = process.env.QUEUE_NAME;

  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }

    channel.assertQueue(queue, {
      durable: false,
    });

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
    channel.consume(
      queue,
      function (msg) {
        if (msg !== null) {
          console.log(" [x] Received %s", msg.content.toString());
          const message = JSON.parse(msg.content.toString());
          console.log("Parsed message: ", message);
        }
      },
      {
        noAck: true,
      }
    );
  });
});
