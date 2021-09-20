DROP DATABASE IF EXISTS MYGAMELIST;  
CREATE DATABASE MYGAMELIST;  
USE MYGAMELIST;  
CREATE TABLE LIST(id int AUTO_INCREMENT, 
				  username VARCHAR(255), 
				  pass VARCHAR(255), 
                  gameName VARCHAR(255), 
                  gameScore INT, 
                  finishDate DATE, 
                  review TEXT(65535), 
                  PRIMARY KEY(id)); 

INSERT INTO MYGAMELIST.LIST (username, pass, gameName, gameScore, finishDate, review)
VALUES("blex99", "kirbyiswow", "Super Mario 64", 10, STR_TO_DATE('01/02/2003','%m/%d/%Y'), "This game is awesome."),
	("blex99", "kirbyiswow", "Rabi Ribi", 5, STR_TO_DATE('05/11/2017','%m/%d/%Y'), "I think nachos taste good."),
	("blex99", "kirbyiswow", "Touhou 6", 1, STR_TO_DATE('12/02/1997','%m/%d/%Y'), "Too hard! ):"),
	("deadwhipz", "love", "Undertale", 2, STR_TO_DATE('04/22/2007','%m/%d/%Y'), "kinda lame imo");