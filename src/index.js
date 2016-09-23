/**
 * Module dependencies
 */

import receiverStream from './standalone/build-upyun-receiver-stream';

/**
 * skipper-upyun
 *
 * @type {Function}
 * @param  {Object} options
 * @return {Object}
 */

export default function UpyunStore(options) {

  options = options || {};

  let log = options.log || function _noOpLog() {};

  let adapter = {

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
    },
  };

  return adapter;
}
