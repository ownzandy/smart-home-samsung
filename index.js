var SamsungRemote = require('samsung-remote')
var remote = new SamsungRemote({
    ip: '192.168.0.4'
})

var express = require('express')
var app = express()

var sleep = require('sleep');

app.get('/vol_up', function (req, res) {
  multipleKey('KEY_VOLUP', 'Volume increased', {'error': 'Failed to increase volume'}, 10, 250, function callback(response) {
    res.json(response)
  })
})

app.get('/vol_down', function (req, res) {
  multipleKey('KEY_VOLDOWN', 'Volume decreased', {'error': 'Failed to decrease volume'}, 10, 250, function callback(response) {
    res.json(response)
  })
})

var multipleKey = function(key, success, error, counter, interval, cb) {
  var count = 0
  var intervalOn = true
  var interval = setInterval(function(){ 
    if(count == counter) {
      clearInterval(interval)
      intervalOn = false
      return cb(success)
    } else if(intervalOn) {
      remote.send(key, function callback(err) {
          if (err) {
            clearInterval(interval)
            if(intervalOn) {
              intervalOn = false
              return cb(error)
            }
          } else {
            count += 1
          }
      });
    }
  }, interval)
}

app.get('/off', function (req, res) {
  remote.send('KEY_POWEROFF', function callback(err) {
      if (err) {
        res.json({'error': 'Failed to power off'})
      } else {
        res.json('Powered TV off')
      }
  })
})

app.get('/chinese', function (req, res) {
  remote.send('KEY_TV', function callback(err) {
      if (err) {
        res.json({'error': 'Failed to change to TV source'})
      } else {
        sleep.sleep(2)
        multipleKey('KEY_HDMI', 'Switched to Chinese Source', 'Failed to switch to Chinese source', 2, 2000, function callback(response) {
          res.json(response)
        })
      }
  })
})

var server = app.listen(process.env.PORT || 8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})
