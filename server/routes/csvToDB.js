var express           = require('express'),
    router            = express.Router(),
    formidable        = require('formidable'),
    fs                = require('fs'),
    path              = require('path'),
    helperFunction    = require('../config/helperFunction.js'),
    localEnvironment  = require('../config/localEnvironment.js');

router.post('/', function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = false;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '../temp');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, 'csvFile'));
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    helperFunction.csvTodb(req,res,localEnvironment.csvfn,localEnvironment.dbConfig)//after upload execute query to add to DB
  });

  // parse the incoming request containing the form data
  form.parse(req);

});


module.exports = router;
