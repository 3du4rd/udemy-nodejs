const path = require('path');

// deprecated: module.exports = path.dirname(process.mainModule.filename);
module.exports = path.dirname(require.main.filename);