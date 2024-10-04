const logRequest = (req, res, next) => {
    console.log(`${req.method} Request to ${req.path}`);
    // testing;
    console.log(`Response status: ${res.statusCode}`);
    next();
};
export default { logRequest };
