var sqlite = require("sqlite");
var db;

create();

async function create() {
    try {
        db = await sqlite.open("./data.db");
        await db.run("pragma foreign_keys = on");

        await db.run("create table userCredentials (id, username primary key, email, password)");
        await db.run("insert into userCredentials values (42, 'aa16169', 'aa16169@bristol.ac.uk', 'WebTech-2019')");
        await db.run("insert into userCredentials values (53, 'rb16730', 'rb16730@bristol.ac.uk', 'Merudite_1997')");

        await db.run("create table userScores (username, Oscore, Cscore, Escore, Ascore, Nscore, Wellbeing, " +
                "foreign key(username) references userCredentials(username) " +
              ")");
        await db.run("insert into userScores values ('aa16169', 42, 34, 56, 66, 11, 12 )");
        await db.run("insert into userScores values ('rb16730', 11, 45, 7, 21, 13, 45)");

        await db.run("create table content (contentid primary key, url, category)");
        await db.run("insert into content values (2, 'google.co.uk', 'web browser')");
        await db.run("insert into content values (4, 'facebook.com', 'social media')");

        await db.run(
          "create table journal (journalid primary key, username,  prompt, entry, timestamp, content, contentid, " +
                "foreign key(username) references userCredentials(username), " +
                "foreign key(contentid) references content(contentid) " +
            ")");
        await db.run("insert into journal values (57, 'aa16169', 'Hello Mars', 'Aneesh journal', 5634875657, 'This is Aneesh journal', 2)");
        await db.run("insert into journal values (34, 'rb16730', 'Hello World', 'Roman journal', 130456348756, 'This is Roman journal', 4)");

    } catch (e) { console.log(e); }
}
