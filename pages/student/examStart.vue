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
              <div class="exam__questions-left-value">
                <!-- {{currentExam.noneAnsweredQuestions}} -->
                {{noneAnswered}}
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
        <div v-for="(question, index) in currentExam.questions" class="exam__question" :key="index">
          <div class="exam__title" v-html="(index + 1) + '- ' + question.title">
            <!-- {{index+1}}- {{question.title}} -->
          </div>
          <div class="exam__options-wrapper">
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
        </div>
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
        <b-button variant="outline-dangerd" @click="closeConfirm">خیر، ادامه می دهم</b-button>
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
      'setIsExamStarted',
      'submitExam',
    ]),
    openConfirm() {
      this.$refs['modal-confirm'].show();
    },
    closeConfirm() {
      this.$refs['modal-confirm'].hide();
    },
    submitQuestions() {
      let submited = this.currentExam.questions.map((item, index) => {
        return {questionID: item.id, answer: item.selected}
      })
      let readyData = {
        testID: this.currentExam.testID,
        answerStudent: JSON.stringify({
          testId: this.currentExam.testID,
          answers:[
            ...submited
          ],          
        })
      }
      console.log(readyData)
      let result = this.submitExam(readyData);
      if(result) {
        this.$router.push('/student');
        this.$toast.success(
          "آزمون با موفقیت به پایان رسید"
        )
      }
    },
    selectOption(index, selected) {
      console.log(index, selected)
      this.questions[index].selected = selected;
    },
    saveAnswers() {
      let length = this.currentExam.questions.length;
      let count = 0;
      this.currentExam.questions.map((item, index) => {
        if (item.selected) {
          count++;
        } else {

        }
      })
      this.noneAnswered = length - count;
      this.updateCurrentExam(this.currentExam);
    },
    initiateTimer() {
      let start = moment(this.currentExam.startTime, "HH:mm:ss a");
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
  mounted() {
    this.currentExam = this.getCurrentExam;
    this.noneAnswered = this.currentExam.noneAnsweredQuestions
    this.initiateTimer();
    this.setIsExamStarted({data: true});
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

      &-label {
        margin-left: 4px;
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
      margin-bottom: 32px;
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
