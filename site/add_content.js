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
        await db.run('INSERT INTO content (contentid, url, prompt) VALUES (?, ?, ?)', ['test', '/test', 'Personality test']);
        await db.run('INSERT INTO content (contentid, url, prompt) VALUES (?, ?, ?)', [uid0, 'https://www.youtube.com/embed/MPR3o6Hnf2g', 'School of Life']);
        await db.run('INSERT INTO content (contentid, url, prompt) VALUES (?, ?, ?)', [uid1, 'https://www.youtube.com/embed/I5IXM_gVB8I', 'Merudite']);

    } catch (e) { console.log(e); }
}
