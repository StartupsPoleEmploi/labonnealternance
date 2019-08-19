module.exports = {
    'Company details page test': function (client) {
        var company_name;
        var siret;

        client
            // Get search results
            .url('localhost:8000/entreprises/maconnerie/nantes-44000/maçon?distance=60')

            // Wait for a first result to be visible
            .waitForElementPresent('#results .company-list-item:first-child', 10000)

            // Get some information about the first result: company siret and company name.
            .getAttribute('#results .company-list-item:first-child', 'data-siret', function (result) {
                siret = result.value;
            })
            .getAttribute('#results .company-list-item:first-child span.title', 'textContent', function (result) {
                company_name = result.value;

            })

            // Click on the first result
            .click('#results .company-list-item:first-child')
            .waitForElementVisible('.modal')
            .perform(function(client, done) {
                // Callbacks are called AFTER all commands. If we want to use a
                // variable defined in a callback, we must do it in another one.
                // See: https://github.com/nightwatchjs/nightwatch/issues/1055#issuecomment-231806314
                client.assert.containsText('.modal .company h1', company_name);
                client.assert.containsText('.modal .company .siret', siret)
                done();
            })

            // The details page should work if it's accessed using its URL only,
            // out of a search path.
            .refresh()
            .waitForElementVisible('.company')
            .perform(function(client, done) {
                client.assert.containsText('.company h1', company_name);
                client.assert.containsText('.company .siret', siret)
                done();
            })
    }
};