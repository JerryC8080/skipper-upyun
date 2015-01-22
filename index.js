/**
 * Module dependencies
 */

var r_buildDiskReceiverStream = require('./standalone/build-disk-receiver-stream');


/**
 * skipper-upyun
 *
 * @type {Function}
 * @param  {Object} options
 * @return {Object}
 */

module.exports = function DiskStore(options) {

  options = options || {};

  var log = options.log || function _noOpLog() {};

  var adapter = {

    rm: function(fd, cb) {
      // TODO
    },

    ls: function(dirpath, cb) {
      // TODO
    },

    read: function(fd, cb) {
        // TODO
    },

    receive: function (options){
      return r_buildDiskReceiverStream(options);
    }
  };

  return adapter;
};
