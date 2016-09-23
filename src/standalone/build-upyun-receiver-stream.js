/*
 * @Author: JerryC (huangjerryc@gmail.com)
 * @Date: 2016-09-23 16:16:39
 * @Last Modified by:   JerryC
 * @Last Modified time: 2016-09-23 16:16:39
 * @Description
 */

/**
 * Module dependencies
 */
var WritableStream = require('stream').Writable;
var _ = require('lodash');
var UPYUN = require('upyun');

/**
 * Upload the file to remote service of upyun
 * @param  {} path
 * @param  {} file
 * @param  {} __newFile
 * @param  {} done
 */
function uploadToUpyun(path, file, __newFile, done) {
  var options = this.options;
  var upyun = new UPYUN(options.bucket, options.operator, options.password, options.endpoing, options.apiVersion);
  upyun.uploadFile(path, file, __newFile.headers['content-type'], true, function (err, data) {
    if (err) {
      return done(err);
    }
    if (!data) {
      return done(new Error('Upload failed!'));
    }
    if (data && data.statusCode != 200) {
      return done(new Error(data.error['message']));
    }
    __newFile.fd = options.domain + path;
    return done();
  });
}

/**
 * Packaging actions of receiver__._write
 * @param  {} __newFile
 * @param  {} encoding
 * @param  {} done
 */
function onFile(__newFile, encoding, done) {
  var buffers = [];
  var options = this.options;

  // Check the file limit
  if (options.perMaxBytes && __newFile.byteCount > options.perMaxBytes) {
    return done(new Error('The file \'' + __newFile.filename + '\' beyond size limit, only accept less than ' + options.perMaxBytes + ' bytes'));
  }

  // Check the accept content type
  if (options.acceptTypes && options.acceptTypes.indexOf(__newFile.headers['content-type']) === -1) {
    return done(new Error('Content-type of the file \'' + __newFile.filename + '\' does not accepted'));
  }

  // Determine the file descriptor-- the unique identifier.
  // Often represents the location where file should be written.
  __newFile.fd;
  var uploadDir = __newFile.fd;
  if (uploadDir.substr(0, 1) !== '/') {
    uploadDir = '/' + uploadDir;
  }

  // When then 'data' event emited, push the chunk to the buffers array.
  __newFile.on('data', function (chunk) {
    buffers.push(chunk);
  });

  // When the 'end' event emited, upload the 'buffers' to the upyun server.
  __newFile.on('end', function () {
    var buffer = Buffer.concat(buffers);
    uploadToUpyun.bind({options})(uploadDir, buffer, __newFile, done);
  });
}

/**
 * A upyun receiver for Skipper that writes Upstreams to
 * upyun at the configured path.
 *
 * @param  {Object} opts
 * @return {Stream.Writable}
 */
function buildUpyunReceiverStream(opts) {
  var options = opts || {};

  _.defaults(options, {

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
    acceptTypes: null,

  });

  var receiver__ = WritableStream({ objectMode: true });

  // if onProgress handler was provided, bind an event automatically:
  if (_.isFunction(options.onProgress)) {
    receiver__.on('progress', options.onProgress);
  }

  // Track the progress of all file uploads that pass through this receiver
  // through one or more attached Upstream(s).
  receiver__._files = [];

  // This `_write` method is invoked each time a new file is received
  // from the Readable stream (Upstream) which is pumping filestreams
  // into this receiver.  (filename === `__newFile.filename`).
  receiver__._write = onFile.bind({options});

  return receiver__;
}

module.exports = buildUpyunReceiverStream;
