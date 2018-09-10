'use strict'

let currenApiVersion = "/api/v1";
let proxy = require('http-proxy-middleware');
let config = require('../config');

let restream = function (proxyReq, req, res, options) {
if (req.body && req.headers['content-type'] && req.headers['content-type'].indexOf('application') > -1) {
      let bodyData = JSON.stringify(req.body);
      // incase if content-type is application/x-www-form-urlencoded -> we need to change to application/json
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      // stream the content
      proxyReq.write(bodyData);
    }
}

let proxyOption = {
  target: '',
  changeOrigin: true,
  onProxyReq: restream
};

let brandOption = JSON.parse(JSON.stringify(proxyOption));
brandOption.target = config.brandAdrress;
let brandProxy = proxy(brandOption);


let adminOption = JSON.parse(JSON.stringify(proxyOption));
adminOption.target = config.adminAdrress;
let adminProxy = proxy(adminOption);

let companyOption = JSON.parse(JSON.stringify(proxyOption));
companyOption.target = config.companyAdrress;
let companyProxy = proxy(companyOption);

const attach = (app) => {

  app.use(currenApiVersion + '/brand', brandProxy);
  app.use(currenApiVersion + '/admin', adminProxy);
  app.use(currenApiVersion + '/company', companyProxy);
  app.use(currenApiVersion + '/location', brandProxy);

  return app;

}

module.exports.attach = attach;