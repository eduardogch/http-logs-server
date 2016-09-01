var moment = require('moment');
exports.config = {
  nodeName: "application_server",
  logStreams: {
    apache: [
      __dirname + "/logs/access-" + moment().format("YYYYMMDD") + ".log"
    ]
  },
  server: {
    host: '127.0.0.1',
    port: 28777
  }
};
