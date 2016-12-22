function withDashes() {
	return function(input) {
		if(input) {
			return input.replace(/\s+/g, "-");
		}
	}
}

app.filter('withDashes', withDashes);

