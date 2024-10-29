const aedes = require('aedes') // Подключаем Aedes
const { createServer } = require('net')
const jwt = require('jsonwebtoken')

const PORT = 1884
const SECRET_KEY = 'your-secret-key'

const broker = aedes() // Вызов функции aedes без 'new'

// Настраиваем авторизацию через JWT
broker.authenticate = (client, username, password, callback) => {
  try {
    const token = password.toString()
    console.log(token, password)
    const decoded = jwt.verify(token, SECRET_KEY)
    console.log(`Клиент ${username} авторизован:`, decoded)
    callback(null, true)
  } catch (error) {
    console.log(`Ошибка авторизации клиента ${username}`)
    const authError = Object.assign(new Error('Ошибка авторизации'), {
      name: 'AuthenticateError',
      returnCode: 4 // BAD_USERNAME_OR_PASSWORD
    })
    callback(authError, false)
  }
}

// Обработка подключения клиентов
broker.on('client', (client) => {
  console.log(`Клиент подключен: ${client.id}`)
})

// Обработка публикации сообщений
broker.on('publish', (packet, client) => {
  if (client) {
    console.log(`Сообщение от клиента ${client.id}: ${packet.payload.toString()}`)
  }
})

// Запуск брокера на TCP порту
const server = createServer(broker.handle)
server.listen(PORT, () => {
  console.log(`MQTT брокер запущен на порту ${PORT}`)
})
