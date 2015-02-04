/**
 * Module dependencies
 */

var WritableStream = require('stream').Writable;
var _ = require('lodash');
var UPYUN = require('upyun');


/**
 * A simple receiver for Skipper that writes Upstreams to
 * upyun at the configured path.
 *
 * Includes a garbage-collection mechanism for failed
 * uploads.
 *
 * @param  {Object} options
 * @return {Stream.Writable}
 */
module.exports = function buildDiskReceiverStream(options) {
  options = options || {};
  var log = options.log || function noOpLog(){};

  _.defaults(options, {

    // // The default `saveAs` implements a unique filename by combining:
    // //  • a generated UUID  (like "4d5f444-38b4-4dc3-b9c3-74cb7fbbc932")
    // //  • the uploaded file's original extension (like ".jpg")
    // saveAs: function(__newFile, cb) {
    //   return cb(null, UUIDGenerator.v4() + path.extname(__newFile.filename));
    // },

    // Bind a progress event handler, e.g.:
    // function (milestone) {
    //   milestone.id;
    //   milestone.name;
    //   milestone.written;
    //   milestone.total;
    //   milestone.percent;
    // },
    endpoing: 'v0',
    apiVersion: 'legacy',

    // Upload limit (in bytes)
    // defaults to ~15MB
    maxBytes: 15000000,

    // Upload limit for per coming file (in bytes)
    // falsy means no limit
    perMaxBytes: 15000000,

    // Upload limit for per file (in content-type)
    // falsy means accept all the type
    acceptTypes: null

  });


  var receiver__ = WritableStream({ objectMode: true });

  // if onProgress handler was provided, bind an event automatically:
  if (_.isFunction(options.onProgress)) {
    receiver__.on('progress', options.onProgress);
  }

  // Track the progress of all file uploads that pass through this receiver
  // through one or more attached Upstream(s).
  receiver__._files = [];

  // Keep track of the number total bytes written so that maxBytes can
  // be enforced.
  var totalBytesWritten = 0;


  // This `_write` method is invoked each time a new file is received
  // from the Readable stream (Upstream) which is pumping filestreams
  // into this receiver.  (filename === `__newFile.filename`).
  receiver__._write = function onFile(__newFile, encoding, done) {
    var upyun = new UPYUN(options.bucket, options.operator, options.password, options.endpoing, options.legacy),
        buffers = [];

    // Check the file limit
    if (options.perMaxBytes && __newFile.byteCount > options.perMaxBytes){
      return done(new Error('The file \'' + __newFile.filename + '\' beyond size limit, only accept less than ' + options.perMaxBytes + ' bytes'));
    }
    if (options.acceptTypes && options.acceptTypes.indexOf(__newFile.headers['content-type']) === -1){
      return done(new Error('Content-type of the file \'' + __newFile.filename + '\' does not accepted'));
    }

    // Determine the file descriptor-- the unique identifier.
    // Often represents the location where file should be written.
    __newFile.fd;
    var uploadDir = __newFile.fd;
    if (uploadDir.substr(0, 1) !== '/'){
      uploadDir = '/' + uploadDir;
    }

    // When then 'data' event emited, push the chunk to the buffers array.
    __newFile.on('data', function(chunk) {
      buffers.push(chunk);
    })

    // When the 'end' event emited, upload the 'buffers' to the upyun server.
    __newFile.on('end', function () {
      var buffer = Buffer.concat(buffers);
      upyun.uploadFile(uploadDir, buffer, __newFile.headers['content-type'], true, function (err, data) {
        if (err){
          return done(err);
        }
        if (!data){
          return done(new Error('Upload failed!'));
        }
        if (data && data.statusCode != 200){
          return done(new Error(data.error['message']));
        }
        __newFile.fd = options.domain + uploadDir;
        return done();
      })
    })

  };

  return receiver__;
}; // </DiskReceiver>
