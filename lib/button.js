var Button = function(options) {
	var _options = {}

	if (options.right) {
		_options['class'] = 'ui-btn-right'
	}

	if (options.back) {

		_options['data-add-back-btn'] = true
		Tag.call(this, 'a', _options, [])
		this.content('Back')
		
	} else {

		var href = options.href || '#'
		var icon = options.icon || 'home'
		var text = options.text || 'Home'

		_options['data-role'] = 'button'
		_options['data-icon'] = icon
		Tag.call(this, 'a', _options, [])
		this.content(text)
		
	}
}

FRAME5.utils.inherits(Button, Tag);
