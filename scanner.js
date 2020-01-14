const QrCode = require('qrcode-reader');
const Jimp = require("jimp");
const jsqr = require("jsqr");
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
 * Attempts to read an image at a URL as a QR code. Uses both qrcode-reader and jsqr
 * @param {string} url url to the image
 * @return resolves undefined if image could not be read as a QR code. Resolves with the contents if the 
 *          image is a scannable QR code.
 */
async function scanURL(url){
    return new Promise(async function(resolve,reject){
        //download image
        let buffer = await downloadBuffer(url);
        
        //read it with Jimp
        Jimp.read(buffer,async function(err,img){
            if (err){
                console.error(err);
            }
            else{
                //try the tests
               let test1 = await JSQRScan(img.bitmap.data,img.bitmap.width,img.bitmap.height);
               if (test1){
                   resolve(test1);
               }
               else{
                    resolve(QRCodeReaderScan(img.bitmap));
               }
            }
        });
    });
}
exports.scanURL = scanURL;

/**
 * Attempts to read a QR code using qrcode-reader
 * @param {Jimp.image} bitmap 
 * @return resolves with the value if it could be read, undefined if it could not
 */
async function QRCodeReaderScan(bitmap){
    return new Promise(function(resolve,reject){
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
        qr.decode(bitmap);
    });
}

/**
 * Attempts to read a QR code using jsQR
 * @param {Uint8ClampedArray} uint8array image data
 * @param {number} width the width in pixels of the image
 * @param {number} height the height in pixels of the image
 * @returns the data if there is any, or undefined
 */
function JSQRScan(uint8array,width,height){
    let code = jsqr(uint8array,width,height,{inversionAttempts:"attemptBoth"});
    if (code){
        return code.data;
    }
    return undefined;
}