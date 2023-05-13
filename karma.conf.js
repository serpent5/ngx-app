const path = require("path");

module.exports = function (c, projectName) {
  const configOptionsDefaults = {
    browsers: ["ChromeHeadless"],
    client: {
      clearContext: false
    },
    coverageReporter: {
      dir: path.join(__dirname, "reports", projectName, "coverage"),
      subdir: ".",
      reporters: [{ type: "text-summary" }]
    },
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-coverage"),
      require("@angular-devkit/build-angular/plugins/karma")
    ],
    reporters: ["coverage"],
    restartOnFileChange: true
  };

  const configOptionsDevelopment = {
    coverageReporter: {
      ...configOptionsDefaults.coverageReporter,
      reporters: [
        ...configOptionsDefaults.coverageReporter.reporters,
        { type: "html" }
      ]
    },
    plugins: [
      ...configOptionsDefaults.plugins,
      require("karma-mocha-reporter")
    ],
    reporters: [...configOptionsDefaults.reporters, "mocha"]
  };

  const configOptionsCI = {
    coverageReporter: {
      ...configOptionsDefaults.coverageReporter,
      reporters: [
        ...configOptionsDefaults.coverageReporter.reporters,
        { type: "cobertura" }
      ]
    },
    junitReporter: {
      outputDir: path.join(__dirname, "reports", projectName, "junit")
    },
    plugins: [
      ...configOptionsDefaults.plugins,
      require("karma-junit-reporter")
    ],
    reporters: [...configOptionsDefaults.reporters, "junit"],
    singleRun: true
  };

  c.set({
    ...configOptionsDefaults,
    ...(isCI() ? configOptionsCI : configOptionsDevelopment)
  });
};

function isCI() {
  return process.env["PIPELINE_WORKSPACE"] != null; // Azure DevOps?
}
