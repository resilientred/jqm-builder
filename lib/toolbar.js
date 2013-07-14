var Toolbar = function(options) {

	this.__content = []

	if (options.left) {
		this.left = new Button(options.left)
		this.__content.push(this.left)
	}

	this.toolbarTitle = new Tag('h1', {

	}, [])
	this.toolbarTitle.content(options.title)
	this.__content.push(this.toolbarTitle)

	if (options.right) {
		options.right.right = true
		this.right = new Button(options.right)
		this.__content.push(this.right)
	}

	Tag.call(this, 'div', {
		'data-role' : options.role
	}, [])
	this.content(this.__content)
}

FRAME5.utils.inherits(Toolbar, Tag);

