const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

let items = []; // [{ name: "task", completed: false }]

app.get("/", function (req, res) {
    res.render("list", { ejes: items });
});

app.post("/", function (req, res) {
    const itemName = req.body.e1e1;
    if (itemName.trim() !== "") {
        items.push({ name: itemName, completed: false });
    }
    res.redirect("/");
});

app.post("/toggle", function (req, res) {
    const index = req.body.index;
    if (items[index]) {
        items[index].completed = !items[index].completed;
    }
    res.redirect("/");
});

app.listen(8000, function () {
    console.log("Server Started");
});
