var sqlite = require("sqlite");
var db;

create();

async function create() {
    try {
        db = await sqlite.open("./data.db");
        await db.run("pragma foreign_keys = on");

        await db.run("create table userCredentials (id integer primary key autoincrement, username, password)");
        // await db.run("insert into userCredentials values (42, 'aa16169', 'WebTech-2019')");
        // await db.run("insert into userCredentials values (53, 'rb16730', 'Merudite_1997')");

        await db.run("create table userScores (id, Oscore, Cscore, Escore, Ascore, Nscore, Wellbeing, " +
                "foreign key(id) references userCredentials(id) " +
              ")");
        // await db.run("insert into userScores values (42, 42, 34, 56, 66, 11, 12 )");
        // await db.run("insert into userScores values (53, 11, 45, 7, 21, 13, 45)");

        await db.run("create table content (contentid primary key, url, category)");
        // await db.run("insert into content values (2, 'google.co.uk', 'web browser')");
        // await db.run("insert into content values (4, 'facebook.com', 'social media')");

        await db.run(
          "create table journal (journalid primary key, id,  prompt, entry, timestamp, content, contentid, " +
                "foreign key(id) references userCredentials(id), " +
                "foreign key(contentid) references content(contentid) " +
            ")");
        // await db.run("insert into journal values (57, 42, 'Hello Mars', 'Aneesh journal', 5634875657, 'This is Aneesh journal', 2)");
        // await db.run("insert into journal values (34, 53, 'Hello World', 'Roman journal', 130456348756, 'This is Roman journal', 4)");

    } catch (e) { console.log(e); }
}
