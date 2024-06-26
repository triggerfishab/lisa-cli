# lisa-cli ⚡️
<img align="right" src="./docs/assets/lisa-init.gif"  height="250" />

💁‍♀️ Lisa CLI is a command line tool that will help you to automate the process of creating a new site based on the [lisa-app](https://github.com/triggerfishab/lisa-app) and the [lisa-api](https://github.com/triggerfishab/lisa-api)

The features that is included now is the following:
* Setup repos on GitHub based on the [lisa-app](https://github.com/triggerfishab/lisa-app) and the [lisa-api](https://github.com/triggerfishab/lisa-api) repos.
* Setup site with Valet, including dependencies installation and local database creation.
* Reencrypt all vault files with a new password
* Create a development database
* Add all the config needed to be able to deploy the site to Kinsta with Trellis

## 📚 Table Of Contents
## 🔧 Prerequisites
You will need to install and configure the following stuff to use Lisa CLI:
* [Node](https://nodejs.org/en/) version >= 12
* [GitHub CLI](https://github.com/cli/cli) ([setup instructions](https://cli.github.com/manual/)) version >= 2.6
* [ansible-vault](https://docs.ansible.com/ansible/2.9/user_guide/vault.html) (comes from Ansible) version >= 2.12
* [WP-CLI](https://wp-cli.org/) version >= 2.5
* [Trellis CLI](https://github.com/roots/trellis-cli) version >= 1.5
* [Valet](https://laravel.com/docs/8.x/valet) version >= 2.18
* [Vercel CLI](https://vercel.com/cli) version >= 28.0
* [AWS CLI](https://aws.amazon.com/cli/) version >= 2.4
* [1Password CLI](https://developer.1password.com/docs/cli) version >= 2.18


## 🪚 Installation
```npm i -g @triggerfishab/lisa-cli```

## 🏃‍♂️ Usage
### Create a new site

1. Setup a new site on Kinsta, with both staging and production environments.
2. [Configure your Lisa path](#path)
3. [Configure your services API keys](#configure)
4. [Generate Kinsta template file](#kinsta)

	4.1 Fill your template
5. Run `lisa init --config-file <kinsta-config-file.yml>`

## ✏️ Commands

### `clone`
Use this command to setup a local Lisa site that already has been configured.
<details>
<summary>Read more</summary>
<p>
If you want to setup an already existing Lisa site for local development, you can just run the following command:

Example: `lisa clone`
</p>
</details>

&nbsp;

### `configure`
Use this command to configure all the necessary API keys.
<details>
<summary>Read more</summary>
<p>
Before setting up your first site, you will need to run this command to enter all the necessary API keys that the program uses. All of these can be found in the "Lisa CLI" item in 1Password.

Example: `lisa configure [service]`

If you've entered incorrect values or need to change them, use the `--reset` option below. _💡 Pass an argument for which service to configure to not reset all of them._

#### `--reset`
Use this option with the `configure` command to reset your previously configured API keys.

Example: `lisa configure --reset`

#### `[service]`
Use this argument for which service to configure, available services: `aws`, `godaddy`, `sendgrid`
</p>
</details>

&nbsp;

### `db import`
Use this command to import a database from the production/staging environment of your site.
<details>
<summary>Read more</summary>
<p>
Use this command to import a database from the production/staging environment of the site that you're working on. A prompt will ask you whether you will import it from staging or production

This command will ask for the project name and try to find the correct repos that you should use. If not the correct repos are found, the prompt will let you specify them manually.
</p>
</details>

&nbsp;

### `init`
Use this command to create a new Lisa site.
<details>
<summary>Read more</summary>
<p>
This command will create a new Lisa site for you. You will get both a WordPress API and a Next.js application for the frontend.

The following will be included:
* GitHub repos
* Amazon AWS S3 bucket for media handling
* Amazon AWS Cloudfront CDN for media files
* GoDaddy records for DNS
* Sendgrid subuser for email sending

When the command is done, you will have the following on your computer:
* API site linked to Valet on the domain https://{projectName}-api.test
* Next.js frontend app on http://localhost:3000

#### `-c, --config-file`
Specify the location of your Kinsta config file that you have created via the command `lisa kinsta`
</p>
</details>

&nbsp;

### `kinsta`
Use this command to create a site  on Kinsta or get a template file for all your Kinsta configuration values.
<details>
<summary>Read more</summary>
<p>
Use this command to create a site  on Kinsta or get a template file for all your Kinsta configuration values.

Example: `lisa kinsta [action]`


`create`
After the site has been created, an email will be sent to the provided email address.

`show-config`
After the file has been created, update all existing values with the corresponding values from the site at Kinsta that you created earlier.
</p>
</details>

&nbsp;

### `path`
Use this command to set (or get) your global sites path.
<details>
<summary>Read more</summary>
<p>
Use this command to set (or get) your global sites path. This needs to be set to inform Lisa CLI where to do it's 🪄magic🪄.

Example: `lisa path [path]`

#### `[path]`
Specify a path to set that as your Lisa path. If not specified, you will be given your current Lisa path as output instead.
</p>
</details>

&nbsp;

### `status`
Use this command to show your Lisa status.
<details>
<summary>Read more</summary>
<p>
Use this command to show your Lisa status. You will get output including your current Lisa path and all versions of your packages.

Example: `lisa status`
</p>
</details>

&nbsp;

### `page-component create`
Use this command to create a new page component in a Lisa project.

Alias: `pcc`
<details>
<summary>Read more</summary>
<p>
Use this command to create a new page component in a Lisa project.

It will create basic ACF fields in the api, create a GraphQL fragment, type definitions and a base component in the app.

Example: `lisa page-component create`
</p>
</details>

&nbsp;

### `cdn create`
Use this command to create services for S3, CloudFront & GoDaddy without all the other Lisa stuff.

<details>
<summary>Read more</summary>
<p>

Example: `lisa cdn create`
</p>
</details>

&nbsp;

### `sendgrid create`
Use this command to create user account and generate api key for SendGrid

<details>
<summary>Read more</summary>
<p>

Example: `lisa sendgrid create`
</p>
</details>

&nbsp;

### `wp update`
Update WordPress and Composer dependencies.
<details>
<summary>Read more</summary>
<p>
Examples:

```sh
lisa wp update
```

```sh
lisa wp update --fast
```

commands that will be run:

**without** _--fast_
```sh
composer require composer/installers -W
composer require roots/acorn -W
composer require roots/wordpress -W
composer require rector/rector -W --dev
composer require squizlabs/php_codesniffer -W --dev
composer require johnbillion/query-monitor -W --dev
```
**with** _--fast_
```sh
composer require composer/installers roots/acorn roots/wordpress -W
composer require rector/rector squizlabs/php_codesniffer johnbillion/query-monitor -W --dev
```

</p>
</details>

&nbsp;
### `godaddy create`
Use this command to create DNS-records in GoDaddy. I.e. for validation and pointing in Kinsta.

<details>
<summary>Read more</summary>
<p>

Example: `lisa godaddy create`
</p>
</details>

### `aws user create`
This command creates an aws iam user that's restricted to specific bucket(s).
<details>
<summary>Read more</summary>
<p>
 Once the user's been created access keys will be generated and stored in the AWS vault in 1password. Copy these keys and paste them in the vault-file of your site/project.

Example: `lisa aws user create`
</p>
</details>

&nbsp;

### `s3 bucket set-lifecycle-policy`
This command creates lifecycle rule for objects in the bucket
<details>
<summary>Read more</summary>
<p>
Create lifecycle rule for dealing with deletion of non-current versions of objects after 1 day. Objects with a delete flag will be removed after 30 days.

Example: `lisa s3 bucket set-lifecycle-policy`
</p>
</details>

&nbsp;

### `vault-pass-generate`
Generate a new .vault_pass file for the project.
<details>
<summary>Read more</summary>
<p>
This command will generate a new .vault_pass file for the project. This is used to encrypt and decrypt the vault files in the project.

Example:
```sh
lisa vault-pass-generate
```
</p>
</details>

&nbsp;
