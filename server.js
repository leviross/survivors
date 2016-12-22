var express = require('express');
require('dotenv').load();
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');
// github ssh key deletion test

var router = express.Router();
var app = express();

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
//app.use(bodyParser.json({type: 'application/vnd.api+json', limit: '50mb'})); this failed

app.use(morgan('dev'));

app.use(express.static(__dirname + '/public'));


// app.use(session(sessionOpts));
app.use('/', router);

var UniqueTokenStrategy = require('passport-unique-token').Strategy;

router.post('/authenticate', function(req, res) {
	console.log(req.body);
	//user authenticated and can be found in req.user
});


// users
router.route('/api/users/:token')
	.post(UserController.CreateNewUser)
	.get(UserController.GetAllUsers);



router.get('*', function(req, res) {
	res.sendFile('index.html', {root: __dirname + '/public'});
});


var port = process.env.PORT; 

app.listen(port || 3030);
console.log("Listening on port " + port + "...");




