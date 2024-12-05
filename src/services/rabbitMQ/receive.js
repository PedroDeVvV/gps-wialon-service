import amqp from "amqplib/callback_api.js";

const queue = "queue";

amqp.connect("amqp://localhost", function (error0, connection) {
  if (error0) {
    console.error("Erro ao conectar no RabbitMQ:", error0);
    throw error0;
  }

  connection.createChannel(function (error1, channel) {
    if (error1) {
      console.error("Erro ao criar canal:", error1);
      throw error1;
    }

    channel.assertQueue(queue, {
      durable: false,
    });

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    channel.consume(
      queue,
      function (msg) {
        console.log(" [x] Received %s", msg.content.toString());
      },
      {
        noAck: true,
      }
    );
  });
});
