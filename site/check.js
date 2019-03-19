var sqlite = require("sqlite");
var db;
check();

async function check() {
    try {
        db = await sqlite.open("./db.sqlite");
        var as = await db.all("select * from users");
        var as1 = await db.all("select * from journal");
        var as2 = await db.all("select * from content");
        console.log(as);
        console.log(as1);
        console.log(as2);
    } catch (e) { console.log(e); }
}
