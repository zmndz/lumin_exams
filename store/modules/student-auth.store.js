import qs from "querystring";
import { execute } from "~/utils/publicScripts"

export const state = () => ({
  student: {
    id: '',
    name: '',
    family: '',
    mobile: '',
    nationalCode: '',
    major: '',
    studentId: '',
    city: '',
    province: '',
    role: '',
    token: '',
    password: '',
    confirmPassword: '',
    exams: [],
    isStudentLoggedIn: false,
    activeSortType: '',
  },
})

export const getters = {
  getStudentMobile(state) {
    return state.student.mobile;
  },
  getStudentLogin(state) {
    return state.student.token;
  },
  getStudentRole(state) {
    return state.student.role;
  },
  getStudentName(state) {
    return state.student.name;
  },
  getStudentFamily(state) {
    return state.student.family;
  },
  getStudentActiveSortType(state) {
    return state.student.activeSortType;
  },
  getStudentExams(state) {
    return state.student.exams;
  },
  getIsStudentLoggedIn(state) {
    return state.student.isStudentLoggedIn;
  },
}

export const mutations = {
  LOAD_ALL_STUDENT_DATA(state, data) {
    let name = localStorage.getItem('studentName');
    let family = localStorage.getItem('studentFamily');
    let mobile = localStorage.getItem('studentMobile');
    let nationalCode = localStorage.getItem('studentMobile');
    let token = localStorage.getItem('studentLoginToken');
    let role = localStorage.getItem('studentRole');
    let userType = localStorage.getItem('userType');
    state.student.name = name;
    state.student.family = family;
    state.student.mobile = mobile;
    state.student.nationalCode = nationalCode;
    state.student.token = token;
    state.student.role = role;
    state.student.userType = userType;
    state.student.isStudentLoggedIn = token ? true : false;
  },
  SET_STUDENT_ACTIVE_SORT_TYPE(state, data) {
    state.student.activeSortType = data;
  },
  SET_STUDENT_EXAMS(state, data) {
    state.student.exams = data;
  },

  SET_STUDENT_DATA(state, data) {
    state.student.name = data.name;
    state.student.family = data.family;
    state.student.mobile = data.mobile;
    state.student.nationalCode = data.nationalCode;
    state.student.role = data.role;
  },
  SET_STUDENT_LOGIN_DATA(state, data) {
    state.student.token = data.token;
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
  loadAllStudentData({ dispatch, commit }, data) {
    commit('LOAD_ALL_STUDENT_DATA')
  },
  async loginStudent({ dispatch, commit }, data) {
    const requestBody = {
      nationalCode: data.nationalCode,
      password: data.password,
    };
    const url = '/student/login';
    let fetchResult = await execute('POST', url, requestBody);
    if (fetchResult && (fetchResult.success === true)) {
      let result = {
        token: fetchResult.data.token,
      };
      console.log("student Login", result)
      commit("SET_STUDENT_LOGIN_DATA", result);
      dispatch('setStudentLoginData', result);
      dispatch('setUserType', 'student');
      return fetchResult;
    } else if (fetchResult && (fetchResult.success === false)) {
      console.log("error student store");
      this.$toast.error(
        "کد ملی یا رمز عبور وارد شده صحیح نمی باشد"
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
  setStudentData({ dispatch, commit }, payload) {
    localStorage.setItem('studentName', (payload.name));
    localStorage.setItem('studentFamily', (payload.family));
    localStorage.setItem('studentMobile', (payload.mobile));
    localStorage.setItem('studentNationalCode', (payload.nationalCode));
    localStorage.setItem('studentRole', (payload.role));
  },
  setStudentLoginData({ dispatch, commit }, payload) {
    localStorage.setItem('studentToken', (payload.token));
  },
  setUserType(ctx, payload) {
    localStorage.setItem('userType', payload);
  },
  logoutStudent(ctx, payload) {
    localStorage.removeItem('studentName');
    localStorage.removeItem('studentFamily');
    localStorage.removeItem('studentMobile');
    localStorage.removeItem('studentNationalCode');
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentRole');
    localStorage.removeItem('userType');
  },
  async setStudentActiveSortType({ dispatch, commit }, payload) {
    commit('SET_STUDENT_ACTIVE_SORT_TYPE', payload);
    dispatch('fetchStudentExams', payload);
  },
  async fetchStudentExams({ dispatch, commit, state }, payload) {

    // let requestBody = new URLSearchParams();

    // requestBody.append("newTest", availableExams);
    // requestBody.append("oldTest", expiredExams);
    // requestBody.append("query", searchQuery);

    const url = '/student/profile';
    let result = await execute('POST', url);
    if (result && (result.success === true)) {
      // let fetchResult = result.data.user.tests;

      let fetchResult = {
        name: result.data.user.name,
        family: result.data.user.family,
        mobile: result.data.user.mobile,
        nationalCode: result.data.user.nationalCode,
        role: result.data.user.role,
      };

      console.log("student data", result)

      commit("SET_STUDENT_DATA", fetchResult);
      dispatch('setStudentData', fetchResult);

      commit('SET_STUDENT_EXAMS',result.data.user.tests);
      // return current;
    } else {
      console.log("student exams error store");
      this.$toast.error(
        "خطا در بارگذاری آزمون ها"
      )
      commit('SET_STUDENT_EXAMS',{});
      return false;
    }
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}