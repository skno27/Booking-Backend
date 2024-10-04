import express from "express";
import session from "express-session";
import cors from "cors";
import prisma from "./prisma.js";
// ROUTERS
import infoRouter from "./routes/info.js";
import orderRouter from "./routes/order.js";
import checkoutRouter from "./routes/checkout.js";
// MIDDLEWARE
import logging from "./middleware/logging.js";
import errors from "./middleware/errors.js";
import xss from "./middleware/xss.js";
import notFound from "./middleware/notFound.js";
const app = express();
const port = process.env.PORT || 80;
app.use(express.json());
// express session for short term credential management
app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: !true },
}));
const corsOptions = {
    origin: "*",
    methods: "GET, POST, PATCH, DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.use(xss); // sanitize
app.use(logging.logRequest); // custom logging
app.get("/", async (req, res) => {
    const test = await prisma.customer.findMany();
    console.log(test);
    res.json({
        message: "API Hit!",
        customers: test,
    });
});
app.use("/v1/info", infoRouter);
app.use("/v1/order", orderRouter);
app.use("/v1/checkout", checkoutRouter);
// error handling
app.use(errors.errorHandler); // custom error handling
app.use(notFound); // 404
app.listen(port, () => {
    console.log(`App listening... @ http://localhost:${port}`);
});
