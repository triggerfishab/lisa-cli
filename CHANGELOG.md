## 2.11.2 (2023-07-10)

### Changes
🛠 Check if `1password-cli` is installed before running `cdn create`.
🛠 Print version of `1password-cli` in `status` command.

### Features
📦 Add `--version` option to display current version of `lisa-cli`.

## 2.11.1 (2023-07-06)

### Changes
🛠 Retrieve credentials for services from 1password instead of having them stored in configs.

## 2.11.0 (2023-06-13)

### Features
📦 Improved the `kinsta` command for usage with creation of sites (`kinsta create`) and (`kinsta show-config`) for display of config file.

### Changes
🛠 Allow input of custom message in `askForProjectName()`

## 2.10.2 (2023-05-30)

### Changes
🛠 Activate bucket versioning after bucket has been created.
🛠 Add region to origin domain name when creating CloudFront distribution to fix caching issues before AWS has propagated properly.

## 2.10.1 (2023-05-16)

### Changes
🛠 Redirect http to https in CloudFront Behavior.
🛠 Set Compress to true in CloudFront Behavior.
🛠 Update s3 bucket policy to ONLY allow CloudFront to read from the bucket.

### Documentation
📝 Update README with correct commands.

## 2.9.0 (2023-04-18)
### Features
📦 Added a new command (`create sendgrid`) that allows users to create user account and api key for SendGrid.

### Changes
🛠 Let the user select for which environment(s) they want to create the CDN services.
🛠 Change the template for new page components

## 2.8.0 (2023-04-18)
### Features
📦 Added a new command (`create cdn`) that allows users to create services for S3, CloudFront & GoDaddy without all the other Lisa stuff.

📦 Added ip-check before attempting to run the `lisa init` command. The Triggerfish office ip is required for api calls to SendGrid to function.

📦 When creating a new component with `lisa pcc`, a page with the new component will automatically be created.

📦 When running `lisa init`, the CLI will check whether GitHub has any errors at the moment.

## 2.6.0 (2023-02-05)
### Features
📦 Added a new function (checkLisaVersion()) that runs before the main script to detect if a new version of lisa-cli is available.

## 2.5.0 (2023-02-03)
### Features
📦 Get more output when running `lisa status`, if a dependency is outdated, you will be told which new version to install.

## 2.4.0 (2023-01-30)
### Features
📦 Add support to create an AWS distribution for CDN use.

### Changes
🛠 Add fix for failure when cloning the newly created repos.

### Removed
❌ We no longer use StackPath as CDN, so the integration is removed and replaced with Cloudfront.

## 2.3.1 (2022-11-09)
### Changes
🛠 Remove `/wp/graphql` from API url used in frontend-app.

## 2.3.0 (2022-10-10)
### Features
📦 Generate revalidate secret when creating a new project to enable the use of [Lisa Frontend Cache Purger](https://github.com/triggerfishab/lisa-frontend-cache-purger).

## 2.2.2 (2022-09-23)
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
