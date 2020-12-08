<template>
  <div class="courses__wrapper">
    <!-- <div class="courses__sort">
      <div class="courses__sort-title">
        فیلتر بر اساس: 
      </div>
      <ul class="courses__sort-list">
        <li 
          v-for="(sortType, index) in sortTypes" 
          class="courses__sort-types"
          :key="index" 
          @click="setActiveSortType(sortType.id)"
          :class="{' courses__sort-types--active': isActiveSortType(sortType.id)}">
            {{sortType.title}}
        </li>
      </ul>               
    </div> -->

    <div class="courses__list">
      <StudentExams :examsList="getStudentExams" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import StudentExams from '~/components/student/StudentExams'

export default {
  layout: 'studentLayout',
  components: {
    StudentExams,
  },
  data() {
    return {
      sortTypes: [
        {
          id: 1,
          title: 'امتحانات امروز',
        },
        {
          id: 2,
          title: 'امتحانات آینده',
        },
        {
          id: 3,
          title: 'تصحیح شده',
        },
      ],
      activeSortType: 1,
    }
  },
  computed: {
    ...mapGetters([
      'getStudentExams',
      'getStudentActiveSortType',
    ]),
  },
  methods: {
    ...mapActions([
      'loadAllStudentData',
      'fetchStudentExams',
    ]),
    isActiveSortType(SortTypeId) {
      return this.activeSortType == SortTypeId
    },
    setActiveSortType(SortTypeId) {
      this.activeSortType = SortTypeId
    },
  },
  mounted() {
    this.setActiveSortType(this.activeSortType);
    this.fetchStudentExams();
  },
  async created() {
    this.loadAllStudentData();
  },
}
</script>

<style lang="scss" scoped>

  .courses {

    &__sort {
      display: flex;
      flex-direction: column;
      text-align: right;
      margin-bottom: 32px;
      background: #fff;
      padding: 15px;
      border-radius: 10px;
      box-shadow: 5px 10px 20px 0 rgba(0, 0, 0, 0.05);
      font-size: 12px;

      &-title {
        margin-bottom: 16px;
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
  }

  // Medium devices (tablets, 768px and up)
  @media (min-width: 767.98px) {
    .courses {

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
    .courses {

    }
  }

  // extra large devices (desktops, 768px and up)
  @media (min-width: 1199.98px) {
    .courses {

    }
  }
</style>
