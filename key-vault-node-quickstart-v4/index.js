var http = require('http');
const {DefaultAzureCredential} = require('@azure/identity');
const {SecretsClient} = require('@azure/keyvault-secrets');
// DefaultAzureCredential expects the following three environment variables:
// - AZURE_TENANT_ID: The tenant ID in Azure Active Directory
// - AZURE_CLIENT_ID: The application (client) ID registered in the AAD tenant
// - AZURE_CLIENT_SECRET: The client secret for the registered application
const credential = new DefaultAzureCredential();
  
const vaultName = process.env["KEYVAULT_NAME"] || "<YourVaultName>";
const url = `https://${vaultName}.vault.azure.net`;
  
const client = new SecretClient(url, credential);
  
// Create a secret
const secretName = "MySecretName";

var server = http.createServer(function(request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
});

async function main(){

    const result = await client.setSecret(secretName, "MySecretValue");
    console.log("Secret name: ", result.name);
    // Read the secret we created
    const secret = await client.getSecret(secretName);
    console.log("Successfully retrieved 'MySecretName':", secret.value);
}

main().catch((err) => {
    console.log("error code: ", err.code);
    console.log("error message: ", err.message);
    console.log("error stack: ", err.stack);
});

var port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running at http://localhost:%d", port);
