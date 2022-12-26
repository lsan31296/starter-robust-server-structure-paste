const express = require("express");
const app = express();
// TODO: Follow instructions in the checkpoint to implement ths API.
const pastes = require("./data/pastes-data");

//using route params to return one paste object by id and turning it into json
app.use("/pastes/:pasteId", (req, res, next) => {
  const { pasteId } = req.params;
  const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));

  if (foundPaste) {
    res.json({ data: foundPaste });
  } else {
    next(`Paste id not found: ${pasteId}`);
  }
});
app.use("/pastes", (req, res) => {
  res.json({ data: pastes });//taking the pastes data and responding back to client with JSON
});

// Not found handler
app.use((request, response, next) => {
  next(`Not found: ${request.originalUrl}`);
});

// Error handler
app.use((error, request, response, next) => {
  console.error(error);
  response.send(error);
});

module.exports = app;
