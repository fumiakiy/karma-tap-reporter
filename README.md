# karma-tap-reporter

> VERY simple Karma plugin to report test results in TAP.

## Installation

`package.json`
```json
{
  "devDependencies": {
    "karma": "~0.10",
    "karma-tap-reporter": "~0.0.4"
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

Optionally you can save report to a file and turn off output the console
```js
reporters: ['tap'],

tapReporter: {
  outputFile: './unit.tap',
  stdout: false 
}
```
----

For more information on Karma see the [homepage].

[homepage]: http://karma-runner.github.com
