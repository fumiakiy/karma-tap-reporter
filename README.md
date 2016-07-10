# karma-tap-reporter

> VERY simple Karma plugin to report test results in TAP.

## Installation

`package.json`
```json
{
  "devDependencies": {
    "karma": "1.x.x",
    "karma-tap-reporter": "2.x.x"
  }
}
```

## Configuration
```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    reporters: ['tap']
  });
};
```

Optionally you can save report to a file and turn off output to the console.
```js
reporters: ['tap'],

tapReporter: {
  outputFile: './unit.tap',
  disableStdout: true
}
```
----

## TAP Protocol
Support TAP Protocol version `13`

For more information on Karma see the [homepage].

[homepage]: http://karma-runner.github.com
