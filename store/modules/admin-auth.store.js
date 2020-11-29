import qs from "querystring";
import { execute } from "~/utils/publicScripts"

export const state = () => ({
  userType: '',
  admin: {
    mobile: '',
    otpCode: '',
    loginToken: '',
    verifyToken: '',
    role: '',
    isAdminLoggedIn: false,
    isOnlyExamsChecked: false,
    activeSortType: 'AVAILABLE_EXAMS',

    examSearch: '',
    activeExams: [],
    expiredExams: [],
  },
  student: {
    isStudentLoggedIn: false,
  },
})

export const getters = {
  getAdminMobile(state) {
    return state.admin.mobile;
  },
  getAdminLoginToken(state) {
    return state.admin.loginToken;
  },
  getVerifyToken(state) {
    return state.admin.verifyToken;
  },
  getOtpCode(state) {
    return state.admin.otpCode;
  },
  getRole(state) {
    return state.admin.role;
  },
  getIsAdminLoggedIn(state) {
    return state.admin.isAdminLoggedIn;
  },
  getAdminSortTypes(state) {
    return state.admin.sortTypes;
  },
  getAdminActiveSortType(state) {
    return state.admin.activeSortType;
  },
  getAdminOnlyExamsChecked(state) {
    return state.admin.isOnlyExamsChecked;
  },
  getAdminExamSearch(state) {
    return state.admin.examSearch;
  },
  getAdminActiveExams(state) {
    return state.admin.activeExams;
  },
  getAdminExpiredExams(state) {
    return state.admin.expiredExams;
  },

  getIsStudentLoggedIn(state) {
    return state.student.isStudentLoggedIn;
  },
}

export const mutations = {
  LOAD_ALL_ADMIN_DATA(state, data) {
    let mobile = localStorage.getItem('adminMobile');
    let loginToken = localStorage.getItem('adminLoginToken');
    let verifyToken = localStorage.getItem('adminVerifyToken');
    let role = localStorage.getItem('adminRole');
    let userType = localStorage.getItem('userType');
    state.admin.mobile = mobile;
    state.admin.loginToken = loginToken;
    state.admin.verifyToken = verifyToken;
    state.admin.role = role;
    state.admin.userType = userType;
    state.admin.isAdminLoggedIn = loginToken ? true : false;
  },
  SET_ADMIN_LOGIN_DATA(state, data) {
    state.admin.mobile = data.mobile;
    state.admin.loginToken = data.loginToken;
  },
  SET_ADMIN_VERIFY_DATA(state, data) {
    state.admin.role = data.role;
    state.admin.verifyToken = data.token;
  },
  SET_ADMIN_LOGIN(state, data) {
    state.admin.isAdminLoggedIn = true;
    state.student.isStudentLoggedIn = false;
  },
  SET_ADMIN_LOGOUT(state, data) {
    state.admin.isAdminLoggedIn = false;
    state.student.isStudentLoggedIn = false;
  },
  SET_ADMIN_ACTIVE_SORT_TYPE(state, data) {
    state.admin.activeSortType = data;
  },
  SET_ADMIN_ONLY_EXAM_CHECKED(state, data) {
    state.admin.isOnlyExamsChecked = data;
  },

  SET_ADMIN_EXAM_SEARCH(state, data) {
    console.log("aaa", data)
    state.admin.examSearch = data;
  },
  SET_ADMIN_ACTIVE_EXAMS(state, data) {
    state.admin.activeExams = data;
  },
  SET_ADMIN_EXPIRED_EXAMS(state, data) {
    state.admin.expiredExams = data;
  },

  SET_STUDENT_LOGIN_DATA(state, data) {
    // state.student.mobile = data.mobile;
    // state.student.loginToken = data.loginToken;
  },
  SET_STUDENT_VERIFY_DATA(state, data) {
    // state.student.role = data.role;
    // state.student.verifyToken = data.token;
  },
  SET_STUDENT_LOGIN(state, data) {
    state.student.isStudentLoggedIn = true;
    state.admin.isAdminLoggedIn = false;
  },
  SET_STUDENT_LOGOUT(state, data) {
    state.student.isStudentLoggedIn = false;
    state.admin.isAdminLoggedIn = false;
  },
}

export const actions = {
  loadAllAdminData({ dispatch, commit }, data) {
    commit('LOAD_ALL_ADMIN_DATA')
  },
  async loginAdmin({ dispatch, commit }, data) {
    const requestBody = {
      mobile: data
    };
    const url = '/auth/login';
    let fetchResult = await execute('POST', url, requestBody);
    if (fetchResult && (fetchResult.success === true)) {
      let result = {
        mobile: data, 
        loginToken: fetchResult.data.token
      };
      commit("SET_ADMIN_LOGIN_DATA", result);
      dispatch('setAdminLoginData', result);
      return fetchResult;
    } else if (fetchResult && (fetchResult.success === false)) {
      console.log("error store");
      this.$toast.error(
        "شماره موبایل وارد شده صحیح نمی باشد!"
      )  
      return false;
    } else {
      console.log("error store");
      this.$toast.error(
        "لطفا دوباره امتحان کنید!"
      )  
      return false;
    }
  },
  setAdminLoginData({ dispatch, commit }, payload) {
    localStorage.setItem('adminMobile', (payload.mobile));
    localStorage.setItem('adminLoginToken', (payload.loginToken));
  },
  getAdminLoginToken({ dispatch, commit }, payload) {
    let loginToken = (localStorage.getItem('adminLoginToken'));
    return loginToken;
  },
  async verifyAdmin({ state, dispatch, commit }, data) {
    const requestBody = {
      codesms: data,
    };
    let loginToken = await dispatch('getAdminLoginToken');
    
    // const headers = {
    //     'Authorization': "Bearer " + loginToken,
    //     'Content-Type': 'application/x-www-form-urlencoded'
    // };
    const url = '/auth/verify';
    
    return await this.$axios.post(url, qs.stringify(requestBody)).then((res) => {
      if (res.data && (res.data.success === true)) {
        commit("SET_ADMIN_LOGIN_DATA", res.data.data);
        commit("SET_ADMIN_LOGIN", true);
        dispatch('setAdminVerifyData', res.data.data);
        dispatch('setUserType', 'admin');
        return res.data;
      } else if (res.data && (res.data.success === false)) {
        this.$toast.error(
          "کد تایید صحیح نمی باشد!"
        )  
        return false;
      } else {
        console.log("verify error store");
        this.$toast.error(
          "خطای کد تایید"
        )  
        return false;
      }
    }).catch((error) => {
      console.log("RES error: ", error);
    })
  },
  setAdminVerifyData(ctx, payload) {
    localStorage.setItem('adminRole', (payload.role));
    localStorage.setItem('adminVerifyToken', (payload.token));
  },
  setUserType(ctx, payload) {
    localStorage.setItem('userType', payload);
  },
  logoutAdmin(ctx, payload) {
    localStorage.removeItem('adminRole');
    localStorage.removeItem('adminVerifyToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('adminMobile');
    localStorage.removeItem('adminLoginToken');
    localStorage.removeItem('otpCode');
  },
  setAdminActiveSortType({ dispatch, commit }, payload) {
    commit('SET_ADMIN_ACTIVE_SORT_TYPE', payload);
    if (payload == 'AVAILABLE_EXAMS') {
      dispatch('fetchAdminActiveExams');
    } else if (payload == 'EXPIRED_EXAMS') {
      dispatch('fetchAdminExpiredExams');
    } 
    else {
      dispatch('fetchAdminActiveExams');
      dispatch('fetchAdminExpiredExams');
      // dispatch('fetchAdminAllExams');
    }
  },
  setAdminOnlyExamChecked({ dispatch, commit }, payload) {
    commit('SET_ADMIN_ONLY_EXAM_CHECKED', payload);
  },


  setAdminExamSearch({ dispatch, commit }, payload) {
    commit('SET_ADMIN_EXAM_SEARCH', payload);
  },
  async fetchAdminActiveExams({ dispatch, commit, state }, payload) {
    let availableExams = true;
    let expiredExams = false;
    let searchQuery = state.admin.examSearch;

    let requestBody = new URLSearchParams();

    requestBody.append("newTest", availableExams);
    requestBody.append("oldTest", expiredExams);
    requestBody.append("query", searchQuery);

    const url = '/operator/test/testLists';
    let result = await execute('POST', url, requestBody);
    console.log("result1: ", result)
    if (result && (result.success === true)) {
      commit('SET_ADMIN_ACTIVE_EXAMS', result.data.tests);
      return result.data.tests;
      } else if (result && (result.success === false)) {
      // let errorMessage = ''
      // if (searchQuery.length) {
      //   errorMessage = `نتیجه ای برای عبارت ${searchQuery} درآزمون های پیش رو وجود ندارد`
      // } else {
      //   errorMessage = "نتیجه ای برای آزمون های پیش رو وجود ندارد"
      // }
      // this.$toast.error(
      //   errorMessage
      //   )  
      commit('SET_ADMIN_ACTIVE_EXAMS', {});
      return false;
    } else {
      console.log("verify error store");
      this.$toast.error(
        "خطای بارگذاری آزمون"
      )
      commit('SET_ADMIN_ACTIVE_EXAMS', {});
      return false;
    }
  },
  async fetchAdminExpiredExams({ dispatch, commit, state }, payload) {
    let availableExams = false;
    let expiredExams = true;
    let searchQuery = state.admin.examSearch;

    let requestBody = new URLSearchParams();

    requestBody.append("newTest", availableExams);
    requestBody.append("oldTest", expiredExams);
    requestBody.append("query", searchQuery);

    const url = '/operator/test/testLists';
    let result = await execute('POST', url, requestBody);
    console.log("result2: ", result.data)
    if (result && (result.success === true)) {
      commit('SET_ADMIN_EXPIRED_EXAMS', result.data.tests);
      return result.data.tests;
    } else if (result && (result.success === false)) {
      // let errorMessage = ''
      // if (searchQuery.length) {
      //   errorMessage = `نتیجه ای برای عبارت ${searchQuery} درآزمون های برگذار شده وجود ندارد`
      // } else {
      //   errorMessage = "نتیجه ای برای آزمون های برگذار شده وجود ندارد"
      // }
      // this.$toast.error(
      //   errorMessage
      // )  
      commit('SET_ADMIN_EXPIRED_EXAMS',{});
      return false;
    } else {
      console.log("verify error store");
      this.$toast.error(
        "خطای بارگذاری آزمون"
      )
      commit('SET_ADMIN_EXPIRED_EXAMS',{});
      return false;
    }
  },
  async fetchAdminAllExams({ dispatch, commit, state }, payload) {
    
    return await this.$axios.post(url, qs.stringify(requestBody), { headers: headers }).then((res) => {
      if (res.data && (res.data.success === true)) {
        commit("SET_ADMIN_LOGIN_DATA", res.data.data);
        commit("SET_ADMIN_LOGIN", true);
        dispatch('setAdminVerifyData', res.data.data);
        dispatch('setUserType', 'admin');
        return res.data;
      } else if (res.data && (res.data.success === false)) {
        this.$toast.error(
          "کد تایید صحیح نمی باشد!"
        )  
        return false;
      } else {
        console.log("verify error store");
        this.$toast.error(
          "خطای کد تایید"
        )  
        return false;
      }
    }).catch((error) => {
      console.log("RES error: ", error);
    })

  },
}

export default {
  state,
  getters,
  actions,
  mutations
}