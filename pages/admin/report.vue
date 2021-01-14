<template>
  <div v-if="!isLoading" id="js-report__wrapper" class="report__wrapper">
    <div v-if="!isNoOneAttended">
      <div class="row">
        <div class="col-12 col-md-6">
          <div class="report__title">
            آزمون 
            <div class="report__course">
              zzz
            </div>
          </div>
          <div class="report__student-wrapper">
            <div class="report__student-label">
              انتخاب دانشجو: 
            </div>
            <div class="report__student-name">
              <b-form-select v-model="selectedStudent" :options="studentsList" @change="loadStudentReport"></b-form-select>
            </div>
            <div class="report__download-wrapper">
              <div id="js-report__download" class="report__download " :class="{'report__download--active': checkAllStudentsScoresSubmited()}" @click="downloadReport()">
                دانلود کارنامه
              </div>
              <b-tooltip target="js-report__download">بعد ثبت همه نمرات، کارنامه فعال خواهد شد</b-tooltip>
            </div>
          </div>
        </div>
      </div>
      <div v-if="isStudentAttended" class="row">
        <div class="col-12 col-md-6">
          <div class="report__test-title">سوال‌های چهار گزینه ای</div>
          <div class="report__test-wrapper">
            <div v-for="(question, index) in selectedStudentReport.testQuestions" :key="index" class="report__test">
              <div class="report__test-question-title" v-html="question.index + '- ' + question.question">
              </div>
              <div class="report__test-question-wrapper">
                <div v-for="(option, index2) in question.options" :key="index2" 
                  class="report__test-question"
                  :class="{
                    'report__test-question--incorrect': !option.isCorrect && option.isStudentAnswer,
                    'report__test-question--correct': option.isCorrect,
                  }"
                >
                  <span v-html="option.label + ') ' + option.text" class="report__test-question-text">
                  </span>
                  <b-badge v-if="question.answer == index2 + 1" variant="success" size="lg">گزینه صحیح</b-badge>
                </div>
              </div>
            </div>
          </div>

          <div class="report__descriptive-title">سوال‌های تشریحی</div>
          <div class="report__descriptive-wrapper">
            <div v-for="(question, index) in selectedStudentReport.descriptiveQuestions" :key="index" class="report__descriptive">
              <div class="report__descriptive-question-title" v-html="question.index + '- ' + question.question">
              </div>
              <div class="report__descriptive-question-wrapper">
                <div class="row">
                  <div class="col-12">
                    <div class="report__descriptive-question">
                      <span>پاسخ دانشجو: </span>
                      <span class="report__descriptive-question-answer">{{question.answerStudent}}</span>
                    </div>
                    <div class="report__descriptive-question-score">
                      <span>
                        نمره: 
                      </span>
                      <input 
                        v-model="descriptiveScores[index]"
                        class="report__descriptive-question-input"
                        :class="{'report__descriptive-question-input--danger' : !descriptiveScores[index], 'report__descriptive-question-input--success' : descriptiveScores[index]}" 
                        type="number"
                        @input="updateScore"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="report__results">
            <div class="report__results-testCount">
              <div class="report__results-testCount-label">
                تعداد پاسخ درست تستی:
              </div>
              <div class="report__results-testCount-value">
                <div>{{selectedStudentReport.testQuestionsCorrectCount}}</div>
                <div>از</div>
                <div>{{selectedStudentReport.testQuestionsCount}}</div>
              </div>
            </div>
            
            <div class="report__results-testScore">
              <div class="report__results-testScore-label">
                نمره تستی:
              </div>
              <div class="report__results-testScore-value">
                {{selectedStudent.testStudent | filterDecimals}}
              </div>
            </div>

            <div class="report__results-descriptiveCount">
              <div class="report__results-descriptiveCount-label">
                تعداد سوال‌های تشریحی:
              </div>
              <div class="report__results-descriptiveCount-value">
                {{selectedStudentReport.descriptiveQuestionsCount}}
              </div>
            </div>

            <div class="report__results-descriptiveScore">
              <div class="report__results-descriptiveScore-label">
                جمع نمرات تشریحی:
                <b-badge v-if="selectedStudentReport.isResult" variant="success">ثبت شده</b-badge>
              </div>
              <div class="report__results-descriptiveScore-value">
                  <span v-if="selectedStudentReport.isResult">
                    {{selectedStudentReport.resultDescriptive | filterDecimals}}
                  </span>
                  <span v-else>
                    {{descriptiveScoresSum | filterDecimals}}
                  </span>
              </div>
            </div>
            <div class="report__results-totalScore">
              <div class="report__results-totalScore-label">
                جمع نمرات تستی و تشریحی: 
                <b-badge v-if="selectedStudentReport.isResult" variant="success">ثبت شده</b-badge>
              </div>
              <div class="report__results-totalScore-value" :class="{'text-danger' : totalScore > 20}">
                <span v-if="selectedStudentReport.isResult">
                  {{selectedStudentReport.resultTotal | filterDecimals}}
                </span>
                <span v-else>
                  {{totalScore}}
                </span>
              </div>
              
            </div>
          </div>
        </div>
        <div v-if="selectedStudentReport.fileStudent && selectedStudentReport.fileStudent.length" class="col-12 col-md-6">
          <div class="report__results-attachments-title">
            فایل های ضمیمه شده توسط دانشجو
          </div>
          <div v-for="(item, index) in selectedStudentReport.fileStudent" :key="index" class="report__results-attachments-wrapper">
            <img :src="item" class="report__results-attachments" alt=""> 
          </div>
        </div>
      </div>
      <div v-else class="text-right my-5">
        <b-alert show variant="warning">این دانشجو در آزمون شرکت نکرده</b-alert>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="report__results-buttons">
            <b-button v-if="isStudentAttended" size="sm" variant="success" class="ml-3" @click="submitAndNextStudent()">
              ثبت نمره و بررسی دانشجو بعدی
            </b-button>
            <b-button v-else size="sm" variant="success" class="ml-3" @click="nextStudent">
              بررسی دانشجو بعدی
            </b-button>
            <b-button size="sm" variant="light" @click="goToAdmin">
              بازگشت
            </b-button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center">
      <div class="text-center mb-3">
        این آزمون به هیچ دانشجویی نسبت داده نشده
      </div>
      <b-button size="sm" variant="light" @click="goToAdmin">
        بازگشت
      </b-button>
    </div>
    <b-modal ref="modal-report" id="modal-report" hide-header centered>
      <div style="margin: 30px 0; text-align: center;display: flex; flex-direction: column; align-items: center;">
        <div style="margin-bottom: 32px;font-weight:bold;">نمرات همه دانشجو ها ثبت شده و کارنامه قابل دانلود می باشد</div>
        <div class="report__download " :class="{'report__download--active': checkAllStudentsScoresSubmited()}" @click="downloadReport()">
          دانلود کارنامه
        </div>
      </div>
      <template #modal-footer="{ ok }">
        <div style="display: flex; justify-content: space-between;width: 100%;">
          <b-button size="sm" variant="outline-success" @click="ok()">
            بستن
          </b-button>
        </div>
      </template>
    </b-modal>
  </div>
  <Loading v-else :isOverlay="false" />
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Loading from '~/components/common/Loading'
import XLSX from 'xlsx';

export default {
  layout: 'adminLayout',
  data() {
    return {
      isLoading: true,
      currentExamReport : [],
      studentsList: [],
      selectedStudent: [],
      selectedStudentReport: [],
      currentTestID: null,
      isNoOneAttended: false,
      isStudentAttended: true,
      descriptiveScores: [],
      isStudentFinishedExam: false,
    }
  },
  filters: {
    filterDecimals(value) {
      if (!value) return 0;
      let number = null;
      if (Number(value) === value && value % 1 !== 0) {
        let decimalCount = 2;
        return value.toFixed(decimalCount)
      }
      if (Number(value) === value && value % 1 === 0) {
        return value
      }
    },
  },
  computed: {
    ...mapGetters([
      'getAdminCurrentExamReport',
    ]),
    descriptiveScoresSum() {
      let sum = 0;
      this.descriptiveScores.map((item, index) => {
        sum = sum + Number(item);
      })
      return sum;
    },
    totalScore() {
      let descriptiveSum = (this.descriptiveScoresSum);
      let testSum = (this.selectedStudent.testStudent)
      let totalScore = descriptiveSum + testSum;
      return this.roundDecimals(totalScore);
    }
  },
  methods: {
    ...mapActions([
      'totalReport',
      'studentReport',
      'studentSubmitScore',
    ]),
    checkAllStudentsScoresSubmited() {
      let allStudentsScoresSubmited = true;
      this.studentsList.map((item, index) => {
        if (item.value.isFinish && !item.value.isResult) {
          allStudentsScoresSubmited = false;
        }
      })
      console.log("this.studentsList", this.studentsList)
      console.log("allStudentsScoresSubmited", allStudentsScoresSubmited)
      return allStudentsScoresSubmited;
    },
    downloadReport() {
      let isReportReady = this.checkAllStudentsScoresSubmited();
      if (isReportReady) {
        let report = this.studentsList.map((item,index) => {
          return {
            'نام': item.value.name,
            'نام خانوادگی': item.value.family,
            'کد ملی': item.value.nationalCode,
            'وضعیت شرکت در امتحان': item.value.isFinish ? 'حاضر' : 'غایب',
            'نمره تستی': item.value.testStudent.toFixed(2),
            'نمره تشریحی': item.value.resultDescriptive.toFixed(2),
            'نمره کامل': item.value.resultTotal.toFixed(2),
          };
        })
        const data = XLSX.utils.json_to_sheet(report)
        const wb = XLSX.utils.book_new()
        var wscols = [
          {wch:10},
          {wch:11},
          {wch:12},
          {wch:15},
          {wch:8},
          {wch:8},
          {wch:8}
        ];
        data['!cols'] = wscols;
        if (wb.Workbook) {
          wb.Workbook.Views[0]['RTL'] = true;
        } else {
          wb.Workbook = {};
          wb.Workbook['Views'] = [{RTL: true}];
        }
        XLSX.utils.book_append_sheet(wb, data, 'data')
        XLSX.writeFile(wb,'Report.xlsx')
      } else {
        this.$toast.error(
          "برای دریافت کارنامه،لطفا نمرات تمام دانش آموزان را ثبت کنید"
        )
      }
    },
    roundDecimals(value) {
      if (Number(value) === value && value % 1 === 0) {
        return value;
      }
      if (Number(value) === value && value % 1 !== 0) {
        let decimalCount = 2;
        return Number(value.toFixed(decimalCount));
      }
    },
    async submitAndNextStudent() {
      let checkDescriptiveScores = this.selectedStudentReport.descriptiveQuestionsCount ? this.checkDescriptiveScores() : true;
      let checkTotalScore = this.checkTotalScore();
      if(checkDescriptiveScores && checkTotalScore) {
        let params = {
          resultDescriptive: this.descriptiveScoresSum,
          studentID: this.selectedStudent.id,
        }
        let result = await this.studentSubmitScore(params);
        if (result && result.success === true) {
          this.resetInputes();
          this.$toast.success(
            "نمره با موفقیت ثبت شد"
          )
          this.studentsList[this.selectedStudent.index].value.isResult = true;
          this.nextStudent();
          this.checkAllStudentsScoresSubmited();
        }

      }
    },
    nextStudent() {
      let currentIndex = this.selectedStudent.index;
      let lastIndex = this.studentsList.length - 1;
      if(currentIndex < lastIndex) {
        currentIndex++;
        this.selectedStudent = this.studentsList[currentIndex].value;
        this.loadStudentReport();
        this.scrollTo('body');
      } else {
        this.$refs['modal-report'].show();
        // this.selectedStudent = this.studentsList[0].value;
      }
    },
    updateScore() {
      this.$set(this.selectedStudentReport, ['resultDescriptive'], this.descriptiveScoresSum);
      this.$set(this.selectedStudentReport, ['resultTotal'], this.totalScore);
    },
    resetInputes() {
      this.descriptiveScores = this.descriptiveScores.map(item => {
        return [];
      })
    }, 
    checkTotalScore() {
      if(this.totalScore > 20) {
        this.$toast.error(
          "جمع نمرات تستی و تشریحی نباید از ۲۰ بیشتر باشند"
        )
        return false;
      } else {
        return true;
      }
    },
    scrollTo(element) {
      let options = {
        container: 'body',
        easing: 'ease-in-out',
        lazy: false,
        offset: -60,
        force: true,
        cancelable: true,
        onStart: function(element) {
          // scrolling started
        },
        onDone: function(element) {
          // scrolling is done
        },
        onCancel: function() {
          // scrolling has been interrupted
        },
        x: false,
        y: true
      }
          
      // or alternatively inside your components you can use
      this.$scrollTo(element, 300, options)
      
      // to cancel scrolling you can call the returned function
      // cancelScroll()

    },
    checkDescriptive() {
      if (!this.selectedStudentReport.descriptiveQuestionsCount.length) {
        return true;
      }
    },
    checkDescriptiveScores() {
      let counter = 0;
      // if (!this.selectedStudentReport.descriptiveQuestionsCount.length) {
      if (!this.selectedStudentReport.descriptiveQuestions.length) {
        this.studentsList[this.selectedStudent.index].text = this.studentsList[this.selectedStudent.index].value.name + ' ' + this.studentsList[this.selectedStudent.index].value.family + ' (ثبت شده)'
      }

      if (this.descriptiveScores.length !== 0) {
        this.descriptiveScores.map((item, index) => {
          if (item && item !== '') {
            counter++;
          }
        })
        if (counter === this.selectedStudentReport.descriptiveQuestionsCount) {
          return true;
        } else {
        console.log("1")
          this.$toast.error(
            "لطفا برای همه سوال های تشریحی نمره وارد کنید (در صورت اشتباه بودن جواب صفر وارد کنید)"
          )
          return false;
        }
      } else {
        console.log("2")
        this.$toast.error(
          "لطفا برای همه سوال های تشریحی نمره وارد کنید (در صورت اشتباه بودن جواب صفر وارد کنید)"
        )
        return false;
      }
    },
    goToAdmin() {
      this.$router.push('/admin');
    },
    async loadCurrentExamReport(testID) {
      let result = await this.totalReport(testID);
      if (result && result.success === true) {
        this.isLoading = false;
        if(result.data.reports.length) {
          this.isNoOneAttended = false;
          this.currentExamReport = this.getAdminCurrentExamReport;
          this.studentsList = this.currentExamReport.map((item, index) => {
            let isFinish = item.isFinish ? true : false;
            let text = item.name + ' ' + item.family;
            if (item.isResult) {
              text = item.name + ' ' + item.family + ' (ثبت شده)';
            }
            if (!item.isFinish) {
              text = item.name + ' ' + item.family + ' (غایب)';
            }
            return {
              text: text,
              value: {
                isFinish: item.isFinish,
                isResult: item.isResult,
                nationalCode: item.nationalCode,
                resultDescriptive: item.resultDescriptive,
                resultTotal: item.resultTotal,
                testStudent: item.testStudent,
                studentID: item.studentID,
                id: item.id,
                name: item.name,
                family: item.family,
                index: index,
              },
              // disabled: isFinish,
            }
          });
          this.selectedStudent = this.studentsList[0].value;
          this.loadStudentReport();
        } else {
          this.isNoOneAttended = true;
        }
      } else {
        this.isLoading = true;
      }
    },
    async loadStudentReport() {
      let params = {
        testID: this.currentTestID,
        studentID: this.selectedStudent.id,
      }
      let result = await this.studentReport(params);
      if (result && result.success === true) {
        if (result.data.report.isFinish) {
          this.isStudentAttended = true;
          this.$set(this.selectedStudentReport, 'testQuestions', []);
          this.$set(this.selectedStudentReport, 'descriptiveQuestions', []);
          let testQuestionsCounter = 0;
          result.data.report.answer.map((item, index) => {
            if (item.type === 'test') {
              item.options.map((item2, index2) => {
                item2.isCorrect = false;
                item2.isStudentAnswer = false;
              })

              if (item.answerCheck === true) {
                item.options[item.answer - 1].isCorrect = true;
              }
              if (item.answerStudent) {
                item.options[item.answerStudent - 1].isStudentAnswer = true;
              }


              this.selectedStudentReport.testQuestions.push(item);
              if (item.answerCheck) {
                testQuestionsCounter++;
              }
            }
            if (item.type === 'descriptive') {
              this.selectedStudentReport.descriptiveQuestions.push(item);
            }
          })
          this.selectedStudentReport.testQuestionsCount = this.selectedStudentReport.testQuestions.length;
          this.selectedStudentReport.testQuestionsCorrectCount = testQuestionsCounter;
          this.selectedStudentReport.descriptiveQuestionsCount = this.selectedStudentReport.descriptiveQuestions.length;
          this.selectedStudentReport.fileStudent = result.data.report.fileStudent;
          this.selectedStudentReport.id = result.data.report.id;
          this.selectedStudentReport.isFinish = result.data.report.isFinish;
          this.selectedStudentReport.isResult = result.data.report.isResult;
          this.selectedStudentReport.resultDescriptive = result.data.report.resultDescriptive;
          this.selectedStudentReport.resultTotal = result.data.report.resultTotal;
          this.selectedStudentReport.testStudent = result.data.report.testStudent;
        } else {
          this.isStudentAttended = false;
          this.$set(this, 'selectedStudentReport', []);
        }

        // this.selectedStudentReport.id = result.data.report.id;
        // this.selectedStudentReport.isFinish = result.data.report.isFinish;
        // this.selectedStudentReport.isResult = result.data.report.isResult;
        // this.selectedStudentReport.resultDescriptive = result.data.report.resultDescriptive;
        // this.selectedStudentReport.resultTotal = result.data.report.resultTotal;
        // this.selectedStudentReport.testStudent = result.data.report.testStudent;
        // console.log("this.selectedStudentReport: ", this.selectedStudentReport);
        return true;
      } else {
        return false;
      }
    },

  },
  async mounted() {
    this.currentTestID = this.$route.query.testID;
    this.loadCurrentExamReport(this.currentTestID);
  }
}
</script>

<style lang="scss" scoped>

  .report {

    &__wrapper {
      background: #fff;
      border-radius: 4px;
      width: 100%;
      box-shadow: 0 1px 6px 0 rgba(32, 33, 36, 0.14);
      padding: 24px;
      margin-bottom: 32px;
    }

    &__title {
      display: flex;
      margin-bottom: 32px;
      font-weight: bold;
    }

    &__download {
      width: 100%;
      margin-top: 16px;
      text-align: center;
      border-radius: 0.2rem;
      padding: 6px 12px;
      transition: all 0.2s;
      position: relative;
      cursor: default;
      opacity: 0.3;
      background-color: #ccc;
      color: #000;

      &-wrapper {
        width: 100%;
      }

      &:hover {
        background-color: #ccc;
      }
      
      &:active {
        background-color: #ccc;
        box-shadow: none;
      }

      &--active {
        cursor: pointer;
        background-color: #BC11FD;
        color: #fff;
        opacity: 1;

        &:hover {
          background-color: darken(#BC11FD, 5%);
        }
        
        &:active {
          background-color: darken(#BC11FD, 8%);
          box-shadow: 0 0 0 0.2rem rgba(188, 17, 253, 0.3);
        }
      }
    }

    &__course {
      margin-right: 4px;
    }

    &__student {

      &-wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        // margin-bottom: 104px;
      }

      &-label {
        margin-left: 8px;
        margin-bottom: 4px;
        min-width: 100px;
      }

      &-name {
        width: 100%;
      }

    }

    &__test {
      margin-bottom: 48px;

      &-title {
        text-align: right;
        font-size: 28px;
        margin-bottom: 32px;
        margin-top: 104px;
        font-weight: bold;
      }

      &-wrapper {
        text-align: right;
      }

      &-question {
        padding: 8px 16px;

        &-title {
          margin-bottom: 24px;
        }

        &-wrapper {

        }

        &-text {
          opacity: 0.7;
        }

        &--answer {
            border: 1px solid #fdbc11;
            border-radius: 4px;
        }

        &--correct {
            border: 1px solid #218838;
            border-radius: 4px;
        }

        &--incorrect {
            border: 1px solid #ff2e2e;
            border-radius: 4px;
        }

        &-option {
          padding: 4px 0px;
        }
      }

    }

    &__descriptive {
      margin-bottom: 48px;

      &-title {
        text-align: right;
        font-size: 28px;
        margin-bottom: 32px;
        font-weight: bold;
      }

      &-wrapper {
        text-align: right;
      }

      &-question {
        padding-right: 24px;
        padding-bottom: 12px;
        display: flex;
        flex-direction: column;

        &-title {
          margin-bottom: 4px;
        }

        &-wrapper {

        }

        &-answer {
          opacity: 0.7;
          margin-top: 4px;
        }

        &-score {
          padding-right: 24px;
          display: flex;
          align-items: flex-start;
          flex-direction: column;
        }

        &-input {
          // width: 70px;
          margin-top: 8px;

          &--danger {
            border: 2px solid #ffbaba;
          }

          &--success {
            border: 2px solid rgba(15, 134, 0, 0.4);
          }
        }
      }
    }

    &__results {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      border-top: 1px solid #ececec;
      margin-bottom: 16px;
      // padding-top: 16px;

      &-testCount {
        display: flex;
        justify-content: space-between;
        width: 100%;
        // max-width: 300px;
        border-bottom: 1px solid#ececec;
        padding-bottom: 12px;
        padding-top: 12px;


        &-label {
          color: #ababab;
        }

        &-value {
          color: #616161;
          font-weight: bold;
          display: flex;
          width: 56px;
          justify-content: space-between;
        }
      }

      &-testScore {
        display: flex;
        justify-content: space-between;
        width: 100%;
        // max-width: 300px;
        border-bottom: 1px solid#ececec;
        padding-bottom: 12px;
        padding-top: 12px;


        &-label {
          color: #ababab;
        }

        &-value {
          color: #616161;
          font-weight: bold;
        }
      }

      &-descriptiveCount {
        display: flex;
        justify-content: space-between;
        width: 100%;
        // max-width: 300px;
        border-bottom: 1px solid#ececec;
        padding-bottom: 12px;
        padding-top: 12px;


        &-label {
          color: #ababab;
        }

        &-value {
          color: #616161;
          font-weight: bold;
        }
      }

      &-descriptiveScore {
        display: flex;
        justify-content: space-between;
        width: 100%;
        // max-width: 300px;
        border-bottom: 1px solid#ececec;
        padding-bottom: 12px;
        padding-top: 12px;


        &-label {
          color: #ababab;
        }

        &-value {
          color: #616161;
          font-weight: bold;
        }
      }

      &-totalScore {
        display: flex;
        justify-content: space-between;
        width: 100%;
        // max-width: 300px;
        border-bottom: 1px solid#ececec;
        padding-bottom: 12px;
        padding-top: 12px;


        &-label {
          color: #ababab;
        }

        &-value {
          color: #616161;
          font-weight: bold;
        }
      }

      &-buttons {
        display: flex;
        justify-content: flex-start;
      }

      &-attachments {
        max-width: 100%;

        &-wrapper {
          width: 100%;
          margin-bottom: 32px;
        }

        &-title {
          margin-bottom: 16px;
          font-weight: bold;
          text-align: center;
        }
      }

    }



  }


  // Medium devices (tablets, 768px and up)
  @media (min-width: 767.98px) {
    .report {
      &__download {
        min-width: 110px;
        width: 110px;
        margin-right: 16px;
        margin-top: 0px;

        &-wrapper {
          min-width: 110px;
          width: 110px;
        }
      }
    }
  }
  
  // large devices (laptops, 768px and up)
  @media (min-width: 991.98px) {
    .report {
      &__student {
        &-wrapper {
          flex-direction: row;
          align-items: center;
        }
      }
    }
  }

  // extra large devices (desktops, 768px and up)
  @media (min-width: 1199.98px) {

  }
</style>
