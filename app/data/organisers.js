export const map = {
	'max-stoiber': {
		avatar: 'https://www.gravatar.com/avatar/48619fc17b3ab68472aebd56c0106278?s=128',
		name: 'Max Stoiber',
		summary: 'What if we took the best of JavaScript and the best of CSS, and combined them together to create the ultimate styling solution for React?',
	},
	'michael-jackson': {
		avatar: 'https://www.gravatar.com/avatar/9210a60b1492363560375d9cd6c842de?s=128',
		name: 'Michael Jackson',
		summary: 'React Router is a full-featured routing layer for React applications that run in the browser, on the server, on React Native, and anywhere else React runs.',
	},
	'cheng-lou': {
		avatar: 'https://www.gravatar.com/avatar/13bede8f6aa8c5eb590995b32ca04bf2?s=128',
		name: 'Cheng Lou',
		summary: 'What is a piece of code? What is a library, a tool, a platform and a language?',
	},
};

// TODO sort by time
export const list = Object.keys(map).sort().map(k => map[k]);
