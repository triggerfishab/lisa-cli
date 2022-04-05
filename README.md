# lisa-cli ⚡️
<img align="right" src="./docs/assets/lisa-init.gif"  height="250" />

💁‍♀️ Lisa CLI is a command line tool that will help you to automate the process of creating a new site based on the [lisa-app](https://github.com/triggerfishab/lisa-app) and the [lisa-api](https://github.com/triggerfishab/lisa-api)

The features that is included now is the following:
* Setup repos on GitHub based on the [lisa-app](https://github.com/triggerfishab/lisa-app) and the [lisa-api](https://github.com/triggerfishab/lisa-api) repos.
* Setup site with Valet, including dependencies installation and local database creation.
* Reencrypt all vault files with a new password
* Create a development database
* Add all the config needed to be able to deploy the site to Kinsta with Trellis

## 🔧 Prerequisites
You will need to install and configure the following stuff to use Lisa CLI:
* [Node](https://nodejs.org/en/) version >= 12
* [GitHub CLI](https://github.com/cli/cli) ([setup instructions](https://cli.github.com/manual/))
* [ansible-vault](https://docs.ansible.com/ansible/2.9/user_guide/vault.html) (comes from Ansible)
* [WP-CLI](https://wp-cli.org/)
* [Trellis CLI](https://github.com/roots/trellis-cli)
* [Valet](https://laravel.com/docs/8.x/valet)
* [Vercel CLI](https://vercel.com/cli)
* [AWS CLI](https://aws.amazon.com/cli/)

## 🪚 Installation
```npm i -g lisa-cli```

## 🏃‍♂️ Usage
### Create a new site

1. Setup a new site on Kinsta, with both staging and production environments.
2. [Configure your Lisa path](path2)
3. [Configure your services API keys](configure)
4. [Generate Kinsta template file](kinsta)

	4.1 Fill your template
5. Run `lisa init --config-file <kinsta-config-file.yml>`

## ✏️ Commands

### path \<PATH\>
Use this command to set your global sites path to prevent you from running other commands from the wrong directory

### configure
Before setting up your first site, you will need to run this command to enter all the necessary API keys that the program uses. All of these can be found in the "Lisa CLI" item in 1Password.

### kinsta
Use this command to get a template file for all your Kinsta configuration values.

Example: `lisa kinsta > kinsta.yml`

After the file has been created, update all existing values with the corresponding values from the site at Kinsta that you created earlier.

### init
This command will create a new Lisa site for you. You will get both a WordPress API and a Next.js application for the frontend.

The following will be included:
* GitHub repos
* Amazon AWS S3 bucket for media handling
* StackPath CDN for media files
* GoDaddy records for DNS
* Sendgrid subuser for email sending

When the command is done, you will have the following on your computer:
* API site linked to Valet on the domain https://{projectName}-api.test
* Next.js frontend app on http://localhost:3000

### clone
If you want to setup an already existing Lisa site for local development, you can just run the following command:

### db import
Use this command to import a database from the production/staging environment of the site that you're working on. A prompt will ask you whether you will import it from staging or production

This command will ask for the project name and try to find the correct repos that you should use. If not the correct repos are found, the prompt will let you specify them manually.
