<template>
  <div class="exams__wrapper">
    <div class="action-bar">
      <div class="action-bar__new-exam-wrapper">
        <div class="action-bar__new-exam" v-b-modal.modal-new-exam >
          + آزمون جدید
        </div>
        <!-- <b-tooltip target="new-exam" placement="left" >به زودی</b-tooltip> -->
      </div>
      <div class="action-bar__search-wrapper">
        <input v-model="examSearch" @keyup="search" class="action-bar__search" type="text" placeholder="جستجو...">
      </div>
    </div>

    <SortTypes />

    <div class="exams__list-wrapper">
      <SingleExam :examsList="getAdminCurrentExams" />
    </div>

    <b-modal id="modal-new-exam"  size="md" hide-footer centered>
      <h1 class="my-4 text-center" style="height: 120px;display:flex; align-items:center;justify-content:center;color: #949494;font-weight: bold;">به زودی...</h1>
    </b-modal>
  </div>

</template>

<script>
import SingleExam from '~/components/admin/SingleExam'
import SortTypes from '~/components/admin/SortTypes'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  layout: 'adminLayout',
  components: {
    SingleExam,
    SortTypes,
  },
  data() {
    return {
      examSearch: '',
    }
  },
  computed: {
    ...mapGetters([
      'getAdminCurrentExams',
      'getAdminActiveSortType',
    ]),
    examList: {
      get: function(data) {
        return this.getAdminCurrentExams;
      },
      set: function(newValue) {
        return newValue;
      }
    },
  },
  methods: {
    ...mapActions([
      'loadAllAdminData',
      'setAdminExamSearch',
      'fetchAdminActiveExams',
      'fetchAdminExpiredExams',
      'fetchAdminAllExams',
    ]),
    goToNewExamPage() {
      this.$router.push('/admin/newExam');
    },
    search() {
      let query = this.examSearch;
      let minLength = 2;
      // setTimeout(() => {
        if (query.length >= minLength) {
          this.setAdminExamSearch(this.examSearch);
          this.fetchRequest();
        } else if (query.length == 0) {
          console.log("Z")
          this.setAdminExamSearch("");
          this.fetchRequest();
        }
      // }, 1000);
    },
    fetchRequest() {
      let activeSortType = this.getAdminActiveSortType;
      this.fetchAdminAllExams(activeSortType);
      // if (activeSortType === 'AVAILABLE_EXAMS') {
      //   this.fetchAdminActiveExams();
      // } else if (activeSortType === 'EXPIRED_EXAMS') {
      //   this.fetchAdminExpiredExams();
      // } else if (activeSortType === 'ALL_EXAMS') {
      //   this.fetchAdminActiveExams();
      //   this.fetchAdminExpiredExams();
      // }
    },

  },
  async mounted() {
  },
  async created() {
    this.loadAllAdminData();
  }
}
</script>

<style lang="scss" scoped>

  .action-bar {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 32px;

    &__new-exam {
      color: #fff;
      text-align: center;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      background-color: #BC11FD;
      padding: 6px;
      border-radius: 4px;
      height: 44px;
      line-height: 34px;
      cursor: pointer;
      transition: all 0.2s;


      &:hover {
        background-color: darken(#BC11FD, 5%);
      }
      
      &:active {
        background-color: darken(#BC11FD, 12%) !important;
      }

      &:focus {
        outline: none;
      }

      &-wrapper {
        min-width: 120px;
        width: 140px;
        margin-left: 8px;
      }
    }

    &__search {
      border: none;
      box-shadow: 0 3px 6px 0 rgba(32, 33, 36, 0.06);
      padding: 6px 16px;
      border-radius: 4px;
      transition: all 0.2s;
      width: 100%;
      height: 44px;


      &:focus {
        border: none;
        outline: none;
      }

      &-wrapper {
        margin-right: 8px;
        width: 100%;
      }
    }
  }


  // Medium devices (tablets, 768px and up)
  @media (min-width: 767.98px) {
  }
  
  // large devices (laptops, 768px and up)
  @media (min-width: 991.98px) {

  }

  // extra large devices (desktops, 768px and up)
  @media (min-width: 1199.98px) {

  }
</style>
