var TAPReporter = function(baseReporterDecorator, config, logger, helper) {
  var tapReporterConfig = config.tapReporter || {},
    disableStdout = !!tapReporterConfig.disableStdout,
    log = logger.create('karma-tap-reporter'),
    _this = this,
    output = '',
    path = require('path'),
    fs = require('fs'),
    EOL = require('os').EOL,
    numbers, outputFile,
    currentSuite;

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

  function writeSuite(suite) {
    suite = suite.join(' ').replace(/\./g, '_');
    if (currentSuite != suite) {
      write(suite);
      currentSuite = suite;
    }
  }

  if (tapReporterConfig.outputFile) {
    outputFile = path.resolve(config.basePath, tapReporterConfig.outputFile)
  }

  baseReporterDecorator(this);

  this.onRunStart = function() {
    numbers = new Object();
    write('TAP version 13' + EOL);
  };

  this.onBrowserStart = function(browser) {
    numbers[browser.id] = 0;
  };

  this.specSuccess = function(browser, result) {
    writeSuite(result.suite);
    write('ok ' + ++numbers[browser.id] + ' ' + result.description + EOL);
  };

  this.specFailure = function(browser, result) {
    var resultLog = JSON.parse(result.log[0]);
    writeSuite(result.suite);
    write('not ok ' + ++numbers[browser.id] + ' ' + result.description + EOL);
    write('  ---' + EOL);
    for (var key in resultLog) {
      write('    ' + key + ': ' + resultLog[key] + EOL);
    }
    write('  ...' + EOL);
  };

  this.specSkipped = function(browser, result) {
    write('# SKIP' + ' ' + result.description);
  };

  this.onRunComplete = function(browsers, results) {
    var total = 0, success = 0, failed = 0;
    browsers.forEach(function(browser, id) {
      total += browser.lastResult.total;
      success += browser.lastResult.success;
      failed += browser.lastResult.failed;
    });

    write(EOL);
    write('1..' + total + EOL);
    write('# tests ' + total + EOL);
    write('# pass  ' + success + EOL);
    if (failed) {
      write('# fail  ' + failed + EOL);
    }
    write(EOL);
    if (!failed) {
      write('# ok' + EOL);
    }
    write(EOL);

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
