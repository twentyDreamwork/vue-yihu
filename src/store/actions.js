import * as types from './types'
export default {
  /*loading*/
	hideLoading:({commit})=>{
		commit(types.HIDE_LOADING)
	},
	showLoading:({commit})=>{
		commit(types.SHOW_LOADING)
	},
  increment: ({
    commit
  }) => {
    commit(types.INCREMENT);
  },
	decrement: ({
		commit
	}) => {
		commit(types.DECREMENT);
	}
}
