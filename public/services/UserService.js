function UserService($http, $location){

	'use strict'
	var cachedUsersArr = []; 
	var currentUser = null;
	var self = this;

	function ForceLogin(){
		alertify.notify("Login timed out, login again.", "error", 5);
		ServiceObject.Logout();
		$location.path('/login');
	}

	var ServiceObject = {

		GetAllUsers: function(cb){
			var self = this;
			var token = sessionStorage.getItem('Token');
			return $http.get('/api/users/' + token)
				.then(function(result){
					if(result.data.Error){
						ForceLogin();
					}else{
						cb(result.data);
						self.PutCachedUsers("UsersArray", result.data);
					}
				}, function(err){
					console.log("Error getting all users:\n", err);
					ForceLogin();
				});
		},
		CreateNewUser: function(userObj, cb){
			var token = sessionStorage.getItem('Token');
			return $http.post('/api/users/' + token, userObj)
				.then(function(result){
					if(result.data.Error){
						ForceLogin();
					}else{
						cb(result.data);
					}
				}, function(err){
					console.log("Error creating user:\n", err);
					ForceLogin();
				});
		},
		UpdateUser: function(userObj, cb){
			var token = sessionStorage.getItem('Token');
			return $http.put('/api/users/' + userObj._id + '/' + token, userObj)
				.then(function(result){
					if(result.data.Error){
						ForceLogin();
					}else{
						cb(result.data);
					}
				}, function(err){
					console.log("Error updating user:\n", err);
					ForceLogin();
				});	
		},
		DeleteUser: function(id, cb){
			var token = sessionStorage.getItem('Token');
			return $http.delete('/api/users/' + id + '/' + token)
				.then(function(result){
					if(result.data.Error){
						ForceLogin();
					}else{
						cb(result.data);
					}
				}, function(err){
					console.log("Error deleting user:\n", err);
					ForceLogin();
				});
		},
		ResetPassword: function(email, cb){
			// no token needed here as this is the password reset link when logged out
			return $http.put('/api/users/reset-password/' + email)
				.then(function(result){
					cb(result.data);
				}, function(err){
					console.log(err);
				});
		},
		PutCachedUsers: function(key, value){
			//was using $cacheFactory, but doesn't keep data on page reload.
			cachedUsersArr = value;
			sessionStorage.setItem(key, JSON.stringify(value));
		},
		GetCachedUsers: function(key){	
			if(cachedUsersArr && cachedUsersArr.length !== 0){
				return cachedUsersArr;
			}else if(sessionStorage.UsersArray != "" && sessionStorage.UsersArray != "undefined"){
				var parsedJsonArr = JSON.parse(sessionStorage.getItem(key));
				cachedUsersArr = parsedJsonArr;
				return cachedUsersArr;	
			}else{
				return null
			}
		},
		PutLoggedInUser: function(user, token){
			sessionStorage.setItem('Token', token);
           	sessionStorage.setItem('User', JSON.stringify(user));
			currentUser = user;
			currentUser.Token = sessionStorage.getItem('Token');
		},
		GetLoggedInUser: function(){
			var sessionUser = sessionStorage.getItem('User');
			if(currentUser) {
				return currentUser;
			}else if(sessionUser && sessionUser != "" && sessionUser != "undefined"){
				var parsedSessionUser = JSON.parse(sessionUser);
				parsedSessionUser.Token = sessionStorage.getItem('Token');
				currentUser = parsedSessionUser;
				return currentUser;
			}else{
				return null;
			}
		},
		Logout: function(){
			currentUser = null;
			cachedUsersArr = [];
    		sessionStorage.clear();
    		alertify.notify('You are logged off.', 'warning', 5, function(){});
    		$location.path('/')
		}

	}

	return ServiceObject;

};

UserService.$inject = ['$http', '$location'];

app.factory('UserService', UserService);
