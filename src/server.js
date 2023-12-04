const express = require('express')
const cors = require('cors')

class Server {
  constructor() {
    this.app = express.Router()
    this.router = express.Router()
    this.port = process.env.PORT
    this.paths = {
      solicitudes: '/solicitudes',
      usuarios: '/usuarios',
    }
    // this.conectarDB()
    this.middlewares()
    this.routes()
    this.router.use('/api', this.app)
    this._express = express().use(this.router)
  }
  
  middlewares(){
    this.app.use(cors());
    this.app.use(express.json());
  }

  // Definir las rutas
  routes() {
    this.app.use(this.paths.solicitudes, require('./routes/solicitudes'))
    this.app.use(this.paths.usuarios, require('./routes/usuarios'))
  }

  // Iniciar el servidor
  listen(){
    this._express.listen(this.port || 3000, () => {
      console.log(`Server on port: ${this.port}`);
    })
  }
}

module.exports = Server
