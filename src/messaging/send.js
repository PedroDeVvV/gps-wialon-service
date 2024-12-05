import amqp from 'amqplib/callback_api.js';

function sendMessageQueue(queue, message){
    return new Promise((resolve, reject)=>{
    amqp.connect('amqp://localhost', (error0, connection)=>{
    if(error0){
        throw error0;
    }
    connection.createChannel((error1, channel)=>{
        
        channel.assertQueue(queue,{
            durable: false
        });

        channel.sendToQueue(queue,Buffer.from(message));
        console.log(" [x] Sent %s", message);
    })
    setTimeout(()=>{
        connection.close();
    }, 500)
    })
})
}
export default sendMessageQueue


