<template>
  <div>
    <div class="exams__sort">
      <div class="exams__sort-header">
        <div class="exams__sort-title">
          فیلتر آزمون‌ها بر اساس:
        </div>
        <div class="exams__sort-checkbox">
          <b-form-checkbox v-model="onlyExamChecked" size="lg" name="check-button" switch>
          فقط بدون سوال
          </b-form-checkbox>
        </div>
      </div>
      <ul class="exams__sort-list">
        <li
          class="exams__sort-types"
          @click="setActiveSortType(sortTypes.availableExams.title)"
          :class="{' exams__sort-types--active': isActiveSortType(sortTypes.availableExams.title)}"
          >
            {{sortTypes.availableExams.label}}
        </li>
        <li
          class="exams__sort-types"
          @click="setActiveSortType(sortTypes.expiredExams.title)"
          :class="{' exams__sort-types--active': isActiveSortType(sortTypes.expiredExams.title)}"
          >
            {{sortTypes.expiredExams.label}}
        </li>
        <li
          class="exams__sort-types"
          @click="setActiveSortType(sortTypes.allExams.title)"
          :class="{' exams__sort-types--active': isActiveSortType(sortTypes.allExams.title)}"
          >
            {{sortTypes.allExams.label}}
        </li>
      </ul>
    </div>

    <div class="exams__list-wrapper">
      <SingleExam ref="singleExam" :examList="getAdminCurrentExams" :onlyActive="onlyExamChecked" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SingleExam from '~/components/admin/SingleExam'

export default {
  components: {
    SingleExam,
  },
  data() {
    return {
      sortTypes: {
        availableExams:{
          id: 1,
          title: 'AVAILABLE_EXAMS',
          label: 'آزمون‌های پیش رو',
          count: 0,
        },
        expiredExams: {
          id: 2,
          title: 'EXPIRED_EXAMS',
          label: '‌آزمون‌های برگذار شده',
          count: 0,
        },
        allExams:{
          id: 3,
          title: 'ALL_EXAMS',
          label: 'همه آزمون ها',
          count: 0,
        },
      },
    }
  },
  computed: {
    ...mapGetters({
      activeSortType: 'getAdminActiveSortType',
      isOnlyExamsChecked: 'getAdminOnlyExamsChecked',
      getAdminCurrentExams: 'getAdminCurrentExams',
    }),
    onlyExamChecked: {
      get: function() {
        return this.isOnlyExamsChecked;
      },
      set: function(newValue) {
        this.setAdminOnlyExamChecked(newValue);
        return newValue;
      }
    },
  },
  methods: {
    ...mapActions([
      'setAdminActiveSortType',
      'setAdminOnlyExamChecked',
    ]),
    isActiveSortType(sortTypeId) {
      return this.activeSortType == sortTypeId
    },
    setActiveSortType(sortTypeId) {
      this.setAdminActiveSortType(sortTypeId);
    },
  },
  async mounted() {
    this.setAdminActiveSortType('AVAILABLE_EXAMS');
  }
}
</script>

<style lang="scss" scoped>

  .exams {
    &__sort {
      display: flex;
      flex-direction: column;
      text-align: right;
      margin-bottom: 32px;
      background: #fff;
      padding: 15px;
      border-radius: 10px;
      font-size: 12px;
      box-shadow: 0 3px 6px 0 rgba(32, 33, 36, 0.06);

      &-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
        align-items: center;
      }

      &-title {
      }

      &-checkbox {
        display: flex;
      }

      &-list {
        padding: 0;
        margin: 0;
        list-style: none;
        display: flex;
        justify-content: space-between;
        text-align: center;
      }

      &-types {
        padding: 6px;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;

        &--active {
          color: #fff;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          background-color: #BC11FD;

          &:hover {
            opacity: 1 !important;
          }
        }

        &:hover {
          opacity: 0.7;
        }
      }
    }
  }

  // Medium devices (tablets, 768px and up)
  @media (min-width: 767.98px) {
    .exams {

      &__sort {
        font-size: 14px;

        &-list {
          justify-content: flex-start;
        }

        &-types {
          margin: 0 15px;
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
