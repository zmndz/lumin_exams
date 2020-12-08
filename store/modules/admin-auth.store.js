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
    name: '',
    isAdminLoggedIn: false,
    isOnlyExamsChecked: false,
    activeSortType: 'AVAILABLE_EXAMS',

    examSearch: '',
    activeExams: [],
    expiredExams: [],
    currentExams: [],
  },
})

export const getters = {
  getAdminMobile(state) {
    return state.admin.mobile;
  },
  // getAdminLoginToken(state) {
  //   return state.admin.loginToken;
  // },
  getVerifyToken(state) {
    return state.admin.verifyToken;
  },
  getOtpCode(state) {
    return state.admin.otpCode;
  },
  getAdminRole(state) {
    return state.admin.role;
  },
  getAdminName(state) {
    return state.admin.name;
  },
  getIsAdminLoggedIn(state) {
    return state.admin.isAdminLoggedIn;
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
  getAdminCurrentExams(state) {
    return state.admin.currentExams;
  },
}

export const mutations = {
  LOAD_ALL_ADMIN_DATA(state, data) {
    let adminLogin = JSON.parse(localStorage.getItem('adminLogin'));
    let adminVerify = JSON.parse(localStorage.getItem('adminVerify'));
    let userType = localStorage.getItem('userType');
    state.admin.mobile = adminLogin.mobile;
    state.admin.loginToken = adminLogin.loginToken;
    state.admin.verifyToken = adminVerify.verifyToken;
    state.admin.role = adminVerify.role;
    state.admin.name = adminVerify.name;
    state.admin.userType = userType;
    state.admin.isAdminLoggedIn = adminLogin.loginToken ? true : false;
  },
  SET_ADMIN_LOGIN_DATA(state, data) {
    state.admin.mobile = data.mobile;
    state.admin.loginToken = data.loginToken;
  },
  SET_ADMIN_VERIFY_DATA(state, data) {
    state.admin.role = data.role;
    state.admin.verifyToken = data.token;
    state.admin.name = data.name;
  },
  SET_ADMIN_ACTIVE_SORT_TYPE(state, data) {
    state.admin.activeSortType = data;
  },
  SET_ADMIN_ONLY_EXAM_CHECKED(state, data) {
    state.admin.isOnlyExamsChecked = data;
  },

  SET_ADMIN_EXAM_SEARCH(state, data) {
    state.admin.examSearch = data;
  },
  SET_ADMIN_ACTIVE_EXAMS(state, data) {
    state.admin.activeExams = data;
  },
  SET_ADMIN_EXPIRED_EXAMS(state, data) {
    state.admin.expiredExams = data;
  },
  SET_ADMIN_CURRENT_EXAMS(state, data) {
    state.admin.currentExams = data;
  },
  UPDATE_ADMIN_EXAMS(state, data) {
    state.admin.currentExams[data.index].isActive = data.isActive;
    state.admin.currentExams[data.index].nameFile = data.nameFile;
    state.admin.currentExams[data.index].questions = data.questions;
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
      console.log("error login1");
      this.$toast.error(
        "شماره موبایل وارد شده صحیح نمی باشد!"
      )  
      return false;
    } else {
      console.log("error login2");
      this.$toast.error(
        "لطفا دوباره امتحان کنید!"
      )  
      return false;
    }
  },
  setAdminLoginData({ dispatch, commit }, payload) {
    let adminLogin = {
      mobile: payload.mobile,
      loginToken: payload.loginToken,
    }
   localStorage.setItem('adminLogin', JSON.stringify(adminLogin));
  },
  async verifyAdmin({ state, dispatch, commit }, data) {
    const requestBody = {
      codesms: data,
    };
    const url = '/auth/verify';
    

    let fetchResult = await execute('POST', url, requestBody);
    console.log("SSSS:", fetchResult)
    if (fetchResult && (fetchResult.success === true)) {
        // commit("SET_ADMIN_LOGIN_DATA", fetchResult.data.data);
        dispatch('setAdminVerifyData', fetchResult.data);
        dispatch('setUserType', 'admin');
        return fetchResult;
    } else if (fetchResult && (fetchResult.success === false)) {
      console.log("error verify1");
      this.$toast.error(
        "کد تایید صحیح نمی باشد!"
      )  
      return false;
    } else {
      console.log("error verify2");
      this.$toast.error(
        "خطای کد تایید"
      )  
      return false;
    }

    // return await this.$axios.post(url, qs.stringify(requestBody)).then((res) => {
    //   console.log("SSSS:", res)
    //   if (res.data && (res.data.success === true)) {
    //     commit("SET_ADMIN_LOGIN_DATA", res.data.data);
    //     dispatch('setAdminVerifyData', res.data.data);
    //     dispatch('setUserType', 'admin');
    //     return res.data;
    //   } else if (res.data && (res.data.success === false)) {
    //     this.$toast.error(
    //       "کد تایید صحیح نمی باشد!"
    //     )  
    //     return false;
    //   } else {
    //     console.log("verify error store");
    //     this.$toast.error(
    //       "خطای کد تایید"
    //     )  
    //     return false;
    //   }
    // }).catch((error) => {
    //   console.log("RES error: ", error);
    // })
  },
  setAdminVerifyData(ctx, payload) {
    let adminVerify = {
      role: payload.role,
      verifyToken: payload.token,
      name: payload.name,
    };
    localStorage.setItem('adminVerify', JSON.stringify(adminVerify));
  },
  setUserType(ctx, payload) {
    localStorage.setItem('userType', payload);
  },
  logoutAdmin(ctx, payload) {
    localStorage.removeItem('adminLogin');
    localStorage.removeItem('adminVerify');
    localStorage.removeItem('userType');
  },
  async setAdminActiveSortType({ dispatch, commit }, payload) {
    commit('SET_ADMIN_ACTIVE_SORT_TYPE', payload);
    dispatch('fetchAdminAllExams', payload);
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
    if (result && (result.success === true)) {
      commit('SET_ADMIN_ACTIVE_EXAMS', result.data.newTest);
      return result.data.newTest;
      } else if (result && (result.success === false)) {
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
    if (result && (result.success === true)) {
      commit('SET_ADMIN_EXPIRED_EXAMS', result.data.oldTest);
      return result.data.oldTest;
    } else if (result && (result.success === false)) {
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
    let availableExams = false;
    let expiredExams = true;
    let searchQuery = state.admin.examSearch;
   
    if (payload == 'AVAILABLE_EXAMS') {
      availableExams = true;
      expiredExams = false;
    } else if (payload == 'EXPIRED_EXAMS') {
      availableExams = false;
      expiredExams = true;
    }
    else {
      availableExams = false;
      expiredExams = false;
    }


    let requestBody = new URLSearchParams();

    requestBody.append("newTest", availableExams);
    requestBody.append("oldTest", expiredExams);
    requestBody.append("query", searchQuery);

    const url = '/operator/test/testLists';
    let result = await execute('POST', url, requestBody);
    if (result && (result.success === true)) {
      let active = [];
      let expired = [];
      let current = [];
      if (result.data.newTest && result.data.newTest.length) {
        active = result.data.newTest;
      } 
      if (result.data.oldTest && result.data.oldTest.length) {
        expired = result.data.oldTest;
      }
      let temp = [];
      temp = [...expired];
      current = [...active, ...temp];
      commit('SET_ADMIN_CURRENT_EXAMS', current);
      return current;
    } else if (result && (result.success === false)) {
      commit('SET_ADMIN_CURRENT_EXAMS',{});
      return false;
    } else {
      console.log("CURRENT exams error store");
      this.$toast.error(
        "خطای بارگذاری آزمون"
      )
      commit('SET_ADMIN_CURRENT_EXAMS',{});
      return false;
    }
  },
  async uploadQuestionFile({ dispatch, commit, state }, payload) {
    const url = '/operator/test/uploadQuestion';
    let requestBody = new FormData();
    requestBody.append("testID", payload.testID);
    requestBody.append("testFile", payload.testFile);
    let config = {headers: { 'Content-Type': 'multipart/form-data' }}
    return await this.$axios.post(url, requestBody, config).then((res) => {
      console.log("SSSS:", res)
      if (res.data && (res.data.success === true)) {
        return res.data;
      } else if (res.data && res.data.success === false && (res.data.code === 702))  {
        console.log("verify error store");
        this.$toast.error(
          "خطا در فایل سوالات. لطفا فایل سوالات را اصلاح کنید"
        )
        return false;
      } else {
        console.log("verify error store");
        this.$toast.error(
          "آپلود فایل سوالات با خطا مواجه شد"
        )  
        return false;
      }
    }).catch((error) => {
      console.log("RES error: ", error);
    })
  },
  async deleteQuestionFile({ dispatch, commit, state }, payload) {
    const url = '/operator/test/deleteTest';
    let requestBody = new URLSearchParams();
    requestBody.append("testID", payload);

    let result = await execute('POST', url, requestBody);
    if (result && (result.success === true)) {
      console.log("result", result);
      return true;
    } else {
      this.$toast.error(
        "حذف فایل سوالات باخطا مواجه شد"
      )
      return false;
    }
  },
  async totalReport({ dispatch, commit, state }, payload) {
    console.log("examReport", payload)
    const url = '/operator/test/totalReport';
    let requestBody = {testID: payload};
    let result = await execute('POST', url, requestBody);
    if (result && (result.success === true)) {
      return result;
    } else {
      this.$toast.error(
        "مشکل در نمایش نتایج آزمون"
      )
    }
  },
  updateExamList({ dispatch, commit, state }, payload) {
    console.log("xxx", payload);

// TO DO: fix upload issue after two time

    commit('UPDATE_ADMIN_EXAMS', payload)
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}