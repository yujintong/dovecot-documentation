/* List of Dovecot settings value types. */
export const setting_types = {
	BOOLEAN: {
		label: 'Boolean',
		url: '[[link,settings_types_boolean]]',
		default_required: true,
	},
	IPADDR: {
		label: 'IP Address(es)',
		url: '[[link,settings_types_ip]]',
		// Default: empty
	},
	SIZE: {
		label: 'Size',
		url: '[[link,settings_types_size]]',
		default_required: true,
	},
	STRING: {
		label: 'String',
		url: '[[link,settings_types_string]]'
		// Default: empty
	},
	STRING_NOVAR: {
		label: 'String Without Variables',
		url: '[[link,settings_types_string_novar]]'
		// Default: empty
	},
	/* This is a String entry, with specific allowable values. */
	ENUM: {
		label: 'String',
		url: '[[link,settings_types_string]]',
		enum_required: true,
	},
	TIME: {
		label: 'Time',
		url: '[[link,settings_types_time]]',
		default_required: true,
	},
	TIME_MSECS: {
		label: 'Time (milliseconds)',
		url: '[[link,settings_types_time_msecs]]',
		default_required: true,
	},
	UINT: {
		label: 'Unsigned Integer',
		url: '[[link,settings_types_uint]]',
		default_required: true,
	},
	OCTAL_UINT: {
		label: 'Octal Unsigned Integer',
		url: '[[link,settings_types_octal_uint]]',
		default_required: true,
	},
	URL: {
		label: 'URL',
		url: '[[link,settings_types_url]]'
		// Default: empty
	},
	FILE: {
		label: 'File',
		url: '[[link,settings_types_file]]'
		// Default: empty
	},
	NAMED_FILTER: {
		label: 'Named Filter',
		url: '[[link,settings_types_named_filter]]',
		no_default: true,
	},
	NAMED_LIST_FILTER: {
		label: 'Named List Filter',
		url: '[[link,settings_types_named_list_filter]]'
		// Default: empty
	},
	STRLIST: {
		label: 'String List',
		url: '[[link,settings_types_strlist]]'
		// Default: empty
	},
	BOOLLIST: {
		label: 'Boolean List',
		url: '[[link,settings_types_boollist]]'
		// Default: empty
	},
	IN_PORT: {
		label: 'Port Number',
		url: '[[link,settings_types_in_port]]',
		default_required: true,
	},
	GROUP: {
		label: 'Settings Group',
		url: '[[link,settings_groups_includes]]'
	}
}
