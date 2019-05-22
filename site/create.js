var sqlite = require("sqlite");
var db;

create();

async function create() {
    try {
        db = await sqlite.open("./data.db");
        await db.run("pragma foreign_keys = on");

        //Create table for user auth credentials
        await db.run("create table userCredentials (id primary key, username, email, hash, salt)");
        //Create table for user test scores
        await db.run("create table userScores (id, Oscore, Cscore, Escore, Ascore, Nscore, Wellbeing, " +
                "foreign key(id) references userCredentials(id) " +
                ")");
        //Create table for content
        await db.run("create table content (contentid primary key, url, category)");
        //Create table for journal entries
        await db.run(
          "create table journal (journalid primary key, id, prompt, entry, timestamp, content, contentid, " +
                "foreign key(id) references userCredentials(id), " +
                "foreign key(contentid) references content(contentid) " +
                ")");

    } catch (e) { console.log(e); }
}
