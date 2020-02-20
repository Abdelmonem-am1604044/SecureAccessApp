const express = require('express'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	app = express(),
	flash = require('connect-flash'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	User = require('./models/User'),
	methodOverride = require('method-override'),
	indexRouter = require('./routes/index'),
	recordsRouter = require('./routes/records');

app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost:27017/SecureAccess', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
});

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(
	require('express-session')({
		secret: 'YelpCamp',
		resave: false,
		saveUninitialized: false
	})
);
app.use(flash());

// Passport Configurtion
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

app.use('/', indexRouter);
app.use('/records', recordsRouter);
// Server Startup
app.listen(5000, function() {
	console.log('http://localhost:5000');
});
