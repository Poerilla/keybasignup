/**
 * This is the main javascript which communicates with the renderer process throught the ipcMain module
 * 
 * issues:
 *      The communication between the two modules is buggy
 *      Crypto may be a little buggy but successfully added to the signup sequence
 *      A successful signup page has not yet been developed
 * 
 */


const { app, BrowserWindow, ipcMain }   = require('electron');
const requestModule                     = require('request');
const triplesec                         = require('triplesec');
const crypto                            = require('crypto-browserify');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

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

// Listen for async message from login renderer process
ipcMain.on('async', (event, arg) => {
    
    let userData = JSON.parse(arg);
    // Process user Data
    userData.salt = crypto.randomBytes(16).toString('hex');
    userData.pwh = process_raw_signup_userData(userData);
    console.log(userData);
    // Post the user data and store the reponse for further analysis
    let keybase_Response = post_to_keybase(userData);
    //include some logic and checks here to generate a reply

    // Reply on async message from renderer process
    event.returnValue = JSON.stringify(keybase_Response);

    event.sender.send('async-reply', JSON.stringify(keybase_Response));

    console.log('sent response');
});

/**Post to Keybase
 * 
 */
function post_to_keybase(userData) {

    //let url = `https://keybase.io/_/api/1.0/signup.json`;

    // console.log(userData.name);
    
    let requestObject = {
        url: `https://keybase.io/_/api/1.0/signup.json` +
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