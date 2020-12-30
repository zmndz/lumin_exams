<template>
  <div v-if="!isLoading" class="report__wrapper">
    <div v-if="!isNoOneAttended">
      <div class="row">
        <div class="col-12 col-md-6">
          <div class="report__title">
            آزمون 
            <div class="report__course">
              اصول حسابداری
            </div>
          </div>
          <div class="report__student-wrapper">
            <div class="report__student-label">
              انتخاب دانشجو: 
            </div>
            <div class="report__student-name">
              <b-form-select v-model="selectedStudent" :options="studentsList" @change="loadStudentReport"></b-form-select>
            </div>
            <!-- {{selectedStudent}} -->
          </div>
        </div>
      </div>
      <div v-if="isStudentAttended" class="row">
        <div class="col-12 col-md-6">
          <div class="text-right mb-3 font-weight-bold">سوال‌های چهار گزینه ای</div>
          <div class="report__test-wrapper">
            <div v-for="(question, index) in selectedStudentReport.testQuestions" :key="index" class="report__test">
              <div class="report__test-question-title" v-html="question.index + '- ' + question.question">
              </div>
              <div class="report__test-question-wrapper">
                <div class="report__test-question-option">
                  الف) {{question.optionA}}
                </div>
                <div class="report__test-question-option">
                  ب) {{question.optionB}}
                </div>
                <div class="report__test-question-option">
                  ج) {{question.optionC}}
                </div>
                <div class="report__test-question-option">
                  د) {{question.optionD}}
                </div>
                <!-- <div v-for="(option, index2) in question.options" :key="index2" class="report__test-question">
                  <span>
                    {{index2 + 1 + ') ' + option.text}}
                  </span>
                  {{option}}
                </div> -->
              </div>
            </div>
          </div>

          <div class="text-right mb-3 font-weight-bold">سوال‌های تشریحی</div>
          <div class="report__descriptive-wrapper">
            <div v-for="(question, index) in selectedStudentReport.descriptiveQuestions" :key="index" class="report__descriptive">
              <div class="report__descriptive-question-title" v-html="question.index + '- ' + question.question">
              </div>
              <div class="report__descriptive-question-wrapper">
                <div class="row">
                  <div class="col-12">
                    <div class="report__descriptive-question-answer">
                      پاسخ دانشجو: {{question.answerStudent}}
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
              </div>
              <div class="report__results-descriptiveScore-value">
                <span v-if="descriptiveScores.lenght !== 0">
                  {{descriptiveScoresSum | filterDecimals}}
                </span>
              </div>
            </div>
            <div class="report__results-totalScore">
              <div class="report__results-totalScore-label">
                جمع نمرات تستی و تشریحی:
              </div>
              <div class="report__results-totalScore-value" :class="{'text-danger' : totalScore > 20}">
                {{totalScore}}
                <!-- {{(descriptiveScoresSum + selectedStudent.testStudent) | filterDecimals}} -->
              </div>
            </div>
          </div>
        </div>
        <div v-if="selectedStudentReport.fileStudent" class="col-12 col-md-6">
          <div class="report__results-attachments-title">
            فایل های ضمیمه شده توسط دانشجو
          </div>
          <div class="report__results-attachments-wrapper">
            <img :src="selectedStudentReport.fileStudent" class="report__results-attachments" alt=""> 
          </div>
        </div>
      </div>
      <div v-else class="text-right mb-5">
        این دانشجو در آزمون شرکت نکرده
      </div>
      <div class="row">
        <div class="col-12">
          <div class="report__results-buttons">
            <b-button v-if="isStudentAttended" size="sm" variant="success" class="ml-3" @click="submitAndNext">
              ثبت نمره و بررسی دانشجو بعدی
            </b-button>
            <b-button v-else size="sm" variant="success" class="ml-3">
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
        هیچ کس درآزمون شرکت نکرده است
      </div>
      <b-button size="sm" variant="light" @click="goToAdmin">
        بازگشت
      </b-button>
    </div>
  </div>
  <Loading v-else/>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Loading from '~/components/common/Loading'

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
    ]),
    roundDecimals(value) {
      if (Number(value) === value && value % 1 === 0) {
        return value;
      }
      if (Number(value) === value && value % 1 !== 0) {
        let decimalCount = 2;
        return Number(value.toFixed(decimalCount));
      }
    },
    submitAndNext() {
      console.log("submit: ", this.checkDescriptiveScores());
      console.log("checkTotalScore: ", this.checkTotalScore());
      // this.$toast.success(
      //   "لطفا برای همه سوال های تشریحی نمره وارد کنید"
      // )
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
    checkDescriptiveScores() {
      let counter = 0;
      if (this.descriptiveScores.length !== 0) {
        this.descriptiveScores.map((item, index) => {
          if (item && item !== '') {
            counter++;
          }
        })
        if (counter === this.selectedStudentReport.descriptiveQuestionsCount) {
          return true;
        } else {
          this.$toast.error(
            "لطفا برای همه سوال های تشریحی نمره وارد کنید (در صورت اشتباه بودن جواب صفر وارد کنید)"
          )
          return false;
        }
      } else {
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
            return {
              text: item.name + ' ' + item.family,
              value: {
                isFinish: item.isFinish,
                isResult: item.isResult,
                nationalCode: item.nationalCode,
                resultDescriptive: item.resultDescriptive,
                resultTotal: item.resultTotal,
                testStudent: item.testStudent,
                studentID: item.studentID,
                id: item.id,
              },
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

        if (result.data.report.isResult) {
          this.isStudentAttended = true;
          this.selectedStudentReport.testQuestions = [];
          this.selectedStudentReport.descriptiveQuestions = [];
          let testQuestionsCounter = 0;
          result.data.report.answer.map((item, index) => {
            if (item.type === 'test') {
              this.selectedStudentReport.testQuestions.push(item);
              if (item.answer == item.answerStudent) {
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
        } else {
          this.isStudentAttended = false;
        }

        // this.selectedStudentReport.id = result.data.report.id;
        // this.selectedStudentReport.isFinish = result.data.report.isFinish;
        // this.selectedStudentReport.isResult = result.data.report.isResult;
        // this.selectedStudentReport.resultDescriptive = result.data.report.resultDescriptive;
        // this.selectedStudentReport.resultTotal = result.data.report.resultTotal;
        // this.selectedStudentReport.testStudent = result.data.report.testStudent;
        // console.log("this.selectedStudentReport: ", this.selectedStudentReport);
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
      margin-bottom: 16px;
      font-weight: bold;
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
        margin-bottom: 32px;
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
      margin-bottom: 24px;

      &-wrapper {
        text-align: right;
      }

      &-question {

        &-title {
          margin-bottom: 4px;
        }

        &-wrapper {

        }

        &-option {
          padding: 4px 0px;
        }
      }

    }

    &__descriptive {
      margin-bottom: 32px;

      &-wrapper {
        text-align: right;
      }

      &-question {

        &-title {
          margin-bottom: 4px;
        }

        &-wrapper {

        }

        &-answer {
          padding: 8px 16px;
          opacity: 0.8;
        }

        &-score {
          padding: 0px 16px;
          display: flex;
          align-items: center;
        }

        &-input {
          // width: 70px;
          margin-right: 8px;

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
