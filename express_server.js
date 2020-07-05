const express = require("express")

const app = express()

app.use((req, res, next) => {
  const start = new Date()
  res.locals.start = start
  next()
})

app.use((req, res, next) => {
  res.write('hello world')
  for (let i = 0; i <= 10000; i++) {
    res.write('hello world')
  }
  res.end()
  next()
})


app.use((req, res, next) => {
  const time = new Date().valueOf() - res.locals.start
  console.log('time: ' + time)
  next()
})

app.listen(3000)
