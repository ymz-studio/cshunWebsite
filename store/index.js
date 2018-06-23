export const state = () => ({
	isMobile: false,
	sideBarOpened: false
});

export const mutations = {
	setDevice(state, device) {
		state.isMobile = device;
	},
	setSideBar(state, status) {
		state.sideBarOpened = status;
	}
};
