app.controller('ShopController', function($scope, ProductService){

	var self = this;

	var cachedCategories = ProductService.GetCachedCategories("Categories");

	if(!cachedCategories){
		ProductService.GetAllCategories(function(result) {
			ScopeCategories(result);
		});
	}else{
		ScopeCategories(cachedCategories);
	}

	function ScopeCategories(categories){
		var finalArr = [];
		for(var i = 0; i <  categories.length; i++){
			var scopeObj = {Name: categories[i].Name, Count: categories[i].Count, class: ""};
			var kinds = categories[i].Types.split(",");
			for(var j = 0; j < kinds.length; j++){
				kinds[j] = {Kind: kinds[j]};
			}
			scopeObj.Types = kinds;
			finalArr.push(scopeObj);
		}
		self.Categories = finalArr;
		self.Category = finalArr[0].Name;
		self.Categories[0].class = "active";
	}

	this.SelectCategory = function(event, index){
		this.Categories.forEach(function(category, index){
			category.class = "";
		});
		this.Categories[index].class = "active";
		this.Category = this.Categories[index].Name;
		//TODO: select the real category data when i wire up the DB...
	}


});