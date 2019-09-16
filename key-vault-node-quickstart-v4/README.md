
# Quickstart: Set and retrieve a secret from Azure Key Vault using a Node Web App 

This QuickStart shows how to store a secret in Key Vault and how to retrieve it using a Web app. This web app may be  run locally or in Azure. The quickstart uses Node.js and Service Principal.

> * Create a Key Vault.
> * Store a secret in Key Vault.
> * Retrieve a secret from Key Vault.
> * Create an Azure Web Application.
> * [Create a service principal](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal).
> * Grant the required permissions for the web application to read data from Key vault.

Before you proceed make sure that you are familiar with the [basic concepts](key-vault-whatis.md#basic-concepts).

## Prerequisites

* [Node JS](https://nodejs.org/en/)
* [Git](https://www.git-scm.com/)
* [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) 2.0.4 or later
* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Login to Azure

To log in to Azure using the CLI, you can type:

```azurecli
az login
```

## Create resource group

Create a resource group with the [az group create](/cli/azure/group#az-group-create) command. An Azure resource group is a logical container into which Azure resources are deployed and managed.

Please select a Resource Group name and fill in the placeholder.
The following example creates a resource group named *<YourResourceGroupName>* in the *eastus* location.

```azurecli
# To list locations: az account list-locations --output table
az group create --name "<YourResourceGroupName>" --location "East US"
```

The resource group you just created is used throughout this tutorial.

## Create an Azure Key Vault

Next you create a Key Vault using the resource group created in the previous step. Although “ContosoKeyVault” is used as the name for the Key Vault throughout this article, you have to use a unique name. Provide the following information:

* Vault name - **Select a Key Vault Name here**.
* Resource group name - **Select a Resource Group Name here**.
* The location - **East US**.

```azurecli
az keyvault create --name "<YourKeyVaultName>" --resource-group "<YourResourceGroupName>" --location "East US"
```

At this point, your Azure account is the only one authorized to perform any operations on this new vault.

## Add a secret to key vault

We're adding a secret to help illustrate how this works. You could be storing a SQL connection string or any other information that you need to keep securely but make available to your application. In this tutorial, the password will be called **AppSecret** and will store the value of **MySecret** in it.

Type the commands below to create a secret in Key Vault called **AppSecret** that will store the value **MySecret**:

```azurecli
az keyvault secret set --vault-name "<YourKeyVaultName>" --name "AppSecret" --value "MySecret"
```

To view the value contained in the secret as plain text:

```azurecli
az keyvault secret show --name "AppSecret" --vault-name "<YourKeyVaultName>"
```

This command shows the secret information including the URI. After completing these steps, you should have a URI to a secret in an Azure Key Vault. Write this information down. You need it in a later step.

## Clone the Repo

Clone the repo in order to make a local copy for you to edit the source by running the following command:

```
git clone https://github.com/Azure-Samples/key-vault-node-quickstart.git
```

## Install dependencies

Here we install the dependencies. Run the following commands
```
cd key-vault-node-quickstart-v4
```    
```
npm install
```

This project used 2 node modules:

* [@azure/identity](https://www.npmjs.com/package/@azure/identity) 
* [@azure/keyvault-secrets](https://www.npmjs.com/package/@azure/keyvault-secrets)

## Publish the web application to Azure

Below are the few steps we need to do

- The 1st step is to create a [Azure App Service](https://azure.microsoft.com/services/app-service/) Plan. You can store multiple web apps in this plan.

    ```
    az appservice plan create --name myAppServicePlan --resource-group myResourceGroup
    ```
- Next we create a web app. In the following example, replace <app_name> with a globally unique app name (valid characters are a-z, 0-9, and -). The runtime is set to NODE|6.9. To see all supported runtimes, run az webapp list-runtimes
    ```
    # Bash
    az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name <app_name> --runtime "NODE|6.9" --deployment-local-git
    # PowerShell
    az --% webapp create --resource-group myResourceGroup --plan myAppServicePlan --name <app_name> --runtime "NODE|6.9"
    ```
    When the web app has been created, the Azure CLI shows output similar to the following example:
    ```
    {
      "availabilityState": "Normal",
      "clientAffinityEnabled": true,
      "clientCertEnabled": false,
      "cloningInfo": null,
      "containerSize": 0,
      "dailyMemoryTimeQuota": 0,
      "defaultHostName": "<app_name>.azurewebsites.net",
      "enabled": true,
      "deploymentLocalGitUrl": "https://<username>@<app_name>.scm.azurewebsites.net/<app_name>.git"
      < JSON data removed for brevity. >
    }
    ```
    Browse to your newly created web app and you should see a functioning web app. Replace <app_name> with a unique app name.

    ```
    http://<app name>.azurewebsites.net
    ```
    The above command also creates a Git-enabled app which allows you to deploy to azure from your local git. 
    Local git is configured with url of 'https://<username>@<app_name>.scm.azurewebsites.net/<app_name>.git'

- Create a deployment user
    After the previous command is completed you can add add an Azure remote to your local Git repository. Replace <url> with the URL of the Git remote that you got from Enable Git for your app.

    ```
    git remote add azure <url>
    ```

### Configuring your Key Vault

Use the [Azure Cloud Shell](https://shell.azure.com/bash) snippet below to create/get client secret credentials.

- Create a service principal and configure its access to Azure resources:
  ```Bash
  az ad sp create-for-rbac -n <your-application-name> --skip-assignment
  ```
  Output:
  ```json
  {
    "appId": "generated-app-ID",
    "displayName": "dummy-app-name",
    "name": "http://dummy-app-name",
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

- Grant the above mentioned application authorization to perform secret operations on the keyvault:

  ```Bash
  az keyvault set-policy --name <your-key-vault-name> --spn $AZURE_CLIENT_ID --secret-permissions backup delete get list set
  ```

  > --secret-permissions:
  > Accepted values: backup, delete, get, list, purge, recover, restore, set

- Use the above mentioned Key Vault name to retrieve details of your Vault which also contains your Key Vault URL:
  ```Bash
  az keyvault show --name <your-key-vault-name>
  ```

## Deploy the Node App to Azure and retrieve the secret value

Now that everything is set. Run the following command to deploy the app to Azure

```
git push azure master
```

After this when you browse https://<app_name>.azurewebsites.net you can see the secret value.
Make sure that you replaced the name <YourKeyVaultName> with your vault name
    
## Next steps

* [Azure Key Vault Home Page](https://azure.microsoft.com/services/key-vault/)
* [Azure Key Vault Documentation](https://docs.microsoft.com/azure/key-vault/)
* [Azure SDK For Node](https://docs.microsoft.com/javascript/api/overview/azure/key-vault)
* [Azure REST API Reference](https://docs.microsoft.com/rest/api/keyvault/)
# Contributing

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

