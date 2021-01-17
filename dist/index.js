"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var express_1 = __importDefault(require("express"));
var error_1 = __importDefault(require("./middlewares/error"));
var routes_1 = __importDefault(require("./routes"));
var app = express_1.default();
app.use(express_1.default.static("public"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.text());
app.use(routes_1.default);
app.use(error_1.default);
app.listen(8080, function () {
    console.log("Server started at http://localhost:8080");
});
