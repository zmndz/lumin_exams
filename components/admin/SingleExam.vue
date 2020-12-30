<template>
  <div v-if="isExamListEmpty" class="">

    <div class="exams__list">
      <div class="exams__single-wrapper" v-for="(exam, index) in examList" :key="index">
        <div class="exams__single">
          <div class="exams__image-wrapper">
            <img class="exams__image" :class="{'exams__image--expired' : exam.isExpire}" src="~/assets/images/books/book_placeholder.svg" alt="">
          </div>
          <div class="exams__details-wrapper">
            <div class="exams__details">
              <div class="exams__title-wrapper">
                <div class="exams__title-label">
                  آزمون:
                </div>
                <div class="exams__title-value">
                  {{exam.lessonTitle}}
                </div>
              </div>
              <div class="exams__code-wrapper">
                <div class="exams__code-label">
                  کد آزمون:
                </div>
                <div class="exams__code-value">
                  {{exam.testCode}}
                </div>
              </div>
              <div class="exams__date-wrapper">
                <div class="exams__date-label">
                  تاریخ آزمون:
                </div>
                <div class="exams__date-value">
                  {{exam.date}}
                </div>
              </div>
              <div class="exams__time-wrapper">
                <div class="exams__time-label">
                  ساعت آزمون:
                </div>
                <div class="exams__time-value">
                  {{exam.startTime}} تا {{exam.endTime}}
                </div>
              </div>
            </div>
            <div :key="index" class="exams__questions-upload-wrapper">
              <b-form-file
                :id="'js-examQuestionsFile-' + index"
                class="exams__questions-upload"
                plain accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,application/pdf"
                v-model="questionFile[index]"
                @change="setFile($event, index, exam)"
              >
              </b-form-file>
              <!-- <b-button v-if="exam.isExpire" variant="outline-secondary" @click="openReport(exam.testID)"> -->
              <b-button v-if="exam.isExpire" variant="outline-secondary" @click="goToReport(exam.testID)">
                مشاهده نتایج
              </b-button>

              <div v-else>
                <div v-if="!exam.isActive" class="exams__questions-upload-trigger" @click="openUploadDialog('js-examQuestionsFile-' + index, index)">
                  <span class="exams__questions-upload-icon">+</span> آپلود سوالات
                </div>
                <div v-else>
                  <div v-if="exam.isPdf" class="exams__questions-upload-file">
                    <div
                      class="exams__questions-upload-file-name"
                      @click="setCurrentExamPreviewPdf({url: exam.pdfUrl, nameFile: exam.nameFile, testID: exam.testID, exam: exam}, true, true)"
                    >
                      مشاهده سوالات: {{ exam ? exam.nameFile : '' }}
                    </div>
                    <div class="exams__questions-upload-file-remove" @click="removeFile(index, exam.testID)">
                      x
                    </div>
                  </div>
                  <div v-else class="exams__questions-upload-file">
                    <div
                      class="exams__questions-upload-file-name"
                      @click="setCurrentExamPreview({questions: exam.questions, lessonTitle: exam.lessonTitle}, true, true)"
                    >
                      مشاهده سوالات: {{ exam ? exam.nameFile : '' }}
                    </div>
                    <div class="exams__questions-upload-file-remove" @click="removeFile(index, exam.testID)">
                      x
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <b-modal v-if="currentExamReport" ref="modal-total-report" id="modal-total-report" centered>
        <template #modal-header="{ close }">
          <div style="display: flex; justify-content: space-between;width: 100%;">
            <!-- <div>
              سوالات آزمون <strong>{{currentExamReport.lessonTitle}}</strong>
            </div> -->
            <div @click="close()" style="cursor: pointer;">X</div>
          </div>
        </template>
        <div class="exams__report">
          <div class="exams__report-header exams__report-row">
            ردیف
          </div>
          <div class="exams__report-header exams__report-name">
            نام و نام‌خانوادگی
          </div>
          <div class="exams__report-header exams__report-national-code">
            کد ملی
          </div>
          <!-- <div class="exams__report-header exams__report-student-id">
            شماره دانشجویی
          </div> -->
        </div>
        <div v-for="(report, index) in currentExamReport" :key="index" class="exams__report-content" @click="goToReport(report)">
          <div class="exams__report-cell exams__report-row">
            {{index+1}}
          </div>
          <div class="exams__report-cell exams__report-name">
            {{report.name}} {{report.family}}
          </div>
          <div class="exams__report-cell exams__report-national-code">
            {{report.nationalCode}}
          </div>
          <!-- <div class="exams__report-cell exams__report-student-id">
            {{report.studentID}}
          </div> -->
        </div>
        <template #modal-footer="{ ok }">
          <div style="display: flex; justify-content: space-between;width: 100%;">
            <b-button variant="success" @click="ok()">
              بستن
            </b-button>
            <!-- <b-button size="sm" variant="outline-danger" @click="removeFile()">
              حذف سوالات
            </b-button> -->
          </div>
        </template>
      </b-modal>

      <b-modal v-if="currentExamPreviewPdf" size="xl" ref="modal-questions-preview-pdf" id="modal-questions-preview-pdf" no-close-on-backdrop centered>
        <template #modal-header="{}">
          <div class="exams__modal-preview">
            <div>
              فایل: <strong>{{currentExamPreviewPdf.lessonTitle}}</strong>
            </div>
          </div>
        </template>
        <div class="exams__modal-pdf">
          <div class="row">
            <div v-if="!isPdfExist" class="col-12 col-md-4 border-left">
              <div class="row">
                <div class="col-12">
                  <b-form-group
                    id="fieldset-1"
                    label="تعداد سوالات تشریحی"
                    label-for="input-descriptive-count"
                  >
                    <b-form-input
                      required
                      id="input-descriptive-count"
                      type="number"
                      :state="pdfFormValidation(pdfQuestions.descriptiveCount)"
                      aria-describedby="input-descriptive-count-feedback"
                      v-model="pdfQuestions.descriptiveCount"
                    >
                    </b-form-input>
                  </b-form-group>
                </div>
                <div class="col-12">
                  <b-form-group
                    id="fieldset-1"
                    label="جمع نمره سوالات تشریحی"
                    label-for="input-descriptive-barom"
                  >
                    <b-form-input
                      required
                      id="input-descriptive-barom"
                      type="number"
                      :state="pdfFormValidation(pdfQuestions.descriptiveBarom)"
                      aria-describedby="input-descriptive-barom-feedback"
                      v-model="pdfQuestions.descriptiveBarom"
                    >
                    </b-form-input>
                  </b-form-group>
                </div>
                <div class="col-12">
                  <b-form-group
                    id="fieldset-1"
                    label="تعداد سوالات تستی"
                    label-for="input-test-count"
                  >
                    <b-form-input
                      required
                      id="input-test-count"
                      class="exams__modal-input"
                      :state="pdfFormValidation(pdfQuestions.testCount)"
                      aria-describedby="input-test-count-feedback"
                      v-model="pdfQuestions.testCount"
                      @input="setTestQuestionCount"
                    >
                    </b-form-input>
                    <div v-for="(item, index) in pdfQuestions.testQuestions" :key="'radio-group-'+index">
                      <b-form-group :name="'form-group-' + index" label="">
                        <div :id="'exams__modal-option-group-' + index" class="exams__modal-option-group" :class="{'exams__modal-option-valid' : item.selected}">
                          <span style="margin-left: 16px;">
                            {{index+1}}-
                          </span>
                          <b-form-radio-group
                            v-model="item.selected"
                            :name="'radio-group-' + index"
                            stacked
                            class="exams__modal-option-wrapper"
                          >
                            <template v-for="(option, index2) in item.options">
                              <b-form-radio :key="option.value + index2" :value="option.value">
                                <span v-html="option.text" class="exams__modal-option"></span>
                              </b-form-radio>
                            </template>
                          </b-form-radio-group>
                        </div>
                      </b-form-group>
                    </div>
                  </b-form-group>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-8" :class="{'col-md-12': isPdfExist}">
              <div id="pdf-viewer"></div>
            </div>
          </div>
        </div>
        <template #modal-footer="{ close }">
          <div style="display: flex; justify-content: flex-start;width: 100%;">
            <b-button class="ml-4" size="lg" variant="success" @click="!isPdfExist ? pdfFormSubmit() : close()">
              تایید سوالات
            </b-button>
            <b-button size="sm" variant="outline-danger" @click="!isPdfExist ? pdfCancelSubmit() : close()">
              انصراف
            </b-button>
          </div>
        </template>
      </b-modal>

      <b-modal v-if="currentExamPreview" size="xl" ref="modal-questions-preview" id="modal-questions-preview" no-close-on-backdrop centered>
        <template #modal-header="{}">
          <div class="exams__modal-preview">
            <div>
              فایل: <strong>{{currentExamPreview.nameFile}}</strong>
            </div>
          </div>
        </template>
        <div class="exams__modal-word">
          <div class="row">
            <div v-if="!isWordExist" class="col-12 col-lg-4">
              <div v-if="isWordDescriptiveExist" class="row">
                <div class="col-12">
                  <b-form-group
                    id="fieldset-1"
                    :label="'جمع نمره سوالات تشریحی' + '(' + currentExamPreview.descriptiveCount  + ' سوال' + ')'"
                    label-for="input-descriptive-barom"
                  >
                    <b-form-input
                      required
                      id="input-descriptive-barom"
                      type="number"
                      :state="wordFormValidation(wordQuestions.descriptiveBarom)"
                      aria-describedby="input-descriptive-barom-feedback"
                      v-model="wordQuestions.descriptiveBarom"
                    >
                    </b-form-input>
                  </b-form-group>
                </div>
              </div>
            </div>
            <div class="col-12" :class="{'col-lg-12': isWordExist, 'col-lg-8': isWordDescriptiveExist}">
              <div class="exams__modal-questions-wrapper">
                <div v-for="(question, index) in currentExamPreview.questions" :key="index" class="exams__modal-questions">
                  <div class="exams__modal-questions-title">
                    <span v-html="question.id + '-' +question.title"></span>
                  </div>
                  <div v-if="question.type === 'test'">
                    <div v-for="(option, index2) in question.options" :key="index2" style="margin-right:16px;margin-bottom:8px;" >
                      <span v-html="index2+1 +') ' + option.text"></span>
                      <b-badge v-if="question.selected == option.value" variant="success">گزینه صحیح</b-badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <template #modal-footer="{ close }">
          <div style="display: flex; justify-content: flex-start;width: 100%;">
            <b-button class="ml-4" size="lg" variant="success" @click="!isWordExist ? wordFormSubmit() : close()">
              تایید سوالات
            </b-button>
            <b-button size="sm" variant="outline-danger" @click="!isWordExist ? wordCancelSubmit() : close()">
              انصراف
            </b-button>
          </div>
        </template>
      </b-modal>

    </div>
    <!-- <div v-else v-html="onlyExamsCheckedMessage" class="exams__message">
    </div> -->
  </div>
  <div v-else v-html="noResultMessage" class="exams__message">
    <!-- نتیجه ای برای عبارت {{getAdminExamSearch}} در آزمون ها وجود ندارد -->
  </div>

</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  props:['examList', 'onlyActive'],
  components: {
  },
  data() {
    return {
      pdfQuestions: {
        testCount: null,
        testQuestions: [],
        descriptiveCount: null,
        descriptiveBarom: null,
      },
      wordQuestions: {
        testCount: null,
        testQuestions: [],
        descriptiveCount: null,
        descriptiveBarom: null,
      },
      currentExamPreviewPdf: [],
      currentExamPreview: [],
      currentExamReport: [],
      questionFile: [],
      isPdfExist: false,
      isWordExist: false,
      isWordDescriptiveExist: false,
      length: null,
      questionFileUploader: document.getElementsByClassName('exams__questions-upload'),
    }
  },
  computed: {
    ...mapGetters([
      'getAdminExamSearch',
    ]),
    isExamListEmpty() {
      return this.examList.length;
    },
    noResultMessage() {
      return this.getAdminExamSearch.length ?  `نتیجه ای برای عبارت ${this.getAdminExamSearch} وجود ندارد ` : 'آزمونی وجود ندارد';
    },
    onlyExamsCheckedMessage() {
      return `آزمون دارای سوالی وجود ندارد`
    },
  },
  methods: {
    ...mapActions([
      'uploadQuestionFile',
      'deleteQuestionFile',
      'uploadPdfFile',
      'submitQuestionFile',
      'submitPdfFile',
      'updateExamList',
      'totalReport',
    ]),
    async goToReport(testID) {
      console.log("testID", testID);
      // let result = await this.totalReport(testID);
      // if (result && result.success === true) {
      //   this.currentExamReport = result.data.reports;
        this.$router.push({path:'/admin/report', query: {testID: testID}})
      // }

    },
    async pdfFormSubmit(input) {
      let temp1 = this.pdfFormValidation(this.pdfQuestions.descriptiveCount);
      let temp2 = this.pdfFormValidation(this.pdfQuestions.descriptiveBarom);
      let temp3 = this.pdfFormValidation(this.pdfQuestions.testCount);
      let temp4 = true;
      this.pdfQuestions.testQuestions.map((item, index) => {
        document.getElementById('exams__modal-option-group-' + index).classList.add('exams__modal-option-invalid')
        temp4 = item.selected ? true : false;
      });
      let temp5 = temp1 && temp2 && temp3;
      if( temp4 && temp5) {
        let sampleOption = {
          id: null,
          title: '',
          type: 'descriptive',
          selected: null,
          options: null,
        };
        let options = [];
        for(let i=0 ; i<this.pdfQuestions.descriptiveCount ; i++) {
          options.push({...sampleOption, id: this.pdfQuestions.testQuestions.length + i})
        }
        let questionsKeys= [
          ...this.pdfQuestions.testQuestions,
          ...options,
        ];
        let params = {
          testID: this.currentExamPreviewPdf.testID,
          url: this.currentExamPreviewPdf.url,
          showTest: JSON.stringify(questionsKeys),
          nameFile: this.currentExamPreviewPdf.lessonTitle,
          countDescriptive: this.pdfQuestions.descriptiveBarom,
        }
        let result = await this.submitPdfFile(params)

        if (result && result.success == true) {
          this.$refs['modal-questions-preview-pdf'].hide();
          this.$toast.success(
            "فایل پی دی اف سوالات با موفقیت آپلود شد"
          )
          return true;
        }
      } else {
        this.$toast.error(
          "لطفا موارد قرمز رنگ را وارد کنید"
        )
      }
    },
    pdfCancelSubmit() {
      this.updateExamList({index: this.currentExamPreviewPdf.localIndex, isActive: null, nameFile: null, questions: null, isPdf: null, pdfUrl: null});
      this.$refs['modal-questions-preview-pdf'].hide();
    },
    pdfFormValidation(input) {
      if(input && input.length>0) {
        return true;
      } else {
        return false;
      }
    },
    async wordFormSubmit(input) {
      let temp1 = this.wordFormValidation(this.wordQuestions.descriptiveBarom);
      if (temp1) {
        let params = {
          testID: this.currentExamPreview.testID,
          countDescriptive: (this.wordQuestions.descriptiveBarom * 1),
        }
        let result = await this.submitQuestionFile(params);
        if (result && result.success == true) {
          this.$refs['modal-questions-preview'].hide();
          this.$toast.success(
            "فایل سوالات با موفقیت آپلود شد"
          )
          return true;
        }
      } else {
        this.$toast.error(
          "لطفا موارد قرمز رنگ را وارد کنید"
        )
      }
    },
    wordCancelSubmit() {
      this.updateExamList({index: this.currentExamPreview.localIndex, isActive: null, nameFile: null, questions: null, isPdf: null, pdfUrl: null});
      this.$refs['modal-questions-preview'].hide();
    },
    wordFormValidation(input) {
      if((input && input.length>0) || (input === 0)) {
        return true;
      } else {
        return false;
      }
    },
    setTestQuestionCount() {
      let sampleOption = {
        id: null,
        title: '',
        type: 'test',
        selected: null,
        options: [
          {text: 'الف', value: '1'},
          {text: 'ب', value: '2'},
          {text: 'ج', value: '3'},
          {text: 'د', value: '4'},
        ],
      };
      let options = [];
      for(let i =0 ; i<this.pdfQuestions.testCount ; i++) {
        options.push({...sampleOption, id: i})
      }
      this.pdfQuestions.testQuestions = options;
    },
    pdf(pdfURL) {
      // If absolute URL from the remote server is provided, configure the CORS
      // header on that server.
      var url = 'https://192.168.1.11:7001/uploads/test/pdfs/07d118d3109593c47e46ce7663d778f8478fc681d913c39007e2019edcc9f96a.pdf';
      var thePdf = null;
      var scale = 1;

      // Loaded via <script> tag, create shortcut to access PDF.js exports.
      var pdfjsLib = window['pdfjs-dist/build/pdf'];
      // The workerSrc property shall be specified.
      pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

      // Asynchronous download of PDF
      var loadingTask = pdfjsLib.getDocument(url).promise.then(function(pdf) {
          thePdf = pdf;
          let viewer = document.getElementById('pdf-viewer');

          for(let page = 1; page <= pdf.numPages; page++) {
            let canvas = document.createElement("canvas");
            canvas.className = 'the-canvas';
            viewer.appendChild(canvas);
            renderPage(page, canvas);
          }
      });

      function renderPage(pageNumber, canvas) {
        thePdf.getPage(pageNumber).then(function(page) {
          var scale = 1;
          var viewport = page.getViewport({
            scale: scale
          });

          var context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          page.render({canvasContext: canvas.getContext('2d'), viewport: viewport});
        });
      }
    },
    async openReport(testID) {
      // console.log("testID", testID);
      // let result = await this.totalReport(testID);
      // if (result && result.success === true) {
      //   this.currentExamReport = result.data.reports;
      //   this.$refs['modal-total-report'].show();
      // }
    },
    resetPdfQuestions() {
      this.pdfQuestions = {
        testCount: null,
        testQuestions: [],
        descriptiveCount: null,
        descriptiveBarom: null,
      }
    },
    resetWordQuestions() {
      this.wordQuestions = {
        testCount: null,
        testQuestions: [],
        descriptiveCount: null,
        descriptiveBarom: null,
      }
    },
    async setFile(event, index, exam) {
      let file = event.target.files[0];
      if (file.type === 'application/pdf') {
        this.isPDF = true;
        let result = await this.uploadPdfFile({testID: this.examList[index].testID, testFile: file});
        if (result) {
          this.setCurrentExamPreviewPdf({url: result.url, nameFile: result.nameFile, testID: this.examList[index].testID, index: index}, true, false);
          this.updateExamList({index: index, isActive: true, nameFile: file.name, questions: result.questions, isPdf: true, pdfUrl: result.url});
        }
      } else {
        let result = await this.uploadQuestionFile({testID: this.examList[index].testID, testFile: file})
        if (result) {
          this.setCurrentExamPreview({questions: result.questions, nameFile: result.lessonTitle, testID: this.examList[index].testID, index: index}, true, false);
          this.updateExamList({index: index, isActive: true, nameFile: file.name, questions: result.questions, isPdf: false, pdfUrl: null,});
        }
      }
    },
    async removeFile(index, testId) {
      let result = await this.deleteQuestionFile(testId);
      if (result) {
        this.updateExamList({index: index, isActive: false, nameFile: "", questions: []});
      }
    },
    openUploadDialog(examQuestionsFileId, index) {
      this.questionFileUploader[index].click();
    },
    removeExamFileAndCloseModal() {
      this.currentExamPreview = [];
      this.$refs['modal-questions-preview'].hide();
    },
    setCurrentExamPreviewPdf(pdfData, openModal, isPdfExist) {
      this.resetPdfQuestions();
      if (isPdfExist) {
        this.isPdfExist = true;
      } else {
        this.isPdfExist = false;
      }
      this.currentExamPreviewPdf = [];
      this.currentExamPreviewPdf = {
        url: pdfData.url,
        lessonTitle: pdfData.nameFile,
        testID: pdfData.testID,
        localIndex: pdfData.index,
      };
      if (openModal) {
        this.pdf(pdfData.url);
        this.$refs['modal-questions-preview-pdf'].show();
      }
    },
    setCurrentExamPreview(wordData, openModal, isWordExist) {
      this.resetWordQuestions();
      let descriptiveCount = 0;
      wordData.questions.map((item, index) => {
        if ( item.type === 'descriptive' ) {
          descriptiveCount++;
        }
      })
      if(descriptiveCount) {
        this.isWordDescriptiveExist = true;
      } else {
        this.isWordDescriptiveExist = false;
        this.wordQuestions.descriptiveBarom = 0;
      }
      if (isWordExist) {
        this.isWordExist = true;
      } else {
        this.isWordExist = false;
      }
      this.currentExamPreview = [];
      this.currentExamPreview = {
        nameFile: wordData.nameFile,
        questions: wordData.questions,
        testID: wordData.testID,
        localIndex: wordData.index,
        descriptiveCount: descriptiveCount,
      };
      if (openModal) {
        this.$refs['modal-questions-preview'].show();
      }
    },
  },
  async mounted() {
  }
}
</script>

<style lang="scss" scoped>
  .exams {

    &__message {
      margin-bottom: 16px;
      width: 100%;
      text-align: right;
      background: #fff;
      padding: 12px;
      border-radius: 6px;
      color: #989898;
      box-shadow: 0 3px 6px 0 rgba(32, 33, 36, 0.06);
    }

    &__list {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;

      // &-wrapper {
      //   display: flex;
      //   flex-direction: column;
      //   align-items: flex-start;
      // }
    }

    &__single {
      display: flex;
      width: 100%;

      &-wrapper {
        display: flex;
        margin-bottom: 24px;
        padding: 15px;
        background: #fff;
        border-radius: 10px;
        // box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
        width: 100%;
        box-shadow: 0 3px 6px 0 rgba(32, 33, 36, 0.06);
      }
    }

    &__image {
      width: 100%;
      min-width: 100px;
      position: relative;

      &--expired {
        filter: grayscale(100%);
      }

      &-wrapper {
        position: relative;
        max-width: 100px;
        min-width: 100px;
        border-radius: 4px;
        overflow: hidden;
        box-shadow: 0px 8px 13px -6px #ccc;
        height: fit-content;
      }
    }

    &__details {
      text-align: right;
      font-size: 13px;
      width: 100%;

      &-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-right: 20px;
        width: 100%;
      }
    }

    &__title {

      &-wrapper {
        display: flex;
        margin-bottom: 3px;
      }

      &-label {
        width: 100%;
        max-width: 32px;
        margin-left: 6px;
      }

      &-value {
        width: 100%;
        color: #8a8a8a;
      }
    }

    &__code {

      &-wrapper {
        display: flex;
        margin-bottom: 3px;
      }

      &-label {
        width: 100%;
        max-width: 70px;
        margin-left: 6px;
      }

      &-value {
        color: #8a8a8a;
      }
    }

    &__date {

      &-wrapper {
        display: flex;
        margin-bottom: 3px;
      }

      &-label {
        margin-left: 6px;
        width: 100%;
        max-width: 70px;
      }

      &-value {
        color: #8a8a8a;
      }

    }

    &__time {

      &-wrapper {
        display: flex;
        margin-bottom: 3px;
      }

      &-label {
        margin-left: 6px;
        width: 100%;
        max-width: 70px;

      }

      &-value {
        color: #8a8a8a;
      }
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

    &__preview{

      &-correct {
        // color: #BC11FD;
        // font-weight: bold;
        // border: 1px solid #BC11FD;
        // padding: 8px;
        // border-radius: 6px;
      };
    }

    &__report {
      width: 100%;
      display: flex;

      &-header {
        flex-grow: 1;
        text-align: right;
        margin-bottom: 18px;
        font-weight: bold;
      }

      &-row {
        width: 10%;
      }

      &-name {
        width: 45%;
      }

      &-national-code {
        width: 45%;
      }

      // &-student-id {
      //   width: 30%;
      // }

      &-content {
        width: 100%;
        display: flex;
        margin-bottom: 10px;
        color: rgb(0, 145, 202);
        cursor: pointer;

        &:hover {
          // border-bottom: 1px solid;
          color: rgb(0, 183, 255);
        }
      }

      &-cell {
        flex-grow: 1;
        text-align: right;
      }
    }

    &__modal {

      &-preview {
        display: flex;
        justify-content: space-between;
        width: 100%;
      }

      &-close {
        cursor: pointer;
      }

      &-pdf {
        text-align: right;
      }

      &-word {
        text-align: right;
      }

      &-input {
        margin-bottom: 32px;
      }

      &-option {
        display:flex;
        align-items:center;

        &-group {
          display: flex;
          width: 100%;
          height: calc(1.5em + 0.75rem + 2px);
          padding: 0.375rem 0.75rem;
          font-weight: 400;
          line-height: 1.5;
          background-color: #fff;
          background-clip: padding-box;
          border: 1px solid #ced4da;
          border-radius: 0.25rem;

        }

        &-invalid {
          border: 1px solid #ff9292 !important;
          // color: red;
        }

        &-valid {
          border: 1px solid green !important;
        }

        &-wrapper {
          display: flex;
          justify-content: space-between;
          width: 100%;
        }
      }

      &-questions {
        text-align: right;
        margin-bottom: 32px;
        padding-bottom: 24px;

        &:not(:last-child) {
          border-bottom: 1px solid #ccc;
        }

        &-wrapper {
          height: 50vh;
          overflow-y: scroll;
        }

        &-title {
          margin-bottom: 10px;
          line-height: 32px;
        }
      }
    }
  }

  // Medium devices (tablets, 768px and up)
  @media (min-width: 767.98px) {
    .exams {

      &__single {

        &-wrapper {
          width: 332px;
          margin-left: 24px;
        }
      }

      &__single {

        &-wrapper:nth-child(2n+0) {
          margin-left: 0px;
        }
      }

      &__modal {
        &-questions {

          &-wrapper {
            height: 70vh;
            overflow-y: scroll;
          }
        }
      }

    }
  }

  // large devices (laptops, 768px and up)
  @media (min-width: 991.98px) {
    .exams {
      &__single {

        &-wrapper {
          width: 452px;
          margin-left: 24px;
        }
      }

      &__single {

        &-wrapper:nth-child(2n+0) {
          margin-left: 0px;
        }
      }
    }
  }

  // extra large devices (desktops, 768px and up)
  @media (min-width: 1199.98px) {
    .exams {

      &__single {

        &-wrapper {
          width: 354px;
          margin-left: 24px;
        }
      }

      &__single {

        &-wrapper:nth-child(2n+0) {
          margin-left: 24px;
        }
      }

      &__single {

        &-wrapper:nth-child(3n+0) {
          margin-left: 0px;
        }
      }
    }
  }
</style>
