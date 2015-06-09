 /*!
 * njf - v0.1
 * nejikrofl@gmail.com
 * Copyright (c) 2015 N.J.
*/

//short version
$(document).on('DOMContentLoaded', function () {

	$('[data-njf-input]').on('change', function () {
		var $elem = $(this),
			wrapEl = $elem.closest('[data-njf-wrap]'),
			labelEl = wrapEl.find('[data-njf-label]'),

			length = this.files ? this.files.length : 1,
			label = this.value.replace(/\\/g, '/').replace(/.*\//, '');

			if(length > 1) {
				label = length + ' files selected.'
			}

			labelEl.text(label);
	});
})