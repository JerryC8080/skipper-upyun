'use strict';

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

    rm: function rm(fd, cb) {
      // TODO
    },

    ls: function ls(dirpath, cb) {
      // TODO
    },

    read: function read(fd, cb) {
      // TODO
    },

    receive: function receive(options) {
      return receiverStream(options);
    }
  };

  return adapter;
};