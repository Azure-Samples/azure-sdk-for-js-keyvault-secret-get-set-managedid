---
page_type: sample
languages:
- javascript
- nodejs
products:
- azure-key-vault
- azure
description: "How to set and get secrets from Azure Key Vault using Node.js."
urlFragment: get-set-keyvault-secrets-managed-id-nodejs
---

# How to set and get secrets from Azure Key Vault using Node.js 

This sample shows how to store a secret in Key Vault and how to retrieve it using a Web app. This web app may be run locally or in Azure. The sample uses Node.js and [Azure Managed Identities]

> * Create a Key Vault.
> * Store a secret in Key Vault.
> * Retrieve a secret from Key Vault.
> * Create an Azure Web Application.
> * [Enable Azure Managed Identities].
> * Grant the required permissions for the web application to read data from Key vault.

Before you proceed make sure that you are familiar with the [Key Vault Concepts].

## SDK Versions

In this sample, you will find the following folders:
* **v3** - references Key Vault SDK v3
* **v4** - references Key Vault SDK v4

## Prerequisites

* [Node.js]
* [Git]
* [Azure CLI] 2.0.4 or later
* An Azure subscription. If you don't have an Azure subscription, create a [free account] before you begin.

### Log in to Azure

1. Open a command prompt, i.e. cmd, terminal, etc
2. Execute the following command to log in to Azure

```Bash
az login
```

### Create Resource Group

**1. What is a Resource Group**

An Azure Resource Group is a logical container into which Azure resources are deployed and managed.

**2. How to create a Resource Group**

Create a Resource Group with the [az group create] command.  

When you create a Resource Group you have give it a unique custom name. Please think of a custom name for your Resource Group and replace the text below `"<MyResourceGroupName>"` with the custom name you created.

The following example creates a Resource Group named *<MyResourceGroupName>* in the *eastus* location.

```Bash
# To list locations: az account list-locations --output table
az group create --name "<MyResourceGroupName>" --location eastus
```

The Resource Group you just created is used throughout this tutorial.

### Create an Azure Key Vault

Next you will create a Key Vault using the Resource Group created in the previous step. Provide the following information:

* Vault name - Create a custom name and replace `"<MyKeyVaulName>"` below.
* Resource group name - Use the same Resource Group Name you used above.
* The location - Use the same location that you created the Resource Group in above.

```Bash
az keyvault create --name "<MyKeyVaultName>" --resource-group "<MyResourceGroupName>" --location eastus
```

### Add a Secret to Key Vault

Next, we'll add a secret to Key Vault to help illustrate how Secret Value works. You could store an SQL connection string or any other information that you need to keep secure and make it available to your application. 

In this tutorial, the password will be called **AppSecret** and will store the value of **MySecret** in it:

```Bash
az keyvault secret set --vault-name "<MyKeyVaultName>" --name AppSecret --value MySecret
```

To view the value contained in the Secret as plain text, please type the following command. This command shows the Secret Information including the URI. After completing these steps, you should have a URI to a Secret in an Azure Key Vault. Copy the output from the previous command to text editor. You will need it later:

```Bash
az keyvault secret show --name AppSecret --vault-name "<MyKeyVaultName>"
```

### Clone the repo

Run the following command to clone this sample code to your local machine:

```Bash
git clone https://github.com/Azure-Samples/azure-sdk-for-js-keyvault-secret-get-set-managedid.git
```

### Install dependencies

Run the following command to install dependencies for "SDK version 3" and "SDK version 4":

- SDK version 4

```Bash
cd v4 
```
```Bash
npm install
```

- SDK version 3

```Bash
cd v3 
```
```Bash
npm install
```

### Configuring your Key Vault

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

### Enable Azure Managed Identities

Azure Key Vault provides a way to securely store credentials and other keys and secrets, but your code needs to be authenticated to Key Vault before retrieving them. Azure Managed Identities simplify this need by giving Azure services an automatically managed identity in Azure Active Directory (Azure AD). You can use this identity to authenticate to any service that supports Azure AD authentication, including Key Vault, without having to store any credentials in your code.

Run the "identity assign" command to create an identity for this application, this command is the equivalent of going to the portal and switching **Azure Managed Identities** to **On** in the web application properties:

```Bash
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

```Bash
az keyvault set-policy --name "<MyKeyVaultName>" --object-id "<PrincipalId>" --secret-permissions get
```

## Publish the web application to Azure

To publish this web application to Azure, we need to create an Azure App Service, Azure Web App, and create a Deployment User.

**1. Azure App Service**

The first step is to create an [Azure App Service] Plan. You can store multiple web apps in this plan. Use the Resource Group that you created earlier in the following command:

```Bash
az appservice plan create --name "<MyAppServicePlan>" --resource-group "<MyResourceGroup>"
```    

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

```Bash    
http://<AppName>.azurewebsites.net
```    

The above command also creates a Git-enabled app which allows you to deploy to Azure from your local git. 
Local Git repository is configured with this url: 

```Bash
https://<UserName>@<AppName>.scm.azurewebsites.net/<AppName>.git
```

**3. Deployment User**

After running the previous command, you can add an Azure Remote to your local Git repository. Replace `<url>` with the URL of the Git Remote that you got from [enabling Git for your app].

```Bash    
git remote add azure <url>
```    

## Deploy the Node App to Azure and retrieve the secret value

Now that everything is deployed and configured, run the following command to deploy the app to Azure. This will push your local master branch to the git remote called 'azure' that you created earlier:

```Bash
git push azure master
```

When the git push command has completed you can now navigate to `https://<AppName>.azurewebsites.net` to see the secret value.

Make sure that you replaced the name `<AppName>` with your vault name.

## Next steps

* [Azure Key Vault Home Page]
* [Azure Key Vault Documentation]
* [Azure SDK For JavaScript]
* [Azure Key Vault REST API Reference]

## Contributing

This project has adopted the [Microsoft Open Source Code of Conduct]. For more information see the [Code of Conduct FAQ] or contact [opencode@microsoft.com] with any additional questions or comments.


<!-- LINKS --> 
[Azure Managed Identities]: https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/
[Enable Azure Managed Identities]: https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/
[Key Vault Concepts]: https://docs.microsoft.com/en-us/azure/key-vault/key-vault-overview
[Node.js]: https://nodejs.org
[Git]: https://www.git-scm.com/
[Azure CLI]: https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest
[free account]: https://azure.microsoft.com/free/?WT.mc_id=A261C142F
[az group create]: https://docs.microsoft.com/en-us/azure/azure-resource-manager/manage-resources-cli
[Azure App Service]: https://azure.microsoft.com/services/app-service/
[enabling Git for your app]: https://docs.microsoft.com/en-us/azure/app-service/deploy-local-git
[Azure Key Vault Home Page]: https://azure.microsoft.com/services/key-vault/
[Azure Key Vault Documentation]: https://docs.microsoft.com/azure/key-vault/
[Azure SDK For JavaScript]: https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/keyvault/keyvault-secrets
[Azure Key Vault REST API Reference]: https://docs.microsoft.com/rest/api/keyvault/
[Microsoft Open Source Code of Conduct]: https://opensource.microsoft.com/codeofconduct/
[Code of Conduct FAQ]: https://opensource.microsoft.com/codeofconduct/faq/
[opencode@microsoft.com]: mailto:opencode@microsoft.com
