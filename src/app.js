const express = require("express");
const app = express();
const pastes = require("./data/pastes-data");
const pasteRouter = require("./pastes/pastes.router");//import router, 35.6

//will be adding this built-in middleware that adds a body property to the request
app.use(express.json());
/*
//app.use is for static data Section 35.2
app.use("/pastes", (req, res) => {
  res.json({ data: pastes });//taking the pastes data and responding back to client with JSON
});
*/
//35.6, using route-handler function
app.use("/pastes", pasteRouter);
/*
//notice the difference from code block above in comments is just app.use vs app.get(here), from 35.3
app.get("/pastes", (req, res) => {
  res.json({ data: pastes });
});//replaced with block above
*/
// Not found handler
app.use((request, response, next) => {
  next({ status: 404, message: `Not found: ${request.originalUrl}` });
}); 
// Error handler
app.use((error, request, response, next) => {
  console.error(error);
  const { status = 500, message = "Something went wrong!" } = error;//35.5, destructuring status and message variables from error object, with defualt parameters
  response.status(status).json({ error: message });
});

module.exports = app;