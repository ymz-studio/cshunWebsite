import Vue from 'vue';
import halfContainer from '@/components/layout/half-container.vue';
import moment from 'moment';

Vue.component('half-container', halfContainer);
moment.locale('zh-CN');

Vue.prototype.$yearDateTime = (timestamp) => {
	return moment(timestamp).format('YYYY 年 Mo Do  a hh:mm');
};

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

Vue.prototype.$roleMap = {
	ADMIN: '超级管理员',
	SUB_ADMIN_1: '商家管理',
	SUB_ADMIN_2: '政策文章',
	SUB_ADMIN_3: '专家解答',
	SUB_ADMIN_4: '旅游资源'
};
