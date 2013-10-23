/**
 * Redis module
 */

var util = require('util');
var redis = require('redis');

var config = require('../config').redis;

function RedisClient() {
  if (config && config.host && config.port)
    return redis.createClient(config.port, config.host);
  return redis.createClient();
}

var RedisClient = new RedisClient();

RedisClient.on('error', function (err) {
  util.log('[redis] ' + err.message);
});

var t = setTimeout(function () {
  util.log('[redis] failed to connect ' + config.host + ':' + config.port);
  throw new Error('[redis] connection failure');
}, 5000);

RedisClient.on('ready', function () {
  clearTimeout(t);
  util.log('[redis] connected!');
});

module.exports = RedisClient;
