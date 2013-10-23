/**
 * Home
 */

var home = {
  index: function (req, res, next) {
    res.locals.title = 'ImgCrush';
    res.render('index');
  }
};

module.exports = home;

//-- Test Code ----------------------------------------------------------
if (require.main === module) {
  (function () {

  })();
}
