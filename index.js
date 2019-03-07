var http = require('http');
const KeyVault = require('azure-keyvault');
const msRestAzure = require('ms-rest-azure');


var server = http.createServer(function(request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
});

// The ms-rest-azure library allows us to login with MSI by providing the resource name. In this case the resource is Key Vault.
// For public regions the resource name is Key Vault
msRestAzure.loginWithAppServiceMSI({resource: 'https://vault.azure.net'}).then( (credentials) => {
    const keyVaultClient = new KeyVault.KeyVaultClient(credentials);

    var vaultUri = "https://" + "<YourVaultName>" + ".vault.azure.net/";
    
    // We're setting the Secret value here and retrieving the secret value
    keyVaultClient.setSecret(vaultUri, 'my-secret', 'test-secret-value', {})
        .then( (kvSecretBundle, httpReq, httpResponse) => {
            console.log("Secret id: '" + kvSecretBundle.id + "'.");
            var secretId = KeyVault.parseSecretIdentifier(kvSecretBundle.id);
            return keyVaultClient.getSecret(secretId.vault, secretId.name, secretId.version);
        })
        .then( (bundle) => {
            console.log("Successfully retrieved 'test-secret'");
            console.log(bundle);
        })
        .catch( (err) => {
            console.log(err);
        });

    // Below code demonstrates how to retrieve a secret value
    
    // keyVaultClient.getSecret(vaultUri, "AppSecret", "").then(function(response){
    //     console.log(response);    
    // })
});

var port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running at http://localhost:%d", port);
