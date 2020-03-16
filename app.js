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
	recordsRouter = require('./routes/records'),
	UserRouter = require('./routes/user'),
	APIRouter = require('./routes/api'),
	DoorRouter = require('./routes/door');
const port = process.env.PORT || 5000;

app.set('view engine', 'ejs');
mongoose
	.connect('mongodb+srv://secure:SecureAccess@cluster0-tfx51.mongodb.net/test?retryWrites=true&w=majority', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true
	})
	.then(() => {
		mongoose.connection.db.collection('users').countDocuments().then(async (count) => {
			if (count == 0) {
				let newUser = new User({ username: 'admin', role: 'Admin', RFID: '123' });
				User.register(newUser, '123', (err, user) => {
					passport.authenticate('local');
				});
			}
		});
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
app.use('/door', DoorRouter);
app.use('/user', UserRouter);
app.use('/api', APIRouter);

// Server Startup
app.listen(port, function() {
	console.log('http://localhost:5000');
});
