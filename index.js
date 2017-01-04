var SamsungRemote = require('samsung-remote')
var remote = new SamsungRemote({
    ip: process.env.IP
})

var basicAuth = require('basic-auth-connect')
var bashScript = '/home/pi/Development/smart-home-samsung-tv/lirc_command.sh '
var express = require('express')
var app = express()

app.use(basicAuth(process.env.USER, process.env.PASSWORD))

var exec = require('child_process').exec
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

app.get('/chinese_automation', function(req, res) {
  exec('/home/pi/Development/smart-home-samsung-tv/chinese_automation.sh', function(error, stdout, stderr) {
    if(error != null) {
      res.json('Could not start chinese programming')
    } else {
      res.json('Started chinese programming')
    }
  })
})

app.get('/chinese_power', function(req, res) {
  exec(bashScript + 'Chinese KEY_POWER', function(error, stdout, stderr) {
    if(error != null) {
      res.json('Could not turn Chinese box on')
    } else {
      res.json('Turned Chinese box on')
    }
  })
})

app.get('/chinese_left', function(req, res) {
  exec(bashScript + 'Chinese KEY_LEFT', function(error, stdout, stderr) {
    if(error != null) {
      res.json('Could not move left')
    } else {
      res.json('Moved left')
    }
  })
})

app.get('/chinese_right', function(req, res) {
  exec(bashScript + 'Chinese KEY_RIGHT', function(error, stdout, stderr) {
    if(error != null) {
      res.json('Could not move right')
    } else {
      res.json('Moved right')
    }
  })
})

app.get('/chinese_up', function(req, res) {
  exec(bashScript + 'Chinese KEY_UP', function(error, stdout, stderr) {
    if(error != null) {
      res.json('Could not move up')
    } else {
      res.json('Moved up')
    }
  })
})

app.get('/chinese_down', function(req, res) {
  exec(bashScript + 'Chinese KEY_DOWN', function(error, stdout, stderr) {
    if(error != null) {
      res.json('Could not move down')
    } else {
      res.json('Moved down')
    }
  })
})

app.get('/chinese_ok', function(req, res) {
  exec(bashScript + 'Chinese KEY_OK', function(error, stdout, stderr) {
    if(error != null) {
      res.json('Could not perform enter action')
    } else {
      res.json('Performed enter action')
    }
  })
})

app.get('/chinese_home', function(req, res) {
  exec(bashScript + 'Chinese KEY_HOME', function(error, stdout, stderr) {
    if(error != null) {
      res.json('Could not go to home')
    } else {
      res.json('Returned to home')
    }
  })
})

app.get('/chinese_back', function(req, res) {
  exec(bashScript + 'Chinese KEY_BACK', function(error, stdout, stderr) {
    if(error != null) {
      res.json('Could not go back')
    } else {
      res.json('Performed back action')
    }
  })
})


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

app.get('/on', function(req, res) {
  exec(bashScript + 'Samsung KEY_POWER', function(error, stdout, stderr) {
    if(error != null) {
      res.json('Could not toggle TV power')
    } else {
      res.json('Toggled TV power')
    }
  })
})

app.get('/aux_toggle', function(req, res) {
  exec(bashScript + 'Bluray BD_POWER', function(error, stdout, stderr) {
    if(error != null) { 
      res.json('Could not turn sound system on')
    } else {
      res.json('Turned sound system on')
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
