const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send({ res: "Online and ready to serve!" }).status(200);
});

module.exports = router;