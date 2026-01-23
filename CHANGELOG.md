## 2.20.3 (2026-01-23)
### Fixes
🛠 Fix faulty item id for Sendgrid after changing 1Password organisation.

## 2.20.2 (2025-10-06)
### Fixes
🛠 Bug fix checking of correct ip before accessing the Sendgrid api

## 2.20.1 (2024-11-07)
### Fixes
🛠 Fix faulty item id for aws after changing vaults in 1Password.
🛠 Fix faulty item id for lisa after changing vaults in 1Password.

## 2.20.0 (2024-11-06)
### Fixes
🛠 Fix faulty item id after changing vaults in 1Password.

## 2.19.0 (2024-10-02)
### Features
* feat(sendgrid): ✨ Update checking of correct ip before accessing the Sendgrid api

## 2.18.0 (2024-04-11)
### Features
* feat(http3): ✨ Enable both http/2 and http/3 support by default when creating a cloudfront distro by @chrillep in https://github.com/triggerfishab/lisa-cli/pull/116
  feat(wp update): ✨ fast wp update by @chrillep in https://github.com/triggerfishab/lisa-cli/pull/82

## 2.17.0 (2024-04-11)
### Features
* feat(wp update): ✨ fast wp update by @chrillep in https://github.com/triggerfishab/lisa-cli/pull/82

## 2.16.1 (2024-02-08)
### Features
* feat(wpUpdate): ✨ standardize composer.json settings - minimum-stability, prefer-stable - skip php extensions by @chrillep in https://github.com/triggerfishab/lisa-cli/pull/73
* feat(vault): ✨ Add command for generating .vault_pass by @chrillep in https://github.com/triggerfishab/lisa-cli/pull/100


## 2.16.0 (2024-02-08)
### Features
* feat(wpUpdate): ✨ standardize composer.json settings - minimum-stability, prefer-stable - skip php extensions by @chrillep in https://github.com/triggerfishab/lisa-cli/pull/73
* feat(vault): ✨ Add command for generating .vault_pass by @chrillep in https://github.com/triggerfishab/lisa-cli/pull/100

## 2.15.7 (2023-11-08)
### Features
✨ Add custom tags (cost allocation tags) to S3 buckets and CloudFront distribution. This will allow us to see cost per bucket and distributions.

## 2.15.6 (2023-10-30)

### Fixes
🛠 Fix wrong name for revalidate secret in API vault.
🛠 scope for api key in sendgrid create

## 2.15.5 (2023-10-24)
### Features
✨ Ask user if the redirection page should be opened in default browser upon finishing app creation

## 2.15.4 (2023-10-24)
### Changes
🛠 Store credentials in 1password when creating new Lisa-app
🛠 Rename deafult wp user


## 2.15.3 (2023-10-24)
### Fixes
🛠 Read credentials from 1password instead of using config file


## 2.15.2 (2023-10-18)
### Fixes
🐛 Check that 1password-cli (`op`) is installed when trying to run any of the following commands: `"aws", "cdn", "godaddy", "s3", "sendgrid"`


## 2.15.1 (2023-10-17)
### Fixes
🐛 Fix bug with bucketName when updating multiple environments.

## 2.15.0 (2023-10-17)

### Features
🔧 config:best-practices by @ChrilleP in https://github.com/triggerfishab/lisa-cli/pull/54
👷 run prettier on PR's by @ChrilleP in https://github.com/triggerfishab/lisa-cli/pull/55
✨ template for creating PR's by @ChrilleP in https://github.com/triggerfishab/lisa-cli/pull/67
📦 Add ESLint for catching bugs by @ChrilleP in https://github.com/triggerfishab/lisa-cli/pull/75
📦 Update Cloudfront Distribution origin access identity so that it matches the one the bucket is looking for.

### Changes
🛠 The program now exits if a newer version of it can be installed.
🛠 Improve checking of bucket region before executing commands against aws/s3
⬆️ bump actions/checkout action to v4 by @renovate in https://github.com/triggerfishab/lisa-cli/pull/51
migrate renovate config by @renovate in https://github.com/triggerfishab/lisa-cli/pull/60

### Fixes
🐛 fixing bug with uninitialized variable apiKey by @jmeriksson in https://github.com/triggerfishab/lisa-cli/pull/65
⬆️ bump commander to v11 by @renovate in https://github.com/triggerfishab/lisa-cli/pull/39
⬆️ bump conf to v11 by @renovate in https://github.com/triggerfishab/lisa-cli/pull/42
⬆️ bump node-fetch to v3 by @renovate in https://github.com/triggerfishab/lisa-cli/pull/43
⬆️ bump semver to v7.5.2 [security] by @renovate in https://github.com/triggerfishab/lisa-cli/pull/61
⬆️ bump aws-sdk-js-v3 monorepo to v3.427.0 by @renovate in https://github.com/triggerfishab/lisa-cli/pull/48

## 2.14.2 (2023-10-11)

### Changes
🛠 Adjust aws user permissions.

## 2.14.1 (2023-10-11)

### Changes
🛠 Update version.

## 2.14.0 (2023-10-11)

### Features
📦 Create IAM user and access keys in AWS (`aws user create`).
📦 Create Lifecycle rules for a bucket in S3 (`s3 bucket set-lifecycle-policy`).

### Changes
🛠 Better error handling when communicating with 1password-cli (`op`).
🛠 Prettier config updated.

## 2.13.0 (2023-09-26)
### Features
📦 Allow creating dns-records in GoDaddy (`godaddy create`). Allowed record types are `A, CNAME, TXT`.
### Changes
🛠 Use correct Amazon issued certificate when creating CloudFront Distribution.

## 2.12.1 (2023-09-05)
### Changes
🛠 Use Amazon issued certificate when creating CloudFront Distribution.

## 2.12.0 (2023-08-24)

### Features
✨ HACKDAY - wp update command by @chrillep in https://github.com/triggerfishab/lisa-cli/pull/45

### Changes
🛠 Add better error handling if Sendgrid account name already exists.

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
