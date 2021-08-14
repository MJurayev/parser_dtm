const parserRoutes = require('../routes/parser')
module.exports = (app) => {
    app.use('/api/parse', parserRoutes)
}