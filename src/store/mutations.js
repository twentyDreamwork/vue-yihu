import {
	HIDE_LOADING,
	SHOW_LOADING,
	INCREMENT,
	DECREMENT
} from './types'
import getters from './getters'

const state = {
	loading:false,
	count: 20
};

const mutations = {
	/*loading*/
	[HIDE_LOADING](state){
		state.loading=false;
	},
	[SHOW_LOADING](state){
		state.loading=true;
	},
	[INCREMENT](state) {
		state.count++;
	},
	[DECREMENT](state) {
		state.count--;
	}
};

export default {
	state,
	mutations,
	getters
}
