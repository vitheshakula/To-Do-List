const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(methodOverride('_method'));

const priorityOrder = { High: 3, Medium: 2, Low: 1 };

let items = [];

function sortItemsByPriority(arr) {
    return arr.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
}

app.get("/", function (req, res) {
    const priority = req.query.priority || "All";
    let filteredItems = items;

    if (priority !== "All") {
        filteredItems = items.filter(item => item.priority === priority);
    }

    filteredItems = sortItemsByPriority(filteredItems);

    res.render("list", { ejes: filteredItems, selectedPriority: priority });
});

app.post("/add", function (req, res) {
    const { e1e1, priority } = req.body;
    if (e1e1.trim() === "") {
        return res.send("<script>alert('Task cannot be empty!'); window.location.href='/'</script>");
    }
    items.push({
        id: Date.now(),
        name: e1e1,
        priority: priority || "Low",
        completed: false
    });

    items = sortItemsByPriority(items);

    res.redirect("/");
});

app.post("/toggle/:id", function (req, res) {
    const id = parseInt(req.params.id);
    const item = items.find(item => item.id === id);
    if (item) {
        item.completed = !item.completed;
    }
    res.redirect("/");
});

app.post("/edit/:id", function (req, res) {
    const id = parseInt(req.params.id);
    const { newName, newPriority } = req.body;
    const item = items.find(item => item.id === id);
    if (item && newName.trim() !== "") {
        item.name = newName;
        item.priority = newPriority;
    }

    items = sortItemsByPriority(items);

    res.redirect("/");
});

app.post("/delete/:id", function (req, res) {
    const id = parseInt(req.params.id);
    items = items.filter(item => item.id !== id);
    res.redirect("/");
});

app.listen(8000, function () {
    console.log("Server Started on http://localhost:8000");
});
