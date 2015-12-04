var TAPReporter = function(baseReporterDecorator, config, logger, helper) {
  var tapReporterConfig = config.tapReporter || {},
    disableStdout = !!tapReporterConfig.disableStdout,
    log = logger.create('karma-tap-reporter'),
    _this = this,
    output = '',
    path = require('path'),
    fs = require('fs'),
    EOL = require('os').EOL,
    numbers, outputFile;

  /**
   * save all data that is coming in to the `data` variable for later use and
   * proxy input to `this.write`
   */
  function write(data) {
    output = output + data;
    if (!disableStdout) {
      _this.write(data);
    }
  }

  if (tapReporterConfig.outputFile) {
    outputFile = path.resolve(config.basePath, tapReporterConfig.outputFile)
  }

  baseReporterDecorator(this);

  this.onRunStart = function() {
    numbers = new Object();
  };

   this.onBrowserStart = function(browser) {
     numbers[browser.id] = 0;
  };

  this.specSuccess = function(browser, result) {
    write("ok " + ++numbers[browser.id] + " " + result.suite.join(' ').replace(/\./g, '_') + " " + result.description + EOL);
  };

  this.specFailure = function(browser, result) {
    write("not ok " + ++numbers[browser.id] + " " + result.suite.join(' ').replace(/\./g, '_') + " " + result.description + EOL);
  };

  this.specSkipped = function(browser, result) {
    write("ok " + ++numbers[browser.id] + " " + "# skip " + result.suite.join(' ').replace(/\./g, '_') + " " + result.description + EOL);
  };

  this.onRunComplete = function(browsers, results) {
    var total = 0;
    browsers.forEach(function(browser, id) {
      total += browser.lastResult.total;
    });
    write("1.." + total + EOL);

  if (outputFile) {
			helper.mkdirIfNotExists(path.dirname(outputFile), function (err) {
				if (err) {
					return log.error('error writing report to file: ' + err);
				}
				log.info('writing report to file: ' + outputFile);
				fs.writeFileSync(outputFile, output);
			});
		}
  };
};

TAPReporter.$inject = ['baseReporterDecorator', 'config', 'logger', 'helper'];

module.exports = {
  'reporter:tap': ['type', TAPReporter]
};
