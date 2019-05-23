
# Quickstart: Set and retrieve a secret from Azure Key Vault using a Node Web App 

This QuickStart shows how to store a secret in Key Vault and how to retrieve it using a Web app. This web app will be run via an App Service in Azure. The quickstart uses Node.js and Managed service identities (MSIs)

> * Create a Key Vault.
> * Store a secret in Key Vault.
> * Retrieve a secret from Key Vault.
> * Create an Azure Web Application.
> * [Enable managed service identities](https://docs.microsoft.com/azure/active-directory/managed-service-identity/overview).
> * Grant the required permissions for the web application to read data from Key vault.
> * Deploy the Web Application to Azure

Before you proceed make sure that you are familiar with the [basic concepts](https://docs.microsoft.com/en-us/azure/key-vault/key-vault-whatis#basic-concepts).

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

Create a resource group with the [az group create](https://docs.microsoft.com/en-us/cli/azure/group#az-group-create) command. An Azure resource group is a logical container into which Azure resources are deployed and managed.

Please select a Resource Group name and fill in the placeholder.
The following example creates a resource group named *<YourResourceGroupName>* in the *eastus* location.

```azurecli
# To list locations: az account list-locations --output table
az group create --name "<YourResourceGroupName>" --location "East US"
```

The resource group you just created is used throughout this tutorial.

## Create an Azure Key Vault

Next you create a Key Vault using the resource group created in the previous step. Your Key Vault must have a unique name. Provide the following information:

* Vault name - **Select a Key Vault Name here**.
* Resource group name - **Use the same name as previous step for the Resource Group**.
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

This command shows the secret information including the URI. After completing these steps, you should have a URI to a secret in an Azure Key Vault.

## Clone the Repo

Clone the repo in order to make a local copy for you to edit the source by running the following command:

```
git clone https://github.com/Azure-Samples/key-vault-node-quickstart.git
```

## Install dependencies

Here we install the dependencies. Run the following commands
```
cd key-vault-node-quickstart
npm install
```
This project used 3 node modules:
* [ms-rest-azure](https://www.npmjs.com/package/ms-rest-azure) 
* [azure-keyvault](https://www.npmjs.com/package/azure-keyvault)
* [nconf](https://www.npmjs.com/package/nconf)

## Set up the web application in Azure

- Create a [Azure App Service](https://azure.microsoft.com/services/app-service/) Plan. You can store multiple web apps in this plan.

    ```azurecli
    az appservice plan create --name <YourAppServicePlanName> --resource-group <YourResourceGroupName>
    ```
- Next we create a web app. In the following example, replace <YourAppName> with a globally unique app name (valid characters are a-z, 0-9, and -). The runtime is set to NODE|6.9. To see all supported runtimes, run az webapp list-runtimes
    ```azurecli
    az webapp create --resource-group <YourResourceGroupName> --plan <YourAppServicePlanName> --name <YourAppName> --runtime "NODE|6.9" --deployment-local-git
    ```
- After the web app has been created run:    
    ```azurecli
    az webapp deployment list-publishing-credentials --resource-group <YourResourceGroupName> --name <YourAppName>
    ```
    You should see output similar to the following example:
    ```
    {
      ...
      "name": "<YourAppName>",
      "publishingPassword": "LongStringofRandomNumbersandLetters",
      "publishingPasswordHash": null,
      "publishingPasswordHashSalt": null,
      "publishingUserName": "$<YourAppName>",
      "resourceGroup": "<YourResourceGroupName>",
      ...
    }
    ```
- Browse to your newly created web app and you should see a functioning web app. Replace <YourAppName> with a unique app name.
    ```
    http://<YourAppName>.azurewebsites.net
    ```
- Add a remote to your local git repository
    The above commands creates a Git-enabled app which allows you to deploy to Azure from your local git repository. The username will be listed in property *publishingUserName* and the password you will need will be in the property *publishingPassword*.
    
    Add an Azure *remote* to your local Git repository. Replace `<username>`, `<password>`, and `<YourAppName>` with values from the above call to `az webapp deployment list-publishing-credentials`.  Note: If your `<userename>` value begins with `$`, be sure to surround the URL with single quotes as shown below.
    ```
    git remote add azure 'https://<username>:<password>@<YourAppName>.scm.azurewebsites.net/<YourAppName>.git'
    ```
    Note: you can omit the `:<password>` from the remote url definition and you will be prompted for the password the first time you publish to the remote repository.

## Enable Managed Service Identity

Azure Key Vault provides a way to securely store credentials and other keys and secrets, but your code needs to authenticate to Key Vault to retrieve them. Managed Service Identity (MSI) makes solving this problem simpler by giving Azure services an automatically managed identity in Azure Active Directory (Azure AD). You can use this identity to authenticate to any service that supports Azure AD authentication, including Key Vault, without having any credentials in your code.

Run the assign-identity command to create the identity for this application:

```azurecli
az webapp identity assign --name <YourAppName> --resource-group "<YourResourceGroupName>"
```

This command is the equivalent of going to the portal and switching **Managed service identity** to **On** in the web application properties.

### Assign permissions to your application to read secrets from Key Vault

Write down or copy the output of the command above. It should be in the format:
        
        {
          "principalId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          "type": "SystemAssigned"
        }
        
Then, run this command using the name of your Key Vault and the value of PrincipalId copied from above:

```azurecli
az keyvault set-policy --name '<YourKeyVaultName>' --object-id <PrincipalId> --secret-permissions get
```

## Edit the settings.json file to point to your Key Vault
Edit the value for keyvaultname in the settings.json file to match what you used for `<YourKeyVaultName>` in previous commands.
```
{
    "description_keyvaultname": "keyvault name should be in the next field, only include first part like 'nodekvdemo', NOT 'nodekvdemo.vault.azure.net'",
    "keyvaultname": "this_keyvault_does_not_exist_edit_settings_json"
}
```

After saving the changes to settings.json, run the following to add the changes to your local git repository:

```
git add settings.json
git commit -m 'Update value of keyvaultname in settings.json'
```

## Deploy the Node App to Azure and retrieve the secret value

Now that everything is set. Run the following command to deploy the app to Azure

```
git push azure master
```

After this when you browse to https://<YourAppName>.azurewebsites.net you should see the secret value.

## Next steps

* [Azure Key Vault Home Page](https://azure.microsoft.com/services/key-vault/)
* [Azure Key Vault Documentation](https://docs.microsoft.com/azure/key-vault/)
* [Azure SDK For Node](https://docs.microsoft.com/javascript/api/overview/azure/key-vault)
* [Azure REST API Reference](https://docs.microsoft.com/rest/api/keyvault/)
# Contributing

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.