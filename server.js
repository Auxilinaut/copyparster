"use strict";
var express = require('express'), multer = require('multer'), app = express();
let fs = require('fs'),
	        	PDFParser = require("pdf2json");
				let pdfParser = new PDFParser(this,1);

var storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, 'uploads/');
  },
  filename: function (request, file, callback) {
    console.log("in storage:");
    console.log(file);
    
    callback(null, file.originalname);
  }
});

app.use(express.static(__dirname) );

var upload = multer({storage: storage}).single('pdf');

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html');
});

app.post('/upload', function(request, response) {
  upload(request, response, function(err) {
    if(err) {
      console.log('Error Occured' + err);
        return;
      }
    console.log("in post:");
    console.log(request.file);
    
    var regpath = String(request.file.path);
    var newpath = regpath.slice(0,regpath.length-4) + '.json';
    
    console.log("path: " + regpath);
    pdfParser.loadPDF(regpath);
    pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
    
    console.log("newfile: " + newpath)
    pdfParser.on("pdfParser_dataReady", pdfData => {
		  fs.writeFile(newpath, JSON.stringify(pdfData));
		});
    
    response.end('Files uploaded');
    console.log('File Uploaded');
  });
});

var server = app.listen(process.env.PORT, process.env.IP);