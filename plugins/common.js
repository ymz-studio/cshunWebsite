import Vue from 'vue';
import halfContainer from '@/components/layout/half-container.vue';
import moment from 'moment';

Vue.component('half-container', halfContainer);
moment.locale('zh-CN');

Vue.prototype.$dateTime = (timestamp) => {
	return moment(timestamp).format('Mo Do  a hh:mm');
};

Vue.prototype.$time = (timestamp) => {
	return moment(timestamp).format('a hh:mm');
};

Vue.prototype.$date = (timestamp) => {
	return moment(timestamp).format('Mo Do');
};

Vue.prototype.$fromNow = (timestamp) => {
	return moment(timestamp).fromNow();
};

Vue.prototype.$hasRole = (userRole, RoleList) => {
	for (let key in userRole) {
		if (RoleList.includes(userRole[key])) {
			return true;
		}
	}
	return false;
};
