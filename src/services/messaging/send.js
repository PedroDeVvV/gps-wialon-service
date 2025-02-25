import amqp from 'amqplib/callback_api.js';

function sendMessageQueue(queue, message){
    return new Promise(()=>{
    amqp.connect('amqp://root:trcvbr18@host.docker.internal:5672', (error0, connection)=>{
    if(error0){
        throw error0;
    }
    connection.createChannel((error1, channel)=>{
        
        channel.assertQueue(queue,{
            durable: false
        });

        channel.sendToQueue(queue,Buffer.from(message));
    })
    setTimeout(()=>{
        connection.close();
    }, 500)
    })
})
}
export default sendMessageQueue


