var S4 = function() {
	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
function uuid(a) {
	if (a) {
		return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
	}
	return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
