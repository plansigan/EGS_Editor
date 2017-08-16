//INITIAL REQRUIRE
var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    methodOverride  = require('method-override'),
    flash           = require("connect-flash"),
    session         = require('express-session'),
    cookieParser    = require('cookie-parser');

// ROUTES VARIABLE
var productRouter = require('./server/routes/products'),
    csvToDBRouter = require('./server/routes/csvToDB');

//API ROUTES
var productAPI = require('./server/api/products')

//use packages
app.use(bodyParser.urlencoded({extended: true}));

// parse application/json
app.use(bodyParser.json())

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/client/components/public"));//to use the files inside public folder
app.use(express.static(__dirname + "/client/app"));//to use the files inside app folder
app.use(express.static(__dirname + "/node_modules"));//to use the files inside app folder
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));
app.use(flash());
app.use(require('express-session')({
    secret:"Hello world",
    resave:false,
    saveUninitialized:false
}));

//FLASH MESSAGES
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

//USE ROUTES
app.use("/products",productAPI);
app.use("/products",productRouter);
app.use("/upload",csvToDBRouter);
app.get('/',(req,res)=>{res.redirect('/products')});
app.get('*',(req,res)=>{res.send('BAD DOG');});

//SERVER
app.listen(3000,()=>{
  console.log('Started port on 3000')
})
