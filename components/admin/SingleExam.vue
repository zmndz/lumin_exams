<template>
  <div v-if="isExamListEmpty" class="">

    <div v-if="(!getAdminOnlyExamsChecked)" class="exams__list">
      <div class="exams__single-wrapper" v-for="(exam, index) in examsList" :key="index">
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
              <b-button v-if="exam.isExpire" variant="outline-dark" @click="openReport(exam.testID)">
                مشاهده نتایج
              </b-button>

              <div v-else>
                <!-- <div v-if="!exam.isActive" class="exams__questions-upload-trigger" @click="openUploadDialog('js-examQuestionsFile-' + index, index)"> -->
                <div v-if="false" @click="openUploadDialog('js-examQuestionsFile-' + index, index)">
                  <span class="exams__questions-upload-icon">+</span> آپلود سوالات
                </div>
                <div v-else class="exams__questions-upload-file">
                  <div class="exams__questions-upload-file-name" @click="setCurrentExamPreview(exam.questions, true, index)">
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
          <div class="exams__report-header exams__report-student-id">
            شماره دانشجویی
          </div>
          <div class="exams__report-header exams__report-score">
            نمره
          </div>
        </div>
        <div v-for="(report, index) in currentExamReport" :key="index" class="exams__report-content">
          <div class="exams__report-cell exams__report-row">
            {{index+1}}
          </div>
          <div class="exams__report-cell exams__report-name">
            {{report.name}} {{report.family}}
          </div>
          <div class="exams__report-cell exams__report-national-code">
            {{report.nationalCode}}
          </div>
          <div class="exams__report-cell exams__report-student-id">
            {{report.studentID}}
          </div>
          <div class="exams__report-cell exams__report-score">
            {{report.resultStudent}}
          </div>
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

      <b-modal v-if="currentExamPreview" size="xl" ref="modal-questions-preview" id="modal-questions-preview" centered>
        <template #modal-header="{ close }">
          <div style="display: flex; justify-content: space-between;width: 100%;">
            <div>
              سوالات آزمون <strong>{{currentExamPreview.lessonTitle}}</strong>
            </div>
            <div @click="close()" style="cursor: pointer;">X</div>
          </div>
        </template>
        <div v-if="true">
          pdf

          <canvas id="the-canvas"></canvas>

	        <!-- <object class="zzz" style="width: 100%;height: 700px;" type="application/pdf" data="https://csnaapp.ir/uploads/3.pdf">
            <iframe
              src="https://csnaapp.ir/uploads/3.pdf"
              width="100%"
              height="100%"
              style="border: none;">
              <p>Your browser does not support PDFs.
                <a href="https://csnaapp.ir/uploads/3.pdf">Download the PDF</a>.</p>
            </iframe>
          </object> -->
        </div>
        <div v-else v-for="(question, index) in currentExamPreview" :key="index" style="text-align: right; margin-bottom: 24px; padding-bottom: 12px;border-bottom: 1px solid #ccc;">
          <div style="margin-bottom: 10px;">
            <span v-html="question.id + '-' +question.title"></span>
          </div>
          <div v-for="(option, index2) in question.options" :key="index2" style="margin-right:16px;margin-bottom:8px;" >
            <span v-html="index2+1 +') ' + option.text"></span>
            <b-badge v-if="question.selected == option.value" variant="success">گزینه صحیح</b-badge>
          </div>
        </div>
        <template #modal-footer="{ ok }">
          <div style="display: flex; justify-content: space-between;width: 100%;">
            <b-button variant="success" @click="ok()">
              تایید سوالات
            </b-button>
            <!-- <b-button size="sm" variant="outline-danger" @click="removeFile()">
              حذف سوالات
            </b-button> -->
          </div>
        </template>
      </b-modal>
    </div>
    <div v-else v-html="onlyExamsCheckedMessage" class="exams__message">
    </div>
  </div>
  <div v-else v-html="noResultMessage" class="exams__message">
    <!-- نتیجه ای برای عبارت {{getAdminExamSearch}} در آزمون ها وجود ندارد -->
  </div>

</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  props:['examsList'],
  components: {
  },
  data() {
    return {
      currentExamPreview: [],
      currentExamReport: [],
      questionFile: [],
      isPDF: false,
      length: null,
      questionFileUploader: document.getElementsByClassName('exams__questions-upload'),
    }
  },
  computed: {
    ...mapGetters([
      'getAdminOnlyExamsChecked',
      'getAdminExamSearch',
    ]),
    isExamListEmpty() {
      return this.examsList.length;
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
      'updateExamList',
      'totalReport',
    ]),
    pdf() {
      // If absolute URL from the remote server is provided, configure the CORS
      // header on that server.
      var url = 'https://csnaapp.ir/uploads/3.pdf';

      // Loaded via <script> tag, create shortcut to access PDF.js exports.
      var pdfjsLib = window['pdfjs-dist/build/pdf'];
      // The workerSrc property shall be specified.
      pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
      console.log("pdfjsLib", pdfjsLib)

      // Asynchronous download of PDF
      var loadingTask = pdfjsLib.getDocument(url);
      loadingTask.promise.then(function(pdf) {
        console.log('PDF loaded');

        // Fetch the first page
        var pageNumber = 1;
        pdf.getPage(pageNumber).then(function(page) {
          console.log('Page loaded');

          var scale = 1;
          var viewport = page.getViewport({
            scale: scale
          });

          // Prepare canvas using PDF page dimensions
          var canvas = document.getElementById('the-canvas');
          console.log("DW:", canvas)
          var context = canvas.getContext('2d');
          console.log("viewport.height:", viewport.height)
          console.log("viewport.width:", viewport.width)
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          // Render PDF page into canvas context
          var renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          console.log("renderContext:", renderContext)
          var renderTask = page.render(renderContext);
          renderTask.promise.then(function() {
            console.log('Page rendered');
          });
        });
      }, function(reason) {
        // PDF loading error
        console.error(reason);
      });

    },
    async openReport(testID) {
      console.log("test", testID);
      let result = await this.totalReport(testID);
      console.log("result", result);
      this.currentExamReport = result.data.reports;
      this.$refs['modal-total-report'].show();
    },
    async setFile(event, index, exam) {
      let file = event.target.files[0];
      if (file.type === 'application/pdf') {
      console.log("file: ", file.type)
        this.isPDF = true;
      }
      let result = await this.uploadQuestionFile({testID: this.examsList[index].testID, testFile: file})
      if (result) {
        this.setCurrentExamPreview(result.questions, false);
        this.updateExamList({index: index, isActive: true, nameFile: file.name, questions: result.questions});
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
    setCurrentExamPreview(clickedExam, openModal, index) {
      this.currentExamPreview = [];
      this.currentExamPreview = clickedExam;
      if (openModal) {
        this.pdf()
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
      // box-shadow: 0 2px 3px 0 rgba(32, 33, 36, 0.14);
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
        width: 30%;
      }

      &-national-code {
        width: 25%;
      }

      &-student-id {
        width: 30%;
      }

      &-score {
        width: 5%;
      }

      &-content {
        width: 100%;
        display: flex;
        margin-bottom: 10px;
      }

      &-cell {
        flex-grow: 1;
        text-align: right;
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
