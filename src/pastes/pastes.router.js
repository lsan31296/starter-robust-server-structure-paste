//This is our router-handler function. Uses Express Router. Only file that should be used outside of its folders.
// S35.6 Organizing Express Code
const router = require("express").Router();//creates instance of Express router
const controller = require("./pastes.controller");//import /pastes controller

//allows you to write path once and then chain multiplt handlers route-handlers to this path
    //using list() function we exported from pastes.controller.js
router.route("/:pasteId").get(controller.read).put(controller.update).delete(controller.delete);
router.route("/").get(controller.list).post(controller.create);

//exporting router-handler to be used in app.js
module.exports = router;