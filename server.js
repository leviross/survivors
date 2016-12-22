var express = require('express');
require('dotenv').load();
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');
// github ssh key deletion test

var morgan = require('morgan');
var jwtauth = require('./api/my_modules/jwtauth');

var OrderController = require('./api/controllers/order');
var UserController = require('./api/controllers/user');
var ProductController = require('./api/controllers/product');
var CategoryController = require('./api/controllers/category');
var Product = require('./api/models/product');
var cloudinary = require('cloudinary');
var User = require('./api/models/user');

var mongoose = require('mongoose');
var uri = process.env.MONGOOSE_URI;

var router = express.Router();
var app = express();

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
//app.use(bodyParser.json({type: 'application/vnd.api+json', limit: '50mb'})); this failed



app.use(morgan('dev'));

app.use(express.static(__dirname + '/public'));


var sessionOpts = {
	saveUninitialized: true, // saved new sessions
	resave: false, // do not automatically write to the session store
	secret: 'secret',//Needs some secret string to initialize, can be empty, but this would be an .env var usually.
	cookie : { secure: false, httpOnly: true, maxAge: 2419200000 } // more config
}



// app.use(session(sessionOpts));
app.use('/', router);



var UniqueTokenStrategy = require('passport-unique-token').Strategy;

// router.get('/', function(req, res) {
	
// 	res.send("I LOVE SEFIRA!!!!   PEACE TO THE WORLD:)");
// });
router.post('/authenticate', function(req, res) {
	console.log(req.body);
	//user authenticated and can be found in req.user
});


function authenticate() {
	passport.authenticate('token', function(err, user, info) {
		if(err) return next(err);

		if(!user) res.status(401).json({message: "Incorrect token credentials"});
	
		req.user = user;
		next();
	});
}

mongoose.connect(uri, function(err){
	if(err) console.log("Mongoose Connection Error\n", err);
});

// users
router.route('/api/users/:token')
	.post(UserController.CreateNewUser)
	.get(UserController.GetAllUsers);

router.route('/api/users/:id/:token')
	.put(UserController.UpdateUser)
	.delete(UserController.DeleteUser);	
		
router.route('/api/users/reset-password/:email')
	.put(UserController.ResetPassword);	

router.post('/api/users', UserController.RegisterNewUser);	

router.route('/api/login')
	.post(UserController.Login);	

//orders
router.route('/api/orders')
	.get(jwtauth, UserController.GetUserOrders);

// categories
router.route('/api/categories')
	.get(CategoryController.GetAllCategories);

router.route('/api/categories/:token')
	.post(CategoryController.CreateNewCategory);
	
router.route('/api/categories/:id/:token')
	.put(CategoryController.UpdateCategory)
	.delete(CategoryController.DeleteCategory);	

router.route('/api/categories/:id')
	.get(CategoryController.GetCategoryById);	


// products 
router.get('/api/products', ProductController.GetAllProducts);
router.post('/api/products', ProductController.CreateProduct);

// router.route('/api/products')
// 	.post(ProductController.CreateProduct)
// 	.get(ProductController.GetAllProducts);

router.get('/api/products/:id', ProductController.GetProductById);
router.put('/api/products/:id', ProductController.UpdateProduct);
router.delete('/api/products/:id', ProductController.DeleteProduct)

// router.route('/api/products/:id')
// 	.get(ProductController.GetProductById)
// 	.put(ProductController.UpdateProduct)
// 	.delete(ProductController.DeleteProduct);



router.get('*', function(req, res) {
	res.sendFile('index.html', {root: __dirname + '/public'});
});





var port = process.env.PORT; 

app.listen(port || 3030);
console.log("Listening on port " + port + "...");




