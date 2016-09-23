/**
 * Module dependencies
 */

var receiverStream = require('./standalone/build-upyun-receiver-stream');


/**
 * skipper-upyun
 *
 * @type {Function}
 * @param  {Object} options
 * @return {Object}
 */

module.exports = function UpyunStore(options) {

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
      return receiverStream(options);
    }
  };

  return adapter;
};
