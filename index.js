var http = require('http');
nconf = require('nconf');
nconf.env().file({ file: 'settings.json' });

const KeyVault = require('azure-keyvault');
const msRestAzure = require('ms-rest-azure');

var port = process.env.PORT || 1337;
//get the keyvalt name from settings.json
var keyvaultname=nconf.get('keyvaultname')

var server = http.createServer(function (request, response) {
  // Tell the client we are rurning in text instead of HTML
  response.writeHead(200, { "Content-Type": "text/plain" });
  var keyVaultClient;
  // Log in with App Service MSI to access VeyVault resources
  msRestAzure.loginWithAppServiceMSI({ resource: "https://vault.azure.net" })
    .then((credentials) => {
      keyVaultClient = new KeyVault.KeyVaultClient(credentials);
    }).then(() => {
      var vaultUri = "https://" + keyvaultname + ".vault.azure.net/";
      keyVaultClient.getSecret(vaultUri, "AppSecret", "").then(function (result) {
        response.write("Value of secret \"AppSecret\":\n");
        response.write(result.value);
        response.end();
      }).catch((err) => {
        response.write("Error requesting secret => \n");
        response.write(JSON.stringify(err));
        response.end();
      });
    }).catch((err) => {
      response.write("Error processing request => \n");
      response.write(JSON.stringify(err));
      response.end();
    });
}
).listen(port);
console.log("Server running at http://localhost:%d", port);
