//This controller is responsible for defining/exporting route-handler functions and to manage the state of a resource
// S35.6 Organizing Express Code
const pastes = require("../data/pastes-data");

function list(req, res) {
  const { userId } = req.params;
  res.json({ data: pastes.filter(userId ? paste => paste.user_id === Number(userId) : () => true) });
}//responsible for simply listing resource, but can filter resources that match params from parent route, 35.7

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
//New validation middleware function to validate the request body, 35.5
function bodyDataHas(propertyName) {
    return function (req, res, next) {
      const { data = {} } = req.body;
      if (data[propertyName]) {
        return next();
      }
      next({ status: 400, message: `Must include a ${propertyName}` });
    };
}//new validation is refactored, from 35.6

//new property-valdiation middleware functions
function exposurePropertyIsValid(req, res, next) {
    const { data: { exposure } = {} } = req.body;
    const validExposure = ["private", "public"];
    if (validExposure.includes(exposure)) {
      return next();
    }
    next({
      status: 400,
      message: `Value of the 'exposure' property must be one of ${validExposure}. Received: ${exposure}`,
    });
  }
  
  function syntaxPropertyIsValid(req, res, next) {
    const { data: { syntax } = {} } = req.body;
    const validSyntax = ["None", "Javascript", "Python", "Ruby", "Perl", "C", "Scheme"];
    if (validSyntax.includes(syntax)) {
      return next();
    }
    next({
      status: 400,
      message: `Value of the 'syntax' property must be one of ${validSyntax}. Received: ${syntax}`,
    });
  }
  
  function expirationIsValidNumber(req, res, next){
    const { data: { expiration }  = {} } = req.body;
    if (expiration <= 0 || !Number.isInteger(expiration)){
        return next({
            status: 400,
            message: `Expiration requires a valid number`
        });
    }
    next();
  }

function create(req, res) {
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
}//took this large block of code from app.js, building create-paste handler from 35.6

//Refactor of read-paste handler
function pasteExists(req, res, next) {
    const { pasteId } = req.params;
    const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));
    if (foundPaste) {
        res.locals.paste = foundPaste;//passing data through the response.locals object, 35.7
        return next();
    }
    next({ status: 404, message: `Paste id not found: ${pasteId}`});
}
function read(req, res) {
    //refactored code to pass data on from validator middleware function, 35.7
    res.json({ data: res.locals.paste });
}

//Adding update-paste handler
function update (req, res) {
    //refactored code, 35.7
    const paste = res.locals.paste;
    const { data: { name, syntax, expiration, exposure, text } = {} } = req.body;
    //Update the paste
    paste.name = name;
    paste.syntax = syntax;
    paste.expiration = expiration;
    paste.exposure = exposure;
    paste.text = text;
    res.json({ data: paste });
}

//Adding delete-paste handler
function destroy(req, res) {
  const { pasteId } = req.params;
  const index = pastes.findIndex((paste) => paste.id === Number(pasteId));
  const deletedPastes = pastes.splice(index, 1);
  res.sendStatus(204);
}

module.exports = {
    list, 
    create: [
        bodyDataHas("name"),
        bodyDataHas("syntax"),
        bodyDataHas("exposure"),
        bodyDataHas("expiration"),
        bodyDataHas("text"),
        bodyDataHas("user_id"),
        exposurePropertyIsValid,
        syntaxPropertyIsValid,
        expirationIsValidNumber,
        create
    ],
    read: [
        pasteExists,
        read
    ],
    update: [
        pasteExists,
        bodyDataHas("name"), 
        bodyDataHas("syntax"),
        bodyDataHas("exposure"),
        bodyDataHas("expiration"),
        bodyDataHas("text"),
        exposurePropertyIsValid,
        syntaxPropertyIsValid,
        expirationIsValidNumber,
        update
    ],
    delete: [
      pasteExists,
      destroy
    ]
};