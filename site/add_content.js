var sqlite = require("sqlite");
var uniqid = require('uniqid');
var db;
var uid0 = uniqid();
var uid1 = uniqid();

add();

async function add() {
    try {
        db = await sqlite.open("./data.db");

        //Insert content into table
        await db.run('INSERT INTO content (contentid, url, title, description, prompt, image) VALUES (?, ?, ?, ?, ?, ?)', ['test', '/test', 'Personality Test', 'Make sure you\'ve completed our personality test!', 'My initial thoughts:', '/assets/content0.svg']);
        await db.run('INSERT INTO content (contentid, url, title, description, prompt, image) VALUES (?, ?, ?, ?, ?, ?)', [uid0, 'https://www.youtube.com/embed/MPR3o6Hnf2g', 'Wellbeing', 'Get started understanding your personal wellbeing.', 'I think that:', '/assets/content1.svg']);
        await db.run('INSERT INTO content (contentid, url, title, description, prompt, image) VALUES (?, ?, ?, ?, ?, ?)', [uid1, 'https://www.youtube.com/embed/I5IXM_gVB8I', 'Self-Awareness', 'Begin the journey to know yourself.', 'I\'ve found that', '/assets/content2.svg']);

    } catch (e) { console.log(e); }
}
