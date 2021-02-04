const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const path = require('path');


app.use((req, res, next) => {
    fs.readFile(path.join(__dirname, 'index.json'), 'utf8', function (err, data) {
        if (err) {
            console.error(err)
            return
        }
        console.log("new data", data);
        req.user = JSON.parse(data);
        next();
    })
})

app.get('/list', (req, res) => {
    res.json(req.user)
})

app.get('/deatils/:id', (req, res) => {
    let q = parseInt(req.params.id)
    res.json(req.user.filter(o => o.id === q))
})

app.delete('/delete/:id', (req, res) => {
    let userlist = req.user;
    let newuserlist = []
    let objIndex = userlist.findIndex((obj => obj.id.toString() === req.params.id.toString()));
    if (objIndex !== -1) {
        console.log(objIndex)
         newuserlist = userlist.splice(objIndex, 1);
        console.log("array", newuserlist)

        fs.writeFile(path.join(__dirname, 'index.json'), JSON.stringify(newuserlist), err => {
            if (err) {
                console.error(err)
                return
            }
            console.log('file written successfully!!')
            //file written successfully
        })
    }
    res.json(newuserlist)
})
app.use(bodyParser.json())
app.post('/add', (req, res) => {
    console.log(req.body);
    let obj = req.body;
    let adddata = req.user;
    adddata.push(obj)
    fs.writeFile(path.join(__dirname, 'index.json'), JSON.stringify(adddata), err => {
        if (err) {
            console.error(err)
            return
        }
        console.log('file written successfully!!')
        //file written successfully
    })
    res.json(adddata)
})

app.put('/update', (req, res) => {
    console.log(req.body);
    let list = req.user;
    let objIndex = list.findIndex((obj => obj.id.toString() === req.body.id.toString()));
    list[objIndex] = req.body;
    fs.writeFile(path.join(__dirname, 'index.json'), JSON.stringify(list), err => {
        if (err) {
            console.error(err)
            return
        }
        console.log('file written successfully!!')
        //file written successfully
    })
    res.json(list)
})

app.listen(process.env.PORT || 8080);