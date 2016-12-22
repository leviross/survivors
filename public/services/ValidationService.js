function ValidationService(){

	String.prototype.capitalize = function() {
        return this.toLowerCase().replace(/\b\w/g, function(m){
            return m.toUpperCase();
        });
	}



	var ServiceObject = {
			
        Capitalize: function(name){
            return name.capitalize();
        }
        
	}

    return ServiceObject;

};

//ValidationService.$inject = []; inject stuff in the future if needed...

app.factory('ValidationService', ValidationService);