
# Upyun Adapter for Skipper

[![npm version](https://img.shields.io/npm/v/skipper-upyun.svg?style=flat)](https://www.npmjs.com/package/skipper-upyun) 
[![NPM downloads](https://img.shields.io/npm/dm/skipper-upyun.svg?style=flat)](https://www.npmjs.com/package/skipper-upyun)


Upyun adapter for receiving [upstreams](https://github.com/balderdashy/skipper#what-are-upstreams). Particularly useful for handling streaming multipart file uploads from the [Skipper](https://github.com/balderdashy/skipper) body parser.


## Installation

```
$ npm install skipper-upyun --save
```

Also make sure you have skipper itself [installed as your body parser](http://beta.sailsjs.org/#/documentation/concepts/Middleware?q=adding-or-overriding-http-middleware).  This is the default configuration in [Sails](https://github.com/balderdashy/sails) as of v0.10.


## Usage

```
javascript
req.file('filename')
.upload({
  adapter: require('skipper-upyun'),
  bucket: 'YOUR_UPYUN_BUCKET_NAME',
  operator: 'OPERATOR_TO_BUCKET',
  password: 'PASSWORD_FOR_OPERATOR',
  endpoint: 'YOUR_ENDPOINT',
  apiVersion: 'API_VERSION'
}, function whenDone(err, uploadedFiles) {
  if (err) return res.badRequest(err);
  else return res.ok({
    files: uploadedFiles,
    textParams: req.params.all()
  });
});
```
## Options
 Option      | Type                           | Description
 ----------- | -------------------------------| --------------
 dirname     | ((string))                     | Optional. The path to the directory on the remote filesystem where file uploads should be streamed.
 bucket      | ((string))                     | Your upyun bucket's name.
 operator    | ((string))                     | Operator which is granted permisson to bucket
 password    | ((string))                     | Passowrd for the operator which is granted permisson to bucket
 endpoint    | ((string))                     | The value can be these(leave blank to let sdk auto select the best one): `ctcc` or `v1`: China Telecom、`cucc` or `v2`: China Unicom、`cmcc` or `v3` China Mobile、`v0` or any other string: Will use `v0.api.upyun.com` (auto detect routing)
 apiVersion  | ((string))                     | API version
 perMaxBytes | ((integer))                     | Upload limit for per coming file (in bytes), falsy means no limit
 acceptTypes | ((array))                     | Upload limit for per file (in content-type), falsy means accept all the type

For more detailed information of Upyun, see the [Upyun sdk](https://github.com/upyun/node-upyun#Init)



## License

**[MIT](./LICENSE)**
&copy; 2015, 

[Huang JerryC](http://huang-jerryc.com),

See `LICENSE.md`.
