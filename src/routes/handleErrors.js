const ERRORS = {
  dafaultError: (res) => {
    return res.status(500).json('Ups')
  },
  SequelizeDatabaseError: (res) => {
    return res.status(400).json('Error de sintaxis el id debe ser del tipo UUID')
  },
  TypeError: (res, _err) => {
    return res.status(403).json('Error de tipo A clasificar')
  },
  Error: (res, _err) => {
    return res.status(404).json('Not Found')
  },
  SequelizeUniqueConstraintError: (res, err) => {
    return res.status(406).json('Error el nombre debe ser UNICO')
  },
  SequelizeValidationError: (res, err) => {
    return res.status(500).json('Error al cargar los datos en la BD')
  }
}

module.exports = (err, _req, res, _next) => {
  console.error(err) // eslint-disable-line no-console
  const handler = ERRORS[err.name] || ERRORS.dafaultError
  handler(res)
}
