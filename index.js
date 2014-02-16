var TAPReporter = function(baseReporterDecorator) {
  baseReporterDecorator(this);

  var numbers = new Object();
  this.onRunStart = function(browsers) {
    browsers.forEach(function(browser, id) {
      numbers[browser.id] = 0;
    });
  };

  this.specSuccess = function(browser, result) {
    this.write("ok " + ++numbers[browser.id] + " " + result.description + "\n");
  };

  this.specFailure = function(browser, result) {
    this.write("not ok " + ++numbers[browser.id] + " " + result.description + "\n");
  };

  this.specSkipped = function(browser, result) {
    this.write("ok " + ++numbers[browser.id] + " " + "# skip " + result.description + "\n");
  };

  this.onRunComplete = function(browsers, results) {
    var total = 0;
    browsers.forEach(function(browser, id) {
      total += browser.lastResult.total;
    });
    this.write("1.." + total + "\n");
  };
};

TAPReporter.$inject = ['baseReporterDecorator', 'logger'];

module.exports = {
  'reporter:tap': ['type', TAPReporter]
};
