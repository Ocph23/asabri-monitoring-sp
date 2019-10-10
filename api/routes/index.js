module.exports = function(app) {
  const bodyParser = require("body-parser");
  app.use(bodyParser.json());
  app.use("/api/auth", require("../auth"));
  app.use("/api/bank", require("../routes/bank.route"));
  app.use("/api/mitra", require("../routes/mitra.route"));
  app.use("/api/sp", require("../routes/sp.route"));
  app.use("/api/asuransi", require("../routes/asuransi.route"));
};
