const browserStackCredentials = require("./browserstack.credentials.js");

nightwatch_config = {
    src_folders: ["tests-e2e"],

    selenium: {
        "start_process": false,
        "host": "hub-cloud.browserstack.com",
        "port": 80
    },

    common_capabilities: {
        'build': 'nightwatch-browserstack',
        'browserstack.user': browserStackCredentials.user,
        'browserstack.key': browserStackCredentials.key,
        'browserstack.console': "errors",
        'project': 'labonnealternance'
    },

    // For generating new capabilities
    // ==> https://www.browserstack.com/automate/nightwatch
    test_settings: {
        default: {},
        chrome: {
            desiredCapabilities: {
                'browser': 'chrome',
                'resolution': '1024x768'
            }
        },
        firefox: {
            desiredCapabilities: {
                'browser': 'firefox',
                'resolution': '1024x768'
            }
        },
        safariHighSierra: {
            desiredCapabilities: {
                'os': 'OS X',
                'os_version': 'High Sierra',
                'browser': 'Safari',
                'browser_version': '11.0',
                'resolution': '1024x768'
            }
        },
        edge: {
            desiredCapabilities: {
                'browser': 'Edge',
                'browser_version': '16.0',
                'resolution': '1024x768'
            }
        },
    },

    "test_workers": {
        "enabled": true,
        "workers": 10
    }
};

// Code to support common capabilites
for (var i in nightwatch_config.test_settings) {
    var config = nightwatch_config.test_settings[i];
    config['selenium_host'] = nightwatch_config.selenium.host;
    config['selenium_port'] = nightwatch_config.selenium.port;
    config['desiredCapabilities'] = config['desiredCapabilities'] || {};
    config['desiredCapabilities'];
    for (var j in nightwatch_config.common_capabilities) {
        config['desiredCapabilities'][j] = config['desiredCapabilities'][j] || nightwatch_config.common_capabilities[j];
    }
}

module.exports = nightwatch_config;