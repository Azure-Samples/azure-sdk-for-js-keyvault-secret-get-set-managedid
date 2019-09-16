
# Quickstart: Set and retrieve a secret from Azure Key Vault using a Node Web App 

This QuickStart shows how to store a secret in Key Vault and how to retrieve it using a Web app. This web app may be  run locally or in Azure. The quickstart uses Node.js and Managed service identities (MSIs)

> * Create a Key Vault.
> * Store a secret in Key Vault.
> * Retrieve a secret from Key Vault.
> * Create an Azure Web Application.
> * [Enable managed service identities](https://docs.microsoft.com/azure/active-directory/managed-service-identity/overview).
> * Grant the required permissions for the web application to read data from Key vault.

Before you proceed make sure that you are familiar with the [basic concepts](key-vault-whatis.md#basic-concepts).

# Folders introduction
Two folders are referred to different version of Azure SDK.
* key-vault-node-quickstart-v3 referenced to following packages:
  * [ms-rest-azure](https://www.npmjs.com/package/ms-rest-azure)
  * [azure-keyvault](https://www.npmjs.com/package/azure-keyvault)
* key-vault-node-quickstart-v4 referenced to following packages:
  * [@azure/identity](https://www.npmjs.com/package/@azure/identity)
  * [@azure/keyvault-secrets](https://www.npmjs.com/package/@azure/keyvault-secrets)
  
## Next steps

* [Azure Key Vault Home Page](https://azure.microsoft.com/services/key-vault/)
* [Azure Key Vault Documentation](https://docs.microsoft.com/azure/key-vault/)
* [Azure SDK For Node](https://docs.microsoft.com/javascript/api/overview/azure/key-vault)
* [Azure REST API Reference](https://docs.microsoft.com/rest/api/keyvault/)
# Contributing

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
