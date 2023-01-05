//35.7, this function will be paired with the 'all()' method in the 'pastes.router.js'
//'all()' method catches any request that isn't handled by any of the route-handler functions when chained at the end.
function methodNotAllowed(req, res, next) {
    next({ status: 405, message: `${req.method} not allowed for ${req.originalUrl}`});
}
module.exports = methodNotAllowed;