const cloneLisaProject = require("./clone");
const configureTrellisForKinsta = require("./kinsta");
const setupLocalSiteForDevelopment = require("./local");
const setupSendgridAccount = require("./sendgrid");
const init = require("./init");
const path = require("./path");
const dbImport = require("./db");
const destroy = require("./destroy");
const setup = require("./setup");
const setupS3Bucket = require("./s3");

module.exports = {
  cloneLisaProject,
  configureTrellisForKinsta,
  dbImport,
  destroy,
  init,
  path,
  setup,
  setupLocalSiteForDevelopment,
  setupSendgridAccount,
  setupS3Bucket,
};
