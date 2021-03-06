const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const fs = require('fs')

const { ENV_PATH } = require('./config/path')
require('dotenv').config({ path: ENV_PATH })

const indexRouter = require('./routes/index')

const app = express()

// SQLite db connection
// Sync DB models
require('./models')

// Check requried envs

if (!process.env.JWT_SECRET) { 
	console.error('Please set JWT_SECRET env!')
	process.exit(1)
}

if (!process.env.WATOG_DOMAIN) { 
  console.error('Please set WATOG_DOMAIN env! eg: WATOG_DOMAIN=http://x.x.x.x:3000 or http://xxx.com')
  process.exit(1)
}

if (!process.env.TWILIO_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_FROM) {
  console.error('Please set the valid TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM')
  process.exit(1)
}

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(cors())
app.use(logger('dev'))
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({ extended: false, limit: '50mb' }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api', indexRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {

  
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
