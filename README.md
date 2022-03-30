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
You will need to install the following stuff to use lisa-cli:
* [Node](https://nodejs.org/en/) version >= 12
* [GitHub CLI](https://github.com/cli/cli) ([setup instructions](https://cli.github.com/manual/))
* [ansible-vault](https://docs.ansible.com/ansible/2.9/user_guide/vault.html) (comes from Ansible)
* [WP-CLI](https://wp-cli.org/)
* [Trellis CLI](https://github.com/roots/trellis-cli)
* [Valet](https://laravel.com/docs/8.x/valet)
* [Vercel CLI](https://vercel.com/cli)

## 🪚 Installation
```npm i -g lisa-cli```

## 🏃‍♂️ Usage

### Set global sites path
Use this command to set your global sites path (for example `~/Sites`)to prevent you from running other commands from the wrong directory

```lisa path {PATH}```

### Create a new site
From your generic sites folder (for example `~/Sites`) run the following command:

```lisa init```

You will also need to create a YAML file with all the config from Kinsta, run the following command to get a file template:

```lisa kinsta --help```

### Setup an existing site
If you want to setup an already existing Lisa site for local development, you can just run the following command:

```lisa clone```

### Import database from staging/production
Use this command to import a database from the production/staging environment of the site that you're working on. A prompt will ask you whether you will import it from staging or production

```lisa db import```

This command will ask for the project name and try to find the correct repos that you should use. If not the correct repos are found, the prompt will let you specify them manually.

```lisa destroy```

This command will ask for the project name, find the directories for both API and app, find the database and the site linked to valet and remove them.

## 🔨 TODO
- Local Trellis development
	- S3 bucket
	- Stackpath domain
	- Sendgrid
- Stackpath
- Sendgrid
- S3
- GoDaddy
