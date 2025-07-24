require("dotenv").config();
const express = require("express");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const methodOverride = require("method-override");
var bodyParser = require("body-parser");
const app = express();

const port = process.env.PORT;
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: false }));
const database = require("./config/database");
database.connect();
const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
const systemConfig = require("./config/system");
//cấu hình pug

app.set("view engine", "pug");
app.set("views", `${__dirname}/views`);

//flash
app.use(cookieParser("your_secret_key"));
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);
app.use(flash());

//end flash
//App locals valueables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

console.log(__dirname);
app.use(express.static(`${__dirname}/public`));
//Routes
route(app);
routeAdmin(app);
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
