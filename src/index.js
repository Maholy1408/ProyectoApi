require('dotenv').config()

// Iniciar el servidor
const Server =  require('./server');
const server = new Server();

server.listen();
