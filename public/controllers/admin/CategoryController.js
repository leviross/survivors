function CategoryController(ProductService){

	var self = this;
	this.currentIndex = null;
	this.DisplayMode = 'list';
	var currentCategory = null;

	this.Categories = ProductService.GetCachedCategories("Categories");

	if(this.Categories == null || this.Categories == undefined || this.Categories == "undefined"){
		ProductService.GetAllCategories(function(dbArray){
			self.Categories = dbArray;
		});
	}

	this.AddCategory = function(){
		this.DisplayMode = 'create';
		this.Name = "";
		this.Types = "";
		this.Count = "";
	}

	this.EditCategory = function(category, index){
		this.DisplayMode = 'edit';
		currentCategory = category;
		this.Name = category.Name;
		this.Types = category.Types;
		this.Count = category.Count;
		this.currentIndex = index;
	}

	this.CreateNewCategory = function(){
		var catObj = {Name: this.Name, Types: this.Types, Count: this.Count};
		ProductService.CreateNewCategory(catObj, function(result){
			self.DisplayMode = 'list';
			ProductService.GetCachedCategories("Categories", function(result){
				self.Categories = result;
			})
			alertify.notify(result.Name + ' Category was created!', 'success', 5, function(){});
		});
	}

	this.UpdateCategory = function(){
		var catObj = {_id: currentCategory._id, Name: this.Name, Types: this.Types, Count: this.Count};
		ProductService.UpdateCategory(catObj, this.currentIndex, function(result){
			alertify.notify('Category Updated.', 'success', 5, function(){});
			self.Categories[self.currentIndex] = result;
			self.DisplayMode = 'list';
			ClearForm();
		});
	}

	this.DeleteCategory = function(category, index){
		ProductService.DeleteCategory(category._id, function(result){
			self.Categories.splice(index, 1);
			ProductService.SetCachedCategories('Categories', self.Categories);
			alertify.notify('Category Deleted.', 'error', 5, function(){});
		});
	}

	this.GetAllCategories = function(){
		ProductService.GetAllCategories(function(result){
			self.Categories = result;
		});
	}

	this.BackToCategories = function() {
		ProductService.GetCachedCategories("Categories", function(result){
		 	self.Categories = result; 
		 	self.DisplayMode = 'list';
			ClearForm();	
		});
	}

	function ClearForm(){
		self.CategoryForm.$setPristine();
		self.Name = "";
		self.Types = "";
		self.Count = "";
	}

}

app.controller('CategoryController', CategoryController);