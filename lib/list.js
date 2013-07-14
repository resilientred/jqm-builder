var BasicList = function(options) {
	var content = []
	var _options = {
		'data-role' : "listview"
	}
	options.data.forEach(function(data) {
		var li = new Tag('li', {}, [])
		li.content([(new Tag('a', {
			href : data.href
		}, [])).content(data.text)])
		content.push(li)
	})

	Tag.call(this, 'ul', _options, [])
	this.content(content)
}

FRAME5.utils.inherits(BasicList, Tag);
