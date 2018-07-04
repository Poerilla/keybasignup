/**
 * This is the main javascript which communicates with the renderer process throught the ipcMain module
 *
 * issues:
 *      The communication between the two modules is buggy
 *      Crypto may be a little buggy but successfully added to the signup sequence
 *      A successful signup page has not yet been developed: INPUT Error: bad hex string for password hash pwh
 *
 */


const { app, BrowserWindow, ipcMain }   = require('electron');
const requestModule                     = require('request');
const triplesec                         = require('triplesec');
const crypto                            = require('crypto-browserify');
const jws                               = require('jws');

const mongoose                          = require('mongoose');
var mongodb                             = require('mongodb');
const spawn                             = require('child_process').spawn;

const os                                = require('os');
/**************************************************************************************
 * Mongo DB process
 */

//Mongodb spawn process
let pipe;
// const pipe = spawn('mongod', [' —dbpath ="C:\Program Files\MongoDB\Server\3.6\bin"', ' —port', '27018']);
console.log("running on: " + os.platform());
if (os.platform() == "win32") {
  try{
    pipe = spawn('C:\\Program Files\\MongoDB\\Server\\3.6\\bin\\mongod.exe');
  }
  catch(error) {
    console.log(error);
  }
}
else {
  try{
    // pipe = spawn('mongod --dbpath=/home/poe/Projects/keybasignup/data/db');
    pipe = spawn('mongod');
  }
  catch(error){
    console.log(error);
  }

}
pipe.stdout.on('data', function (data) {
    console.log(data.toString('utf8'));
});
pipe.stderr.on('data', (data) => {
    console.log(data.toString('utf8'));
});
pipe.on('close', (code) => {
    console.log('Process exited with code: '+ code);
});

/**************************************************************************************
 * Mongoose processes
 */

mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected
    console.log('connected to database');

    // find out what we have in there
    let collections = db.collectionNames();
    for (let i = 0; i < collections.length; i++) {
        print('Collection: ' + collections[i]); // print the name of each collection
        db.getCollection(collections[i]).find().forEach(printjson); //and then print the json of each of its elements
    }
});

/**************************************************************************************
 * Build app processes
 */
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({ width: 800, height: 600 })

    // and load the index.html of the app.
    win.loadFile('views/index.html')
    console.log('login file loaded')

    // Open the DevTools.
    win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null

        // shutdown database
        console.log('application quit')
        pipe.kill('SIGINT');
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})

// Listen for async message from sign-up renderer process
ipcMain.on('sign-up', (event, arg) => {

    let userData = JSON.parse(arg);
    // Process user Data
    userData.salt = crypto.randomBytes(16).toString('hex');
    userData.pwh = process_raw_signup_userData(userData);
    console.log(userData);
    // Post the user data and store the reponse for further analysis
    let keybase_Response = post_to_keybase(userData, () => {
        // Reply on async message from renderer process
        event.returnValue = JSON.stringify(keybase_Response);

        event.sender.send('sign-up-reply', JSON.stringify(keybase_Response));
    });
    //include some logic and checks here to generate a reply

    console.log('sent response');
});

/**Post to Keybase
 *
 */
function post_to_keybase(userData) {

    //let url = `https://keybase.io/_/api/1.0/signup.json`;

    // console.log(userData.name);

    let requestObject = {
        url: `https://keybase.io/_/api/1.0/signup.json?` +
            'name=' + userData.name + '&' +
            'email=' + userData.email + '&' +
            'username=' + userData.username + '&' +
            'pwh=' + userData.pwh.toString('hex') + '&' +
            'salt=' + userData.salt + '&' +
            'invitation_id=' + userData.invitation_id + '&' +
            'pwh_version=3'
    };

    console.log(JSON.stringify(userData))
    requestModule.post(requestObject, (err, res, data) => {
        console.log(data)
        return data;
    });
}

/**Process userData
 * Use encryption tools to hash and salt user password
 */
function process_raw_signup_userData(arg) {

    // In order to generate a new salt we call resalt
    return new Promise((resolve, reject) => {
        //console.log(arg);

        let pwBuf = new Buffer(arg.pwh, 'utf8');
        let saltBuf = new Buffer(arg.salt, 'hex');

        // The high - level Encryption engine for TripleSec.
        // scrypt is included in the TripleSec library.
        let encryptor = new triplesec.Encryptor({ key: pwBuf });

        encryptor.resalt({
            salt: saltBuf,
            extra_keymaterial: 64
        }, (err, hash) => {
            if(err) {
                reject(err);
            } else {
                resolve({
                    v4: hash.extra.slice(0, 32),
                    v5: hash.extra.slice(32, 64)
                })
                // arg.pwh = hash.toString('hex');
                // console.log(arg);
                // return arg;

            }
        });
    });
}
/**************************************************************************************
 * eCertBot process
 * 
 * The following will use the Lets Encrypt servers as a test case while the local email 
 * server is still under development
 */

 // get directorty
 requestModule.get(url, (err, res, data)=> {
    if(err){ 
        throw err;
    }
    console.log(data)
 })