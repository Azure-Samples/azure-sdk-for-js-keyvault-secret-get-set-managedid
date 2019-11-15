---
page_type: sample
languages:
- javascript
products:
- azure
description: "This QuickStart shows how to store a secret in Key Vault and how to retrieve it using a Web app. This web app may be run locally or in Azure."
urlFragment: key-vault-node-quickstart
---

# Quickstart: Set and retrieve a secret from Azure Key Vault using a Node Web App 

This Quickstart shows how to store a secret in Key Vault and how to retrieve it using a Web app. This web app may be run locally or in Azure. The Quickstart uses Node.js and Azure Managed Identities

> * Create a Key Vault.
> * Store a secret in Key Vault.
> * Retrieve a secret from Key Vault.
> * Create an Azure Web Application.
> * [Enable Azure Managed Identities](https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/).
> * Grant the required permissions for the web application to read data from Key vault.

Before you proceed make sure that you are familiar with the [basic concepts](https://docs.microsoft.com/en-us/azure/key-vault/key-vault-overview).

# SDK Versions

You will find the following folders: key-vault-node-quickstart-v3, which references the version 3.0 SDK and keyvault-node-quickstart-v4, which uses the version 4.0 SDK.

* To use the latest Azure SDK version [key-vault-node-quickstart-v4](./key-vault-node-quickstart-v4) please add the following dependency:
  * [@azure/identity](https://www.npmjs.com/package/@azure/identity)
  * [@azure/keyvault-secrets](https://www.npmjs.com/package/@azure/keyvault-secrets)
* For the previous Azure SDK version [key-vault-node-quickstart-v3](./key-vault-node-quickstart-v3) please add the following dependency:
  * [ms-rest-azure](https://www.npmjs.com/package/ms-rest-azure)
  * [azure-keyvault](https://www.npmjs.com/package/azure-keyvault)

## Prerequisites

* [Node.js](https://nodejs.org)
* [Git](https://www.git-scm.com/)
* [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) 2.0.4 or later
* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Log in to Azure

1. Open a command prompt, i.e. cmd, terminal, etc
2. Execute the following command to log in to Azure

```azurecli
az login
```

## Create Resource Group

Create a Resource Group with the [az group create](https://docs.microsoft.com/en-us/azure/azure-resource-manager/manage-resources-cli) command. An Azure Resource Group is a logical container into which Azure resources are deployed and managed.

When you create a Resource Group you have give it a unique custom name. Please think of a custom name for your Resource Group and replace the text below `"<MyResourceGroupName>"` with the custom name you created.

The following example creates a Resource Group named *<MyResourceGroupName>* in the *eastus* location.

```azurecli
# To list locations: az account list-locations --output table
az group create --name "<MyResourceGroupName>" --location eastus
```

The Resource Group you just created is used throughout this tutorial.

## Create an Azure Key Vault

Next you will create a Key Vault using the Resource Group created in the previous step. Provide the following information:

* Vault name - Create a custom name and replace `"<MyKeyVaulName>"` below.
* Resource group name - Use the same Resource Group Name you used above.
* The location - Use the same location that you created the Resource Group in above.

```azurecli
az keyvault create --name "<MyKeyVaultName>" --resource-group "<MyResourceGroupName>" --location eastus
```

## Add a Secret to Key Vault

Next, we'll add a secret to KeyVault to help illustrate how Secret Value works. You could store a SQL connection string or any other information that you need to keep secure and make it available to your application. 

In this tutorial, the password will be called **AppSecret** and will store the value of **MySecret** in it:

```azurecli
az keyvault secret set --vault-name "<MyKeyVaultName>" --name AppSecret --value MySecret
```

To view the value contained in the Secret as plain text, please type the following command. This command shows the Secret Information including the URI. After completing these steps, you should have a URI to a Secret in an Azure Key Vault. Copy the output from the previous command to text editor. You will need it later:

```azurecli
az keyvault secret show --name AppSecret --vault-name "<MyKeyVaultName>"
```

## Clone the repo

Run the following command to clone this Quickstart code to your local machine:

```
git clone https://github.com/Azure-Samples/key-vault-node-quickstart.git
```

## Install dependencies

Run the following command to install dependencies for "SDK version 3.0" and "SDK version 4.0":

- SDK version 4.0

```
cd key-vault-node-quickstart-v4 
```
```
npm install
```

- SDK version 3.0

```
cd key-vault-node-quickstart-v3 
```
```
npm install
```

## Publish the web application to Azure

To publish this web application to Azure we need to create an Azure App Service, Azure Web App, and create a Deployment User.

**1. Azure App Service**

The first step is to create an [Azure App Service](https://azure.microsoft.com/services/app-service/) Plan. You can store multiple web apps in this plan. Use the Resource Group that you created earlier in the following command:

   
    az appservice plan create --name "<MyAppServicePlan>" --resource-group "<MyResourceGroup>"
    

**2. Azure Web App**

Next we create a web app. In the following example, replace <AppName> with a globally unique app name (valid characters are a-z, 0-9, and -). The runtime is set to NODE|6.9. To see all supported runtimes, run az webapp list-runtimes:
 
    
    # Bash
    az webapp create --resource-group "<MyResourceGroup>" --plan "<MyAppServicePlan>" --name "<AppName>" --runtime "NODE|6.9" --deployment-local-git
    # PowerShell
    az webapp create --resource-group "<MyResourceGroup>" --plan "<MyAppServicePlan>" --name "<AppName>" --runtime "NODE|6.9"
    
After the web app is created, the Azure CLI outputs something similar to the following:

    
    {
      "availabilityState": "Normal",
      "clientAffinityEnabled": true,
      "clientCertEnabled": false,
      "cloningInfo": null,
      "containerSize": 0,
      "dailyMemoryTimeQuota": 0,
      "defaultHostName": "<AppName>.azurewebsites.net",
      "enabled": true,
      "deploymentLocalGitUrl": "https://<UserName>@<AppName>.scm.azurewebsites.net/<AppName>.git"
      < JSON data removed for brevity. >
    }
    
Browse to your newly created web app, and you should see a functioning web app. Replace `<AppName>` with the unique app name that you chose previously.

    
    http://<AppName>.azurewebsites.net
    

The above command also creates a Git-enabled app which allows you to deploy to Azure from your local git. 
Local Git repository is configured with this url: 

    https://<UserName>@<AppName>.scm.azurewebsites.net/<AppName>.git

**3. Deployment User**

After running the previous command, you can add an Azure Remote to your local Git repository. Replace `<url>` with the URL of the Git Remote that you got from [enabling Git for your app](https://docs.microsoft.com/en-us/azure/app-service/deploy-local-git).

    
    git remote add azure <url>
    

### Configuring your Key Vault

Use the [Azure Cloud Shell](https://shell.azure.com/bash) snippet below to create/get client secret credentials.

- Create a service principal and configure its access to Azure resources:
  ```Bash
  az ad sp create-for-rbac -n "<AppName>" --skip-assignment
  ```
  Output:
  ```json
  {
    "appId": "generated-app-ID",
    "displayName": "<AppName>",
    "name": "http://<AppName>",
    "password": "random-password",
    "tenant": "tenant-ID"
  }
  ```
- Use the above returned credentials information to set **AZURE_CLIENT_ID**(appId), **AZURE_CLIENT_SECRET**(password) and **AZURE_TENANT_ID**(tenant) environment variables. The following example shows a way to do this in Bash:

  ```Bash
    export AZURE_CLIENT_ID="generated-app-ID"
    export AZURE_CLIENT_SECRET="random-password"
    export AZURE_TENANT_ID="tenant-ID"
  ```

- Grant the above mentioned application authorization to perform secret operations on the Key Vault:

  ```Bash
  az keyvault set-policy --name "<MyKeyVaultName>" --spn $AZURE_CLIENT_ID --secret-permissions backup delete get list set
  ```

  > --secret-permissions:
  > Accepted values: backup, delete, get, list, purge, recover, restore, set

- Use the above mentioned Key Vault name to retrieve details of your Vault which also contains your Key Vault URL:
  ```Bash
  az keyvault show --name "<MyKeyVaultName>"
  ```

## Enable Azure Managed Identities

Azure Key Vault provides a way to securely store credentials and other keys and secrets, but your code needs to be authenticated to Key Vault before retrieving them. Azure Managed Identities simplify this need by giving Azure services an automatically managed identity in Azure Active Directory (Azure AD). You can use this identity to authenticate to any service that supports Azure AD authentication, including Key Vault, without having to store any credentials in your code.

Run the "identity assign" command to create an identity for this application, this command is the equivalent of going to the portal and switching **Azure Managed Identities** to **On** in the web application properties:

```azurecli
az webapp identity assign --name "<AppName>" --resource-group "<MyResourceGroupName>"
```

### Assign permissions to your application to read secrets from Key Vault

Copy the output to text editor for later use. It should be in the following format:
        
        {
          "principalId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          "type": "SystemAssigned"
        }
        
Then, run this command using the name of your Key Vault and the value of PrincipalId copied from above:

```azurecli
az keyvault set-policy --name "<MyKeyVaultName>" --object-id "<PrincipalId>" --secret-permissions get
```

## Deploy the Node App to Azure and retrieve the secret value

Now that everything is deployed and configured, run the following command to deploy the app to Azure. This will push your local master branch to the git remote called 'azure' that you created earlier:

```
git push azure master
```

When the git push command has completed you can now navigate to `https://<AppName>.azurewebsites.net` to see the secret value.

Make sure that you replaced the name `<AppName>` with your vault name.

## Next steps

* [Azure Key Vault Home Page](https://azure.microsoft.com/services/key-vault/)
* [Azure Key Vault Documentation](https://docs.microsoft.com/azure/key-vault/)
* [Azure SDK For Node.js](https://docs.microsoft.com/javascript/api/overview/azure/key-vault)
* [Azure REST API Reference](https://docs.microsoft.com/rest/api/keyvault/)

## Contributing

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
