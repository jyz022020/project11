const router = require('express').Router();
const fs = require('fs');
const notesData = require('../../db/db.json');
const path = require('path');
const { nanoid } = require('nanoid')

router.get('/notes', (req, res) => {
    let results = notesData;
    res.send(results);
  });

router.post('/notes', (req, res) => {
    const record = generateNewNote(req.body.title, req.body.text);
    // fs.appendFileSync(path.join(__dirname, '../../db/db.json'), JSON.stringify(record));
    if (!notesData) {
        notesData = [];
    }
    notesData.push(record);
    console.log(notesData);
    fs.writeFile(path.join(__dirname, '../../db/db.json'), JSON.stringify(notesData), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
    res.send(record);
});

router.delete('/notes/:id', (req, res) => {
    console.log("recived delete request for" + req.params.id);
    var deleteId = req.params.id;
    var deleteIndex = -1;
    for (let i=0; i<notesData.length; i++) {
        if (notesData[i].id === deleteId) {
            deleteIndex = i;
        }
    }
    if (deleteIndex != -1) {
        notesData.splice(deleteIndex, 1);
    }
    fs.writeFile(path.join(__dirname, '../../db/db.json'), JSON.stringify(notesData), (err) => {
        if (err) throw err;
        console.log('The file has been updated!');
    });
    res.sendStatus(200);
});

function generateNewNote(title, text) {
    var record = {};
    record.id = nanoid();
    record.title = title;
    record.text = text;
    return record;
}


module.exports = router;