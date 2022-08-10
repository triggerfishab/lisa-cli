## 2.2.2 (2022-08-10)
### Changes
🛠 Add fix for trellis commands failure.

## 2.2.1 (2022-04-06)
### Changes
🛠 Add minor error handling to Stackpath and GoDaddy setup.

## 2.2.0 (2022-04-06)
### Features
📦 Added [`status`](README.md#status) to get an output of your Lisa path and your package versions.

### Documentation
📝 Added documentation about [`status`](README.md#status) command.

## 2.1.0 (2022-04-06)
### Features
📦 Not supplying the `<path>` argument to the [path command](README.md#path) will now output the current set path.

### Changes
🛠 All commands can now be run outside of the [configured path](README.md#path)

🛠 The argument `<path>` to the [path command](README.md#path) is now optional.

### Documentation
📝 All options and arguments for all of the command are now documented in the [README](README.md#%EF%B8%8F-commands)

📝 Refactored the documentation of the options to use `<summary>` and `<details>` element to make it a bit shorter by default.

## 2.0 (2022-04-05)
### Features
📦 Add support to setup all services we usually use on a project.
* When you run `lisa init`, S3, StackPath, GoDaddy and Sendgrid will automatically be installed and all the necessary configuration will be saved in your Trellis files.

📦 Add `configure` command
* Run this command to configure API keys for S3, StackPath, GoDaddy and Sendgrid

📦 ES Modules
* The whole application has been rewritten from CommonJS to ES Modules

📦 Introducing Store
* A new Store library has been introduced in 2.0 which is supposed to hold all information about project specific data.

### Changes
🛠 Make `--config-file` a required option to `init` command

🛠 Change `kinsta` command to only output the template file when running the command.

## 1.7.0 (2022-03-29)
### Features
📦 Rewrite all console messages with new functions

📦 Add task for `s3`

📦 Code cleanup

## 1.6.1 (2022-03-24)
### Bug fixes
🐛 Fix some bugs with running the `init` command.

## 1.6.0 (2021-11-06)
### Features
📦 Add `destroy` command

### Documentation
📝 Add documentation on how to use `lisa path`

## 1.5.1 (2021-11-03)
### Bug fixes
🐛 Add missing `vercel` dependency to run Lisa commands.

## 1.5.0 (2021-11-03)
### Features
📦 Create environment variables for `FORGOT_PASSWORD_JWT_SECRET`, `API_SECRET` and `NEXT_PUBLIC_API_URL` and upload them to Vercel

📦 Add summary when new site is cloned and ready for development.

📦 Check for dependencies before running any commands.

📦 Connect frontend repo to Vercel when cloning a site and generate `.env.local` file.

## 1.4.0 (2021-11-03)
### Features
📦 Add `lisa path` command

📦 Create local empty database when running `lisa clone`

📦 Import database from staging/production when running `lisa clone`

### Documentation
📝 Add documentation on how to use `lisa path`

📝 Add documentation on how to use `lisa db import`

## v1.3.1 (2021-11-03)
### Bug fixes
🐛 Add missing `prompts` dependency

## v1.3.0 (2021-11-03)
### Features
📦 Add `lisa db import` command

📦 Add vault pass as repo secret on repo creation

## v1.2.0 (2021-10-29)
### Features
📦 Add `lisa clone` command

## v1.0.0 (2021-10-21)
### Features
📦 First release with `lisa init` support
