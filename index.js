const path = require('path')
const fs = require('fs')
const app = require('express')()

app.use('/:file', (req, res) => {
  res.sendFile(path.join(__dirname, req.params.file))
})

app.listen(8000)
