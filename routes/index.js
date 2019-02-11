var router = require("express").Router();
var apiRoutes = require("./api");

router.use("/", apiRoutes);

module.exports = router;
