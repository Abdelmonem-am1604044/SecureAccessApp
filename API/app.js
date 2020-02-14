const express = require('express'),
	logger = require('morgan'),
	mongoose = require('mongoose'),
	cors = require('cors'),
	routes = require('./routes/routes');

const app = express();
const port = 5000;

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use('/api', routes);

const dbConnection = mongoose
	.connect('mongodb://localhost:27017/SecureAccess', {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => {
		app.listen(port, () => {
			console.log(`Server started @ http://localhost:${port}`);
		});
	})
	.catch((err) => {
		console.log(`Failed to connect to monogoDb ${err}`);
	});
