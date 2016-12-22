var validationModule = angular.module('ValidationModule', []);
validationModule.factory('ValidationService', [function(){

	String.prototype.capitalize = function(){
        return this.toLowerCase().replace(/\b\w/g, function(m){
            return m.toUpperCase();
        });
	}

	return {
			
        Capitalize: function(name){
            return name.capitalize();
        }
	}


}]);