var Page = function(options) {

	if (options.back) {
		Tag.call(this, 'a', {
			'data-add-back-btn' : 'true'
		}, [])
		this.content('Back')
	} else {

		var href = options.href || '#'
		var icon = options.icon || 'home'
		var text = options.text || 'Home'

		Tag.call(this, 'a', {
			'data-role' : 'button',
			'data-icon' : icon
		}, [])
		this.content(text)
	}
}

FRAME5.utils.inherits(Page, Tag);

Page.prototype.header = function(title) {

};

Page.prototype.body = function(content) {

};

Page.prototype.footer = function(text) {

}
