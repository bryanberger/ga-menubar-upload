const {app, Menu, Tray} = require('electron')
const path = require('path'),
      request = require('request'),
      os = require('os'),
      fs = require('fs'),
      env = require('./env.json');
      endpoint = env.ENDPOINT,
      token = env.TOKEN,
      extensions = ['.png', '.jpg', '.jpeg', '.gif']

let tray = null
let username = os.userInfo().username

app.dock.hide()

app.on('ready', () => {
  tray = new Tray(__dirname + '/assets/icon_Template.png')
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Quit', click () { app.quit() }},
  ])
  tray.setToolTip('Drag Images here to upload them to the Product Dashboard TV')
  tray.setContextMenu(contextMenu)
  tray.on('drop-files', (event, files) => {
    files.map((file) => {
      let ext = path.extname(file).toLowerCase()
      if(extensions.indexOf(ext) > -1) {
        let options = {
          url: endpoint,
          headers: {
            'User-Agent': 'Electron Menubar'
          },
          formData: {
            'sketchartboard': fs.createReadStream(file),
            'filename': path.basename(file),
            'user': username,
            'id': token
          }
        }
        request.post(options, function optionalCallback(err, httpResponse, body) {
          if (err) {
            return console.error('upload failed:', err);
          }
        })
      }
    })
  })
})
