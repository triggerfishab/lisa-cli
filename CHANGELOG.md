## 1.6.0 (2021-11-06)
### Features
📦 Add `destroy` command

### Documentation
📝 Add documentation on how to use `lisa path`

## 1.5.1 (2021-11-03)
### Bux fixes
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
