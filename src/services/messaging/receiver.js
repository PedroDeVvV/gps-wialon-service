import amqp from 'amqplib/callback_api.js';

amqp.connect("amqp://localhost", (error0, connection) => {
  if (error0) {
    throw error0;
  }

  const queue = "items";
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }

    // Garantir que a fila "items" seja criada, caso ainda não exista
    channel.assertQueue(queue, {
      durable: false
    });

    // Iniciar o consumo das mensagens da fila
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
    channel.consume(queue, function(msg) {
      if (msg !== null) {
        // Converter e exibir a mensagem recebida
        console.log(" [x] Received %s", msg.content.toString());
        // Se necessário, podemos parsear a mensagem JSON
        const message = JSON.parse(msg.content.toString());
        console.log("Parsed message: ", message);
      }
    }, {
      noAck: true // Ignorar o ack manual
    });
  });
});
