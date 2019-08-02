module.exports = {
    'Home page test': function (client) {
        client
            .url('http://labonnealternance.beta.pole-emploi.fr')
            .waitForElementPresent('body', 1000)
            .assert.containsText('h1.introduction', 'Trouvez ici les entreprises')
            .end();
    }
};