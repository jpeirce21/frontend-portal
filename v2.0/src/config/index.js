var json = require('./config.json');
const { IS_LOCAL, IS_PROD, IS_CANARY, IS_SANDBOX, BUILD_VERSION } = json
module.exports = { IS_LOCAL, IS_PROD, IS_CANARY, IS_SANDBOX, BUILD_VERSION }
