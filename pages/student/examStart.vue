<template>
  <div class="exam__wrapper">
    <div class="exam">
      <div class="exam__header">
        <div class="row no-gutters w-100" >
          <div class="col-12 col-md-6 col-lg-4">
            <div class="exam__name">
              <div class="exam__name-label">
                آزمون درس:
              </div>
              <div class="exam__name-value">
                {{currentExam.lessonTitle}}
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-4">
            <div class="exam__timer">
              <div class="exam__timer-label">
                زمان تا پایان آزمون:
              </div>
              <div v-if="hours && minutes && seconds" class="exam__timer-value">
                <!-- {{examTimeCounter}} -->
                {{hours}}:{{minutes}}:{{seconds}}
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-4">
            <div class="exam__questions-left">
              <div class="exam__questions-left-label">
                سوالات بدون پاسخ:
              </div>
              <div v-if="noneAnsweredList.length" v-scroll-to="'#js-exam__question-' + noneAnsweredList[0].id" class="exam__questions-left-value">
                {{noneAnswered}}
              </div>
              <div v-else class="exam__questions-left-value">
                0
              </div>
            </div>
          </div>
          <!-- <div class="col-12 col-md-6 col-lg-2">
            <div class="exam__marked">
              <div class="exam__marked-label">
                سوالات نشان شده:
              </div>
              <div class="exam__marked-value">
                0
              </div>
            </div>
          </div> -->
        </div>
      </div>
      <div class="exam__list">
        <div v-for="(question, index) in currentExam.questions" class="exam__question" :id="'js-exam__question-' + question.id" :key="index">
          <div class="exam__title" v-html="(index + 1) + '- ' + question.title">
            <!-- {{index+1}}- {{question.title}} -->
          </div>
          <div v-if="question.type === 'test'" class="exam__options-wrapper">
            <b-form-group :name="'form-group-' + index" label="">
              <b-form-radio-group
                v-model="question.selected"
                :name="'radio-group-' + index"
                stacked
                @input="saveAnswers"
              >
                <template v-for="(option, index2) in question.options">
                  <b-form-radio :key="option.value + index2" :value="option.value">
                    <span v-html="option.text" style="display:flex; align-items:center;"></span>
                  </b-form-radio>
                </template>
              </b-form-radio-group>
            </b-form-group>
          </div>
          <div v-if="question.type === 'descriptive'" class="exam__options-wrapper">
            <b-row class="mt-2">
              <b-col xs="12" md="8">
                <b-form-textarea
                  id="textarea-default"
                  v-model="question.selected"
                  rows="3"
                  max-rows="8"
                  @input="saveAnswers"
                  placeholder=""
                ></b-form-textarea>
              </b-col>
            </b-row>
          </div>
        </div>

        <b-row v-if="isThereDescriptive" class="mt-2">
          <b-col xs="12" md="4">
            <div class="exam__questions-upload-wrapper">
              <b-form-file
                id="js-examQuestionsFile"
                class="exam__questions-upload"
                plain
                accept="image/jpeg, image/png, image/gif"
                multiple
                @change="setFile($event)"
              >
              </b-form-file>

              <div v-if="!questionFile.length" class="exam__questions-upload-trigger" @click="openUploadDialog">
                <span class="exam__questions-upload-icon">+</span> آپلود فایل های ضمیمه
              </div>
              <div v-else>
                <div v-for="(file, index) in questionFile" :key="index" class="exam__questions-upload-file">
                  <div class="exam__questions-upload-file-name">
                    {{ file ? file.name : '' }}
                  </div>
                  <div class="exam__questions-upload-file-remove" @click="removeFile(index)">
                    x
                  </div>
                </div>
              </div>
            </div>
          </b-col>
        </b-row>


      </div>
      <div class="exam__submit">
        <b-button block variant="success" @click="openConfirm">پایان آزمون</b-button>
      </div>
    </div>

    <b-modal ref="modal-confirm" id="modal-confirm" title="BootstrapVue" hide-footer hide-header centered>
      <div style="text-align:center; margin: 20px 0 30px 0;">
        <div v-if="noneAnswered">
          {{noneAnswered}} سوال بدون پاسخ باقی مانده است. آیا از پایان آزمون مطمئن هستید؟
        </div>
        <div v-else>
          آیا از پایان آزمون مطمئن هستید؟
        </div>
      </div>
      <div style="text-align:center;">
        <b-button variant="success" @click="submitQuestions">بله، مطمئن هستم</b-button>
        <b-button v-if="noneAnswered" variant="outline-dangerd" @click="closeConfirm" v-scroll-to="'#js-exam__question-' + noneAnsweredList[0].id">خیر، ادامه می دهم</b-button>
        <b-button v-else variant="outline-dangerd" @click="closeConfirm">خیر، ادامه می دهم</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import moment from 'moment';

export default {
  layout: 'studentLayout',
  components: {
  },
  data() {
    return {
      currentExam: [],
      hours: null,
      minutes: null,
      seconds: null,
      noneAnswered: null,
      noneAnsweredList: [],
      isThereDescriptive: false,
      questionFile: [],
    }
  },
  computed: {
    ...mapGetters([
      'getCurrentExam',
    ]),

  },
  methods: {
    ...mapActions([
      'loadAllStudentData',
      'updateCurrentExam',
      'loadCurrentExam',
      'submitExam',
    ]),
    async setFile(event) {
      let file = Object.values(event.target.files);
      this.questionFile = file;
    },
    async removeFile(index) {
      this.questionFile.splice(index, 1);
    },
    openUploadDialog() {
    let uploader = document.getElementById('js-examQuestionsFile');
    uploader.click();
    },
    openConfirm() {
      this.$refs['modal-confirm'].show();
    },
    closeConfirm() {
      this.$refs['modal-confirm'].hide();
    },
    async submitQuestions() {
      let submited = this.currentExam.questions.map((item, index) => {
        return {questionID: item.id, type: item.type, answer: item.selected}
      })
      let readyData = {
        testID: this.currentExam.testID,
        answerStudent: JSON.stringify({
          testId: this.currentExam.testID,
          answers:[
            ...submited
          ],
        }),
        answerFiles: this.questionFile,
      }
      let result = await this.submitExam(readyData);
      if(result) {
        // this.updateCurrentExam('');
        this.$router.push('/student');
        this.$toast.success(
          "آزمون با موفقیت به پایان رسید"
        )
      }
    },
    selectOption(index, selected) {
      this.questions[index].selected = selected;
    },
    saveAnswers() {
      let length = this.currentExam.questions.length;
      this.noneAnsweredList.length = 0;
      let count = 0;
      this.currentExam.questions.map((item, index) => {
        if (item.selected) {
          count++;
        } else {
          this.noneAnsweredList.push(item)
        }
      })
      this.noneAnswered = length - count;
      this.currentExam.noneAnsweredCount = this.noneAnswered;
      this.currentExam.noneAnsweredList = this.noneAnsweredList;
      this.updateCurrentExam({testID: this.currentExam.testID, data: this.currentExam});
    },
    initiateTimer() {
      let currentTime = moment().format("HH:mm:ss")
      let start = moment(currentTime, "HH:mm:ss a");
      let end = moment(this.currentExam.endTime, "HH:mm:ss a");
      let duration = moment.duration(end.diff(start));
      let milliseconds = parseInt(duration.asMilliseconds());
      const self = this;
      let counter = 0;
      let countdown = setInterval(function(){
        function convertMS( milliseconds ) {
          let hour, minute, seconds;
          seconds = Math.floor(milliseconds / 1000);
          minute = Math.floor(seconds / 60);
          seconds = seconds % 60;
          hour = Math.floor(minute / 60);
          minute = minute % 60;
          hour = hour % 24;

          return {
            hour: hour,
            minute: minute,
            second: seconds,
          }
        }
        let result = convertMS(milliseconds - counter);
        let hours = result.hour < 10 ? `0${result.hour}` : `${result.hour}`;
        let minutes = result.minute < 10 ? `0${result.minute}` : `${result.minute}`;
        let seconds = result.second < 10 ? `0${result.second}` : result.second;
        self.hours = hours;
        self.minutes = minutes;
        self.seconds = seconds;
        if (hours <= 0 && minutes <= 0 && seconds <= 0 ) {
          clearInterval(countdown);
        }
        counter = counter + 1000;
      }, 1000)
    },
  },
  async mounted() {
    let routeQueryString = this.$route.query.testID;
    this.currentExam = await this.loadCurrentExam(routeQueryString);
    if(this.currentExam) {
      this.currentExam.questions.map((item, index) => {
        if (item.type === 'descriptive') {
          this.isThereDescriptive = true;
          return true;
        } else {
          this.isThereDescriptive = false;
          return false;
        }
      })
    }
    this.noneAnswered = this.currentExam.noneAnsweredCount;
    this.noneAnsweredList = this.currentExam.noneAnsweredList;
    this.initiateTimer();
    this.updateCurrentExam({testID: this.currentExam.testID, data: this.currentExam});
  },
  async created() {
    this.loadAllStudentData();
  },
}
</script>

<style lang="scss" scoped>
  .exam {

    &__header {
      display: flex;
      margin-bottom: 24px;
      padding: 15px;
      background: #fff;
      border-radius: 10px;
      box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
      width: 100%;
      justify-content: space-between;
      flex-wrap: wrap;
    }

    &__title {
      margin-bottom: 8px;
    }

    &__name {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;

      &-label {
        margin-left: 4px;
      }
    }

    &__timer {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;

      &-label {
        margin-left: 4px;
      }
    }

    &__questions-left {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
      cursor: pointer;

      &-label {
        margin-left: 4px;
      }

      &-value {
        background-color: #BC11FD;
        color: #fff;
        padding: 4px 8px 0px 8px;
        line-height: 24px;
        border-radius: 4px;
      }
    }

    &__marked {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;

      &-label {
        margin-left: 4px;
      }
    }

    &__list {
      display: flex;
      flex-direction: column;
      margin-bottom: 24px;
      padding: 15px;
      background: #fff;
      border-radius: 10px;
      box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
      width: 100%;
      text-align: right;
    }

    &__question {
      padding-top: 16px;
      padding-bottom: 16px;
    }

    &__questions-upload {
      display: none;

      &-wrapper {
        display: flex;
        justify-content: flex-end;
        flex-direction: column;
        font-size: 12px;
      }

      &-trigger {
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px dashed #fdbc11;
        padding: 6px;
        border-radius: 4px;
        height: 44px;
        line-height: 34px;
        cursor: pointer;
        width: 100%;
        color: #fdbc11;
        font-weight: bold;
        transition: all 0.2s;
        margin-top: 8px;

        &:hover {
          background-color: #fdbc11;
          color: #fff;
        }

        &:active {
          border: 1px solid #fdbc11 !important;
          background-color: darken(#fdbc11, 5%);
          color: #fff;
        }
      }

      &-icon {
        font-size: 24px;
        height: 18px;
        width: 18px;
        line-height: 24px;
        margin-left: 6px;
      }

      &-file {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        text-align: right;
        cursor: pointer;
        margin: 8px 0;
        border-radius: 4px;
        transition: all 0.2s;
        background-color: #f5f5f5;

        &:hover {
          background-color: darken(#f5f5f5, 3%);
        }

        &-name {
          padding: 6px;
          width: 100%;
          display: flex;
          align-items: center;
          color: #1890ff;

          &:focus {
            outline: none;
          }
        }

        &-remove {
          font-size: 16px;
          height: 32px;
          width: 32px;
          line-height: 36px;
          text-align: center;
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
          transition: all 0.2s;

          &:hover {
            background-color: #dcdcdc;
          }
        }
      }

      &-expired {
        padding: 11px 12px;
        font-size: 14px;
        border-radius: 5px;
        margin: 4px;
        background-color: #f5f4f4;
        color: #afabab;
        text-align: center;
      }
    }

    &__submit {
      margin-bottom: 56px;
    }
  }

  // Medium devices (tablets, 768px and up)
  @media (min-width: 767.98px) {
    .exam {
      &__name {
        justify-content: flex-start;
      }

      &__timer {
        justify-content: flex-start;
      }

      &__questions-left {
        justify-content: flex-start;
      }

      &__marked {
        justify-content: flex-start;
      }
    }
  }

  // large devices (laptops, 768px and up)
  @media (min-width: 991.98px) {
    .exam {

    }
  }

  // extra large devices (desktops, 768px and up)
  @media (min-width: 1199.98px) {
    .exam {

    }
  }
</style>
