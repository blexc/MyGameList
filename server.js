const express = require('express');
const mysql = require('mysql');

// Create connection
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'dummy',
    database : 'MYGAMELIST',
	multipleStatements: true,
});

// Connect
db.connect((err) => {
    if(err){
        throw 'Can\'t connect to mysql: ' + err;
    }
    console.log('MySql Connected...');
});

const app = express();

app.get('/initdb', (req, res) => { 
	let sql = 
		'DROP DATABASE IF EXISTS MYGAMELIST;\n' + 
		'CREATE DATABASE MYGAMELIST;\n' + 
		'USE MYGAMELIST;\n' +   
		'CREATE TABLE LIST(id int AUTO_INCREMENT,\n' + 
	    '	 username VARCHAR(255),\n' +   
		'	 pass VARCHAR(255),\n' + 
		'	 gameName VARCHAR(255),\n' + 
		'	 gameScore INT,\n' + 
		'	 finishDate DATE,\n' + 
		'	 review TEXT(65535),\n' + 
		'	 PRIMARY KEY(id));\n' + 
		'INSERT INTO MYGAMELIST.LIST (username, pass, gameName, gameScore, ' + 
		'	finishDate, review)\n' +
		'VALUES("blex99", "kirbyiswow", "Super Mario 64", 10, ' + 
		'	STR_TO_DATE(\'01/02/2003\',\'%m/%d/%Y\'), "This game is awesome."),\n' +
		'	("blex99", "kirbyiswow", "Rabi Ribi", 5, ' +
		'	STR_TO_DATE(\'05/11/2017\',\'%m/%d/%Y\'), ' + 
		'	"I think nachos taste good."),\n' +
		'	("blex99", "kirbyiswow", "Touhou 6", 1, ' + 
		'	STR_TO_DATE(\'12/02/1997\',\'%m/%d/%Y\'), "Too hard! ):"),\n' +
		'	("deadwhipz", "bec0meG0d", "Undertale", 2, ' + 
		'	STR_TO_DATE(\'04/22/2007\',\'%m/%d/%Y\'), "kinda lame imo");';

	let query = db.query(sql, [1, 2, 3, 4, 5], (err, result, fields) => {
        if(err) throw err;
		console.log('DB created...');
    });
});

app.get('/loadall', (req, res) => { 
	let sql = 'SELECT * FROM MYGAMELIST.LIST';

	let query = db.query(sql, (err, result) => {
        if(err) throw err;
		res.json(result);
		console.log('Loaded all...');
    });
});

app.get('/adduser/name/:name/pass/:pass', (req, res) => { 
	let sql = 
		'INSERT INTO MYGAMELIST.LIST (username, pass, gameName, gameScore,' + 
		'	finishDate, review)\n' + 
		'VALUES("' + req.params.name + '", "' + req.params.pass + '", "", 1, ' + 
		'	STR_TO_DATE(\'01/01/2001\',\'%m/%d/%Y\'), "");';

	let query = db.query(sql, (err, result) => {
        if(err) throw err;
		console.log('Adding user...');
		res.send({
			name: req.params.name,
			pass: req.params.pass
		});
    });
});

app.get('/addgame/:username/:pass/:gamename/:score/:date/:review', (req, res) => { 
	let sql = 
		'INSERT INTO MYGAMELIST.LIST (username, pass, gameName, gameScore,' + 
		'	finishDate, review)\n' + 
		'VALUES("' + req.params.username + '","' +
				req.params.pass + '","' +
				req.params.gamename + '",' + 
				req.params.score + ',' + 
				'STR_TO_DATE(\'' + req.params.date + '\',\'%Y-%m-%d\'),"' +
				req.params.review + '");'; 

	console.log(sql);
	let query = db.query(sql, (err, result) => {
        if(err) throw err;
		console.log('Adding game...');
		res.send({
			username: req.params.username,
			pass: req.params.pass,
			gamename: req.params.gamename,
			score: req.params.score,
			date: req.params.date,
			review: req.params.review
		});
    });
});

app.get('/updategame/:username/:gamename/:score/:date/:review', (req, res) => { 
	let sql = 
		'UPDATE MYGAMELIST.LIST\n' +  
		'SET gamescore = ' + req.params.score + ',\n' +
		'	finishdate = ' + 
				'STR_TO_DATE(\'' + req.params.date + '\',\'%Y-%m-%d\'),\n' +
		'	review = "' + req.params.review + '"\n' + 
		'WHERE MYGAMELIST.LIST.username = "' + req.params.username + '"\n' + 
		'		AND MYGAMELIST.LIST.gamename = "' + req.params.gamename + '";';

	console.log(sql);
	let query = db.query(sql, (err, result) => {
        if(err) throw err;
		console.log('Updating game...');
		res.send({
			username: req.params.username,
			gamename: req.params.gamename,
			score: req.params.score,
			date: req.params.date,
			review: req.params.review
		});
    });
});

app.get('/removegame/:username/:gamename', (req, res) => { 
	let sql = 
		'DELETE FROM MYGAMELIST.LIST\n' +  
		'WHERE MYGAMELIST.LIST.username = "' + req.params.username + '"\n' + 
		'		AND MYGAMELIST.LIST.gamename = "' + req.params.gamename + '";';

	console.log(sql);
	let query = db.query(sql, (err, result) => {
        if(err) throw err;
		console.log('Removing game...');
		res.send({
			username: req.params.username,
			gamename: req.params.gamename,
		});
    });
});

const port = 5000;
app.listen(port, () => `Server running on port ${port}`);



































