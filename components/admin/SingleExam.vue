<template>
  <div v-if="!isExamListEmpty" class="">
    <div v-if="!getAdminOnlyExamsChecked" class="exams__list">
      <div class="exams__single-wrapper" v-for="(exam, index) in examsList" :key="index">
        <div class="exams__single">
          <div class="exams__image-wrapper">
            <img class="exams__image" :class="{'exams__image--expired' : isExpired}" src="~/assets/images/books/book_placeholder.svg" alt="">
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
  <!-- To do: fix fileupload v-model -->
              <b-form-file :id="'js-examQuestionsFile-' + index" class="exams__questions-upload" v-model="zzz.examQuestionsFile" plain></b-form-file>
              <div v-if="isExpired" class="exams__questions-upload-expired">
                برگذار شده
              </div>
              <div v-else>
                <div v-if="!exam.isActive" class="exams__questions-upload-trigger" @click="openUploadDialog('js-examQuestionsFile-' + index, index)">
                  <span class="exams__questions-upload-icon">+</span> آپلود سوالات
                </div>
                <div v-else class="exams__questions-upload-file">
                  <div class="exams__questions-upload-file-name" @click="setCurrentExamPreview(exam)">
                    مشاهده سوالات: {{ exam.examQuestionsFile ? exam.examQuestionsFile.name : '' }}
                  </div>
                  <div class="exams__questions-upload-file-remove" @click="removeExamFile(index)">
                    x
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <b-modal v-if="currentExamPreview" ref="modal-questions-preview" id="modal-questions-preview" centered>
        <template #modal-header="{ close }">
          <div style="display: flex; justify-content: space-between;width: 100%;">
            <div>
              سوالات آزمون <strong>{{currentExamPreview.lessonTitle}}</strong>
            </div>
            <div @click="close()" style="cursor: pointer;">X</div>
          </div>
        </template>
        <p class="my-4" style="text-align: right;">
          لیست سوالات اینجا قرار خواهد گرفت
        </p>
        <template #modal-footer="{ ok }">
          <div style="display: flex; justify-content: space-between;width: 100%;">
            <b-button size="sm" variant="success" @click="ok()">
              تایید سوالات
            </b-button>
            <b-button size="sm" variant="outline-danger" @click="removeExamFileAndCloseModal()">
              حذف سوالات
            </b-button>
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
import { mapActions, mapGetters } from 'vuex'

export default {
  props:['examsList', 'isExpired'],  
  data() {
    return {
      currentExamPreview: [],
      // currentList: [],
      zzz:[]
    }
  },
  computed: {
    ...mapGetters([
      'getAdminOnlyExamsChecked',
      'getAdminExamSearch',
    ]),
    isExamListEmpty() {
      return (Object.keys(this.examsList).length === 0 && this.examsList.constructor === Object);
    },
    noResultMessage() {
      if (this.isExpired) {
        return `نتیجه ای برای عبارت ${this.getAdminExamSearch} در آزمون های برگذار شده وجود ندارد`
      } else {
        return `نتیجه ای برای عبارت ${this.getAdminExamSearch} در آزمون های پیش رو وجود ندارد`
      }
    },
    onlyExamsCheckedMessage() {
      if (this.isExpired) {
        return `آزمون های برگذار شده، آزمون دارای سوالی ندارند`
      } else {
        return `آزمون های پیش رو، آزمون دارای سوالی ندارند`
      }
    },
  },
  methods: {
    openUploadDialog(examQuestionsFileId, index) {
      let questionFileUploader = document.getElementById(examQuestionsFileId).click();
    },
    removeExamFile(examIndex) {
      this.examsList[examIndex].examQuestionsFile = null;
    },
    removeExamFileAndCloseModal() {
      this.currentExamPreview.examQuestionsFile = null;
      this.$refs['modal-questions-preview'].hide();
    },
    setCurrentExamPreview(clickedExam) {
      this.currentExamPreview = clickedExam;
      this.$refs['modal-questions-preview'].show();
    },
  },
  mounted() {

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
