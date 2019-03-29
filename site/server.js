// Sample express web server.  Supports the same features as the provided server,
// and demonstrates a big potential security loophole in express.

var express = require("express");
var app = express();
var fs = require("fs");
var sql = require("sqlite3");
var db = new sql.Database("data.db");
var banned = [];
banUpperCase("./public/", "");

// Define the sequence of functions to be called for each request.  Make URLs
// lower case, ban upper case filenames, require authorisation for admin.html,
// and deliver static files from ./public.
app.use(handle);
app.use(ban)
app.use("/admin.html", auth);
var options = { setHeaders: deliverXHTML };
app.use(express.static("public", options));
app.listen(8080, "localhost");
console.log("Visit http://localhost:8080/");

//Handle url requests
function handle (req, res, next) {
  // Make the URL lower case.
  var url = req.url.toLowerCase();
  console.log("url=", req.url);
  if (url.startsWith("/content.html")) get_content(url, res);
  //Request from client side AJAX
  else if (url == "/data") get_list(res);
  //else getFile(url, res);
  next();
}

//CLIENT BASED
//Get a list of data from a client AJAX request
function get_list(res) {
  var ps = db.prepare("SELECT * from users");
  ps.all(ready);
  console.log("users list")
  console.log(ps);
  function ready(err, list) {
    deliver_list(list, res);
  }
}
function deliver_list(list, res) {
  var text = JSON.stringify(list);
  deliver(res, "text/plain", null, text);
}

//SERVER BASED
//Get piece of content from database from server URL request
function get_content(url, res) {
  fs.readFile("./content.html", ready);
  function ready(err, content) {
    get_data(content, url, res);
  }
}
function get_data(text, url, res) {
  var parts = url.split("=");
  var id = parts[1];
  var ps = db.prepare("select * from pets where id=?");
  ps.get(id, ready);
  function ready(err, obj) { prepare(text, obj, res); }
}
//Send filled in document to be rendered
function prepare(text, data, res) {
  var parts = text.split("$");
  var page = parts[0] + data.name + parts[1] + data.image + parts[2];
  deliver(res, htmltype, null, page);
}

// Forbid access to the URLs in the banned list.
function ban(req, res, next) {
    for (var i=0; i<banned.length; i++) {
        var b = banned[i];
        if (req.url.startsWith(b)) {
            res.status(404).send("Filename not lower case");
            return;
        }
    }
    next();
}

// Redirect the browser to the login page.
function auth(req, res, next) {
    res.redirect("/login.html");
}

// Called by express.static.  Deliver response as XHTML.
function deliverXHTML(res, path, stat) {
    if (path.endsWith(".html")) {
        res.header("Content-Type", "application/xhtml+xml");
    }
}

// Check a folder for files/subfolders with non-lowercase names.  Add them to
// the banned list so they don't get delivered, making the site case sensitive,
// so that it can be moved from Windows to Linux, for example. Synchronous I/O
// is used because this function is only called during startup.  This avoids
// expensive file system operations during normal execution.  A file with a
// non-lowercase name added while the server is running will get delivered, but
// it will be detected and banned when the server is next restarted.
function banUpperCase(root, folder) {
    var folderBit = 1 << 14;
    var names = fs.readdirSync(root + folder);
    for (var i=0; i<names.length; i++) {
        var name = names[i];
        var file = folder + "/" + name;
        if (name != name.toLowerCase()) banned.push(file.toLowerCase());
        var mode = fs.statSync(root + file).mode;
        if ((mode & folderBit) == 0) continue;
        banUpperCase(root, file);
    }
}
