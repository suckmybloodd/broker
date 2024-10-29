import mqtt from 'mqtt';

const brokerUrl = 'mqtt://localhost:1884';
const client = mqtt.connect(brokerUrl, {
    username: 'client1',
    password: 'your-jwt-token'
});

const topic = 'ключевая ставка ЦБ';

client.on('connect', () => {
    console.log('Подключено к брокеру');
    client.subscribe(topic, { qos: 1 }, (err) => {
        if (!err) {
            console.log(`Подписка на тему '${topic}' успешно выполнена`);
        } else {
            console.error('Ошибка подписки:', err);
        }
    });
});

client.on('message', (topic, message) => {
    try {
        const parsedMessage = JSON.parse(message.toString());
        console.log(`Получено сообщение:`, parsedMessage);
    } catch (e) {
        console.error('Ошибка при разборе сообщения:', e);
    }
});
