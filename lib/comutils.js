var uidcache = {};
var CACHE_LIMIT = 0.5 * 60 * 1000;

var utils = {
  /**
   * @returns local time in format YYYY-MM-DD HH:MM:SS
   **/
  currentTime: function () {
    return this.formatTime(new Date());
  },

  /**
   * @returns local time in format YYYY-MM-DD HH:MM:SS
   * Removes the GMT/IST markers that give us trouble
   * with node-mysql
   * @params date
   **/
  formatTime: function (d) {
    if (typeof d === 'string') {
      d = new Date(d);
    }

    return this.format(d, 'YYYY-MM-DD hh:mm:ss');
  },

  isNotEmptyString: function (str, def) {
    var code = (str && this.stringTrim(str) !== '');
    if (def === undefined) {
      def = false;
    }
    return code ? str : def;
  },

  isEmptyObject: function (obj) {
    var key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  },

  format: function (date, format) {
    if (typeof date === 'number' || typeof date === 'string') {
      date = new Date(date);
    }

    if (isNaN(date.getTime())) {
      return '';
    }

    if (!format) {
      format = 'YYYY-MM-DD HH:mm:ss';
    }

    var hours = date.getHours();
    var ttime = 'AM';
    if (format.indexOf('t') > -1 && hours > 12) {
      hours = hours - 12;
      ttime = 'PM';
    }

    var o = {
      'M+': date.getMonth() + 1,
      'D+': date.getDate(),
      'h+': hours,
      'H+': hours,
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      'S': date.getMilliseconds(),
      't+': ttime
    };

    if (/(Y+)/.test(format)) {
      format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
      }
    }

    return format;
  },

  uid: function (length) {
    length = length || 7;

    var uid = Math.floor(Math.random() * 10) + (Math.random() * (1 << 30)).toString(36).replace('.', '');
    uid = utils.pad(uid, length, 'X').substring(0, length);

    if (uidcache[uid]) {
      return utils.uid(length);
    }

    // add generated uid to cache
    uidcache[uid] = 1;

    // clear uid from cache
    setTimeout(function () {
      delete uidcache[uid];
    }, CACHE_LIMIT);

    return uid;
  },

  pad: function (n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  },

  /**
   * Simple email validation
   *  - ensures at least one `@` sign, at least one char in local part, at least one `.` in domain part and is at least one char long
   */
  isEmail: function (em) {
    em = em + '';
    var indx = em.lastIndexOf('@');
    return indx > 0 && (em.lastIndexOf('.') > indx) && (em.length - indx > 1);
  },

  isTrue: function (str) {
    if (typeof str === 'undefined') return false;
    switch ((str + '').toLowerCase()) {
    case 'undefined':
    case 'false':
    case 'null':
    case 'off':
    case 'no':
    case '0':
    case '':
      return false;
    default:
      return true;
    }
  }
};

module.exports = utils;

//-- Test Code ----------------------------------------------------------
if (require.main === module) {
  (function () {
    // console.log(utils.formatTime(new Date()));
    // console.log(utils.format(new Date(), 'YYYY-MM-DD hh:mm:ss'));
    var t1 = new Date().getTime();
    var count = process.argv[2] || 100;
    for (var i = 0; i < count; i++) {
      var uid = utils.uid();
      //console.log(uid);
    }

    console.log('time taken: ' + (new Date().getTime() - t1) + 'ms');
  })();
}
