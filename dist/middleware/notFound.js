const notFound = (req, res, next) => {
    return res
        .status(404)
        .json({ error: "ROUTE NOT FOUND: Check Your Request URL" });
};
export default notFound;
