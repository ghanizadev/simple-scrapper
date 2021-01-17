import express from "express";
import error from "./middlewares/error";
import router from "./routes";

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.text());
app.use(router);
app.use(error);

app.listen(8080, () => {
  console.log("Server started at http://localhost:8080");
});
