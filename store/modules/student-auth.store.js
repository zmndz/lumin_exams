import qs from "querystring";
import { execute } from "~/utils/publicScripts";
import moment from 'moment'

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

    currentExam: [],
    isExamsLoadingActive: true,
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
  getCurrentExam(state) {
    return state.student.currentExam;
  },
  getIsExamsLoadingActive(state) {
    return state.student.isExamsLoadingActive;
  },
}

export const mutations = {
  LOAD_ALL_STUDENT_DATA(state, data) {
    let student = JSON.parse(localStorage.getItem('student'));
    let userType = localStorage.getItem('userType');
    state.student.name = student.name;
    state.student.family = student.family;
    state.student.mobile = student.mobile;
    state.student.nationalCode = student.nationalCode;
    state.student.token = student.token;
    state.student.role = student.role;
    state.student.userType = userType;
    state.student.isStudentLoggedIn = student.token ? true : false;
  },
  SET_STUDENT_ACTIVE_SORT_TYPE(state, data) {
    state.student.activeSortType = data;
  },
  SET_STUDENT_EXAMS(state, data) {
    state.student.exams = data;
  },
  SET_STUDENT_LOGIN_DATA(state, data) {
    state.student.token = data.token;
    state.student.name = data.name;
    state.student.family = data.family;
    state.student.mobile = data.mobile;
    state.student.nationalCode = data.nationalCode;
    state.student.role = data.role;
  },
  SET_STUDENT_LOGIN(state, data) {
    state.student.isStudentLoggedIn = true;
    state.admin.isAdminLoggedIn = false;
  },
  SET_STUDENT_LOGOUT(state, data) {
    state.student.isStudentLoggedIn = false;
    state.admin.isAdminLoggedIn = false;
  },
  SET_CURRENT_EXAM(state, data) {
    state.student.currentExam = data;
  },
  SET_EXAMS_LOADING_ACTIVE(state, data) {
    state.student.isExamsLoadingActive = data;
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
        name: fetchResult.data.student.name,
        family: fetchResult.data.student.family,
        mobile: fetchResult.data.student.mobile,
        nationalCode: fetchResult.data.student.nationalCode,
        role: fetchResult.data.student.role,
        token: fetchResult.data.token,
      };
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
  setStudentLoginData({ dispatch, commit }, payload) {
    let student = {
      name: payload.name,
      family: payload.family,
      token: payload.token,
      mobile: payload.mobile,
      nationalCode: payload.nationalCode,
      role: payload.role,
    }
    localStorage.setItem('student', JSON.stringify(student));
  },
  setUserType(ctx, payload) {
    localStorage.setItem('userType', payload);
  },
  logoutStudent(ctx, payload) {
    localStorage.clear();
  },
  async setStudentActiveSortType({ dispatch, commit, state }, payload) {
    commit('SET_STUDENT_ACTIVE_SORT_TYPE', payload);
    let availableExams = [];
    let correctedExams = [];
    let upcomingExams = [];
    let currentDate = moment().format('YYYY-MM-DD');
    let storageData = localStorage.getItem('studentExams');
    let checkCache = false;
    let cachedData = [];
    if (storageData !== null && storageData !== '' && storageData !== 'false') {
      cachedData = JSON.parse(localStorage.getItem('studentExams'));
      if (cachedData.date === currentDate) {
        checkCache = true;
      } else {
        checkCache = false;
      }
    } else {
      checkCache = false;
    }
    
    if (false) {
    // if (checkCache) {
      availableExams = cachedData.availableExams;
      correctedExams = cachedData.correctedExams;
      upcomingExams = cachedData.upcomingExams;
      commit('SET_EXAMS_LOADING_ACTIVE', false);
    } else {
      let allExams = await dispatch('fetchStudentExams', payload);
      function timeCompare(startTime, endTime) {
        let time = moment().format('HH:mm:ss');
        let result = null;
        let isBigger = false;
        let isSmaller = false;
        if(time >= startTime) {
          isBigger = true;
        };
        if(time <= endTime) {
          isSmaller = true;
        };

        if (isBigger && isSmaller) {
          result = 'BETWEEN';
        };
        if (!isBigger && isSmaller) {
          result = 'SMALLER';
        };
        if (isBigger && !isSmaller) {
          result = 'BIGGER';
        };
        return result;
      };
      function isDateSmaller(date) {
        let currentDateFormated = moment().format('YYYY-MM-DD');
        let examDate = date;
        return currentDateFormated <= examDate;
      };
      function isDateEqual(date) {
        console.log("currentDate", currentDate)
        console.log("date", date)
        let currentDateFormated = moment(currentDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
        let examDate = moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD');
        return currentDateFormated == examDate;
      };
      function dateCompare(date) {
        let currentDateFormated = moment(currentDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
        let examDate = moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD');
        return examDate > currentDateFormated;
      };
      allExams.map((item) => {
        if (item.isFinish && item.isResult) {
          item.type = "CORRECTED";
          correctedExams.push(item);
        }
        if (item.isFinish && !item.isResult) {
          item.type = "CORRECTING"
          correctedExams.push(item);
        }
        if (!item.isFinish && isDateEqual(item.date)) {
          if (timeCompare(item.startTime, item.endTime) === 'BETWEEN') {
            availableExams.push(item);
            item.type = "NOW";
          }
          if (timeCompare(item.startTime, item.endTime) === 'SMALLER') {
            console.log("ZZZZ")
            upcomingExams.push(item);
            item.type = "UPCOMING";
          }
          if (timeCompare(item.startTime, item.endTime) === 'BIGGER') {
            correctedExams.push(item);
            item.type = "ABSENT";
          }
        }
        if (!item.isFinish && dateCompare(item.date)) {
          upcomingExams.push(item);
          console.log("dateCompare: ", dateCompare(item.date))
          item.type = "UPCOMING";
        }

        if (!item.isFinish && !isDateSmaller(item.date)) {
          item.type = "ABSENT";
          correctedExams.push(item);
        }

      })

      let dataToCache = {
        date: currentDate,
        availableExams: availableExams,
        correctedExams: correctedExams,
        upcomingExams: upcomingExams,
      };
      localStorage.setItem('studentExams', JSON.stringify(dataToCache));
    }
    // console.log("availableExams", availableExams)
    // console.log("correctedExams", correctedExams)
    // console.log("upcomingExams", upcomingExams)

    if (payload === 'AVAILABLE_EXAMS') {
      commit('SET_STUDENT_EXAMS', availableExams);
    }
    if (payload === 'CORRECTED_EXAMS') {
      commit('SET_STUDENT_EXAMS', correctedExams);
    }
    if (payload === 'UPCOMING_EXAMS') {
      commit('SET_STUDENT_EXAMS', upcomingExams);
    }
  },
  async fetchStudentExams({ dispatch, commit, state }, payload) {
    const url = '/student/profile';
    commit('SET_EXAMS_LOADING_ACTIVE', true);
    let result = await execute('POST', url);
    if (result && (result.success === true)) {
      commit('SET_EXAMS_LOADING_ACTIVE', false);
      return result.data.tests;
    } else {
      commit('SET_EXAMS_LOADING_ACTIVE', false);
      console.log("student exams error store");
      this.$toast.error(
        "خطا در بارگذاری آزمون ها"
      )
      commit('SET_STUDENT_EXAMS',{});
      return false;
    }
  },
  async registerStudent({ dispatch, commit, state }, payload) {
    const url = '/student/register';
    let requestBody = payload;
    let result = await execute('POST', url, requestBody);
    if (result && (result.success === true)) {
      let studentLoginData = {
        nationalCode: payload.nationalCode,
        password: payload.password,
      }
      let studentLoginResult = await dispatch('loginStudent', studentLoginData);
      if (studentLoginResult) {
        this.$router.push('/student');
      } else {
        console.log("Error: login result from register", studentLoginResult);
      }
    } else if (result.code === 404) {
      console.log("student exams error store");
      this.$toast.error(
        "دانشجویی با مشخصات وارد شده وجود ندارد!"
      )
      commit('SET_STUDENT_EXAMS',{});
      return false;
    } else if (result.code === 730) {
      this.$toast.error(
        "دانشجویی با این مشخصات قبلا ثبت شده است"
      )
    } else {
      this.$toast.error(
        "ثبت نام با مشکل مواجه شده است"
      )
    }
  },
  async fetchExamQuestion({ dispatch, commit, state }, payload) {
    let test_id = payload;
    let storage = JSON.parse(localStorage.getItem(test_id));
    if (storage && storage.testID == test_id) {
      await dispatch('setCurrentExam', {testID: test_id, data: storage})
      return storage
    }

    let requestBody = {
      testID: payload,
    }
    const url = '/student/testStudent';
    let result = await execute('POST', url, requestBody);
    if (result && (result.success === true)) {
      result.data.noneAnsweredCount = result.data.questions.length;
      result.data.noneAnsweredList = result.data.questions;
      await dispatch('setCurrentExam', {testID: test_id, data: result.data})
      return result.data;
    } else if (result && (result.success === false) && result.code == 720) {
      this.$toast.error(
        "زمان آزمون فرا نرسیده است"
      )
    } else {
      this.$toast.error(
        "مشکل در شروع آزمون"
      )
    }
  },
  async submitExam({ dispatch, commit, state }, payload) {
    const url = '/student/testSubmit';
    let requestBody = new FormData();
    requestBody.append("testID", payload.testID);
    requestBody.append("answerStudent", payload.answerStudent);
    let length = payload.answerFiles.length;
    for (let index = 0; index < length; index++) {
      requestBody.append("answerFiles", payload.answerFiles[index]);
    }
    let config = {headers: { 'Content-Type': 'multipart/form-data' }}
    return await this.$axios.post(url, requestBody, config).then((res) => {
      if (res.data && (res.data.success === true)) {
        return true;
      } else {
        this.$toast.error(
          "ثیت آزمون با مشک مواجه شد"
        )
        return false;
      }
    }).catch((error) => {
      console.log("RES error: ", error);
    })

  },
  async examReport({ dispatch, commit, state }, payload) {
    const url = '/student/testReport';
    let requestBody = {testID: payload};
    let result = await execute('POST', url, requestBody);
    if (result && (result.success === true)) {
      return result;
    } else {
      this.$toast.error(
        "مشکل در نمایش نتیجه آزمون"
      )
    }
  },
  async setCurrentExam({ commit }, payload) {
    localStorage.setItem(payload.testID, JSON.stringify(payload.data));
    await commit('SET_CURRENT_EXAM', payload.data);
  },
  updateCurrentExam({ dispatch, commit }, payload) {
    localStorage.setItem(payload.testID, JSON.stringify(payload.data));
  },
  loadCurrentExam({ dispatch, commit, state }, payload) {
    let storage = JSON.parse(localStorage.getItem(payload));
    if (storage) {
      let length = storage.questions.length;
      let noneAnsweredList = [];
      let count = 0;
      storage.questions.map((item) => {
        if (item.selected) {
          count++;
        } else {
          noneAnsweredList.push(item)
        }
      })
      storage.noneAnsweredCount = length - count;
      storage.noneAnsweredList = noneAnsweredList;
      return storage;
    } else {
      return state.student.currentExam;
    }
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
