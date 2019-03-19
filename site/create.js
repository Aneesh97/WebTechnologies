var sqlite = require("sqlite");
var db;

create();

async function create() {
    try {
        db = await sqlite.open("./db.sqlite");
        await db.run("pragma foreign_keys = on");
        await db.run("create table users (id primary key, username, email, Oscore, Cscore, Escore, Ascore, Nscore, Wellbeing)");
        await db.run("insert into users values (42,'aa16169', 'aa16169@bristol.ac.uk', 42, 34, 56, 66, 11, 12 )");
        await db.run("insert into users values (53,'rb16730', 'rb16730@bristol.ac.uk', 11, 45, 7, 21, 13, 45)");

        await db.run("create table content (contentid primary key, url, category)");
        await db.run("insert into content values (2, 'google.co.uk', 'web browser')");
        await db.run("insert into content values (4, 'facebook.com', 'social media')");

        await db.run(
          "create table journal (journalid primary key, id,  prompt, entry, timestamp, content, contentid, " +
                "foreign key(id) references users(id), " +
                "foreign key(contentid) references content(contentid) " +
            ")");
        await db.run("insert into journal values (57, 42, 'Hello Mars', 'Aneesh journal', 5634875657, 'This is Aneesh journal', 2)");
        await db.run("insert into journal values (34, 53, 'Hello World', 'Roman journal', 130456348756, 'This is Roman journal', 4)");

    } catch (e) { console.log(e); }
}
