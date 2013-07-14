var page = new Tag('div', {

}, [{
	event : 'click',
	fn : function() {
		console.log('click')
	}
}])

var b = new Button({
	icon : 'gear',
	text : 'Settings'
})

var page = new Tag('div', {
	'data-role' : "page"
})
var t = new Toolbar({
	role : 'header',
	title : 'Home',
	right : {
		text : 'right',
		icon : 'home'
	},
	left : {
		text : 'left',
		icon : 'home'
	}
})

var blData = []
for (var i = 0; i < 5; i++) {
	blData.push({
		href : '222',
		text : 'a' + i
	})
};

var bl = new BasicList({
	data : blData
})

$(document).ready(function() {

	page.content([t, b, bl])
	page.append('body')
	console.log(page.render())
	//$('body').append(lock.render())
	page.changePage()
})