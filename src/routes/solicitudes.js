const { Router } = require('express')

const {
  obtenerSolicitudes,
  obtenerSolicitud,
  crearSolicitud,
  actualizarSolicitud,
  eliminarSolicitud
} = require('../controllers/solicitudes')

const router = Router()

router.get('/', obtenerSolicitudes)
router.get('/:id', obtenerSolicitud)
router.post('/', crearSolicitud)
router.put('/:id', actualizarSolicitud)
router.delete('/:id', eliminarSolicitud)

module.exports = router
