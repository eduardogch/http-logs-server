var moment = require('moment');

exports.config = {
  nodeName: "application_server",
  logStreams: {
    apache: [
      "/Users/jeg2783/Apps/http-logs-server/logs/access-"+moment().format("YYYYMMDD")+".log"
    ]
  },
  server: {
    host: '127.0.0.1',
    port: 28777
  }
};
