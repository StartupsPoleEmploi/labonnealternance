module.exports = {
    'Home page test': function (client) {
        client
            .url('localhost:8000')
            .waitForElementPresent('body', 60000)
            .assert.containsText('h1.introduction', 'Trouvez ici les entreprises')
            .end();
    }
};
