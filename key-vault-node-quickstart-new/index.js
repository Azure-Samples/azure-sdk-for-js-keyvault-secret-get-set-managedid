var http = require('http');
const {DefaultAzureCredential} = require('@azure/identity');
const {SecretsClient} = require('@azure/keyvault-secrets');

var server = http.createServer(function(request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
});

// DefaultAzureCredential expects the following three environment variables:
// - AZURE_TENANT_ID: The tenant ID in Azure Active Directory
// - AZURE_CLIENT_ID: The application (client) ID registered in the AAD tenant
// - AZURE_CLIENT_SECRET: The client secret for the registered application
const credential = new DefaultAzureCredential();
  
const vaultName = process.env["KEYVAULT_NAME"] || "<YourVaultName>";
const url = `https://${vaultName}.vault.azure.net`;
  
const client = new SecretsClient(url, credential);
  
// Create a secret then get the secret
client.setSecret("MySecretName", "MySecretValue").then( (secret) => {
console.log("Secret name: '" + secret.name + "'.");
return client.getSecret(secret.name);
})
.then( (secret) => {
console.log("Successfully retrieved 'MySecretName'");
console.log(secret.value);
})
.catch( (err) => {
console.log(err);
});

var port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running at http://localhost:%d", port);
