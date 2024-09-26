module.exports = {
    'Home page test': function (client) {
        client
            .url('http://localhost:8000')
            .waitForElementPresent('body', 5000)
            .assert.containsText('h1.introduction', 'Trouvez ici les entreprises')
            .end();
    }
};
