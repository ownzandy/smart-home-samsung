var SamsungRemote = require('samsung-remote')
var remote = new SamsungRemote({
    ip: '192.168.0.9'
})

var express = require('express')
var app = express()

var sleep = require('sleep');

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

app.get('/mute', function(req, res) {
  remote.send('KEY_MUTE', function callback(err) {
      if (err) {
        res.json('Could not mute your TV')
      } else {
        res.json('Your TV was muted or un-muted')
      }
  })
})

app.get('/vol_up', function(req, res) {
  multipleKey('KEY_VOLUP', 'Your volume was increased', 'Could not turn up the volume', 5, 250, function callback(response) {
    res.json(response)
  })
})

app.get('/vol_down', function(req, res) {
  multipleKey('KEY_VOLDOWN', 'Your volume was decreased', 'Could not decrease the volume', 5, 250, function callback(response) {
    res.json(response)
  })
})

app.get('/off', function(req, res) {
  remote.send('KEY_POWEROFF', function callback(err) {
      if (err) {
        res.json('Could not turn TV off')
      } else {
        res.json('Turned TV Off')
      }
  })
})

app.get('/hdmiOne', function(req, res) {
  remote.send('KEY_TV', function callback(err) {
      if (err) {
        res.json('Failed to change to TV source')
      } else {
        sleep.sleep(2)
        remote.send('KEY_HDMI', function callback(err) {
          if (err) {
            res.json('Could not switch TV to HDMI one')
          } else {
            res.json('TV was switched to HDMI one')
          }
        })
      }
  })
})

app.get('/hdmiTwo', function(req, res) {
  remote.send('KEY_TV', function callback(err) {
      if (err) {
        res.json('Failed to change to TV source')
      } else {
        sleep.sleep(1)
        multipleKey('KEY_HDMI', 'TV was switched to HDMI two', 'Could not switch TV to HDMI two', 2, 1000, function callback(response) {
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
