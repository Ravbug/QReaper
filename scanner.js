const QrCode = require('qrcode-reader');
const Jimp = require("jimp");
const request = require('request').defaults({ encoding: null });    //null encoding outputs a buffer


//configure QR
let qr = new QrCode();
qr.callback = function(error, result) {
    if(error) {
      console.error(error)
      return;
    }
    console.log(result)
  }

/**
 * Downloads an image async and returns a buffer
 * @param {string} url the URL to the image to download
 * @return resolves the downloaded buffer
 */
async function downloadBuffer(url){
    return new Promise(function(resolve,reject){
        request.get(url, function (err, res, buffer) {
            resolve(buffer);
      });
    });
}

/**
 * Attempts to read an image at a URL as a QR code.
 * @param {string} url url to the image
 * @return resolves undefined if image could not be read as a QR code. Resolves with the contents if the 
 *          image is a scannable QR code.
 */
async function scanURL(url){
    return new Promise(async function(resolve,reject){
        //download image
        let buffer = await downloadBuffer(url);
        
        //read it with Jimp
        Jimp.read(buffer,function(err,img){
            if (err){
                console.error(err);
            }
            else{
                let qr = new QrCode();
                qr.callback = function(err,value){
                    if (err){
                        //unable to scan the image as a QR code, so safe
                        resolve(undefined);
                    }
                    else{
                        resolve(value);
                    }
                }
                qr.decode(img.bitmap);
            }
        });
    });
}
exports.scanURL = scanURL;