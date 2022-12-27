const express = require("express");
const app = express();
// TODO: Follow instructions in the checkpoint to implement ths API.
const pastes = require("./data/pastes-data");

//will be adding this built-in middleware that adds a body property to the request
app.use(express.json());

//using route params to return one paste object by id and turning it into json
app.use("/pastes/:pasteId", (req, res, next) => {
  const { pasteId } = req.params;
  const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));

  if (foundPaste) {
    res.json({ data: foundPaste });
  } else {
    next({ status: 404, message: `Paste id not found: ${pasteId}` });//35.5, added object with status&message property
  }
});
/*
//app.use is for static data Section 35.2
app.use("/pastes", (req, res) => {
  res.json({ data: pastes });//taking the pastes data and responding back to client with JSON
});
*/
//notice the difference from code block above in comments is just app.use vs app.get(here), from 35.3
app.get("/pastes", (req, res) => {
  res.json({ data: pastes });
});

// Variable to hold the next ID, Because some IDs may already be used, find the largest assigned ID
let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0);
/*
//this is being created to only be handled on /pastes when a post HTTP method is called.
app.post("/pastes", (req, res, next) => {
  const { data: { name, syntax, exposure, expiration, text, user_id } = {} } = req.body;//destructuring of each variable, with a default parameter
  if (text) {
    const newPaste = {
      id: ++lastPasteId, // Increment last ID, then assign as the current ID
      name,
      syntax,
      exposure,
      expiration,
      text,
      user_id,
    };
    pastes.push(newPaste);
    res.status(201).json({ data: newPaste });//chained method call to changed status from default success (200) to created (201)
  } else {
    res.sendStatus(400);//imagine there is no new paste record created (no text property), so there is no data to return, sendStatus will set the status and send it as a response to the user.
  }
});
*/
//New middleware function to validate the request body, 35.5
function bodyHasTextProperty(req, res, next) {
  const { data: { text } = {} } = req.body;
  if (text) {
    return next(); // Call `next()` without an error message if the result exists
  }
  next({ status: 400, message: "A 'text' property is required." });//35.5, added object with status&message property
}

app.post("/pastes", bodyHasTextProperty, (req, res) => {
    // Route handler no longer has validation code.
    const { data: { name, syntax, exposure, expiration, text, user_id } = {} } = req.body;
    const newPaste = {
      id: ++lastPasteId, // Increment last id then assign as the current ID
      name,
      syntax,
      exposure,
      expiration,
      text,
      user_id,
    };
    pastes.push(newPaste);
    res.status(201).json({ data: newPaste });
  }
);

// Not found handler
app.use((request, response, next) => {
  next(`Not found: ${request.originalUrl}`);
});
// Error handler
app.use((error, request, response, next) => {
  console.error(error);
  const { status = 500, message = "Something went wrong!" } = error;//35.5, destructuring status and message variables from error object, with defualt parameters
  response.status(status).json({ error: message });
});

module.exports = app;