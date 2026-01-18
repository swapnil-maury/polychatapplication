const express = require("express");
const router = express.Router();
const { handleChat,handleHistory,handlechathistory} = require("./controller");

router.post("/chat", handleChat);

router.get("/chat/:slug?",handlechathistory);
router.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname + "/../frontend" });
});

router.get("/history",handleHistory);

module.exports = router;
