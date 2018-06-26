import gql from 'graphql-tag';

export const state = () => ({
	user: null,
	isMobile: false,
	sideBarOpened: false,
	snackBar: {
		opened: false,
		title: '',
		text: ''
	}
});

export const mutations = {
	setDevice(state, device) {
		state.isMobile = device;
	},
	setSideBar(state, status) {
		state.sideBarOpened = status;
	},
	setUser(state, user) {
		state.user = user;
	},
	snackBarClose(state) {
		state.snackBar = {
			opened: false,
			title: '',
			text: ''
		};
	},
	snackBarOpen(state, { title, text }) {
		state.snackBar = {
			opened: true,
			title,
			text
		};
	}
};

export const actions = {};
