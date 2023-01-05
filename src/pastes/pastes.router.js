//This is our router-handler function. Uses Express Router. Only file that should be used outside of its folders.
// S35.6 Organizing Express Code
const router = require("express").Router({ mergeParams: true });//creates instance of Express router, but fromm 35.7, this will merge paramters to be used in nested routes
const controller = require("./pastes.controller");//import /pastes controller
const methodNotAllowed = require("../errors/methodNotAllowed");//go to file to see notes, 35.7

//allows you to write path once and then chain multiplt handlers route-handlers to this path
    //using list() function we exported from pastes.controller.js
router.route("/:pasteId").get(controller.read).put(controller.update).delete(controller.delete).all(methodNotAllowed);
router.route("/").get(controller.list).post(controller.create).all(methodNotAllowed);

//exporting router-handler to be used in app.js
module.exports = router;