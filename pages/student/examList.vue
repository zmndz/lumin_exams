<template>
  <div class="courses__wrapper">
    <div class="courses__sort">
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
    </div>
    <div class="courses__list">
      <div class="courses__single">
        <div class="courses__image-wrapper">
          <img class="courses__image" src="~/assets/images/books/book_placeholder.svg" alt="">
          <span class="courses__image-badge">امروز</span>
        </div>
        <div class="courses__details-wrapper">
          <div class="courses__details">
            <div class="courses__title-wrapper">
              <div class="courses__title-label">
                آزمون: 
              </div>
              <div class="courses__title-value">
                مقدمات راهنمایی و مشاوره 
              </div>
            </div>
            <div class="courses__date-wrapper">
              <div class="courses__date-label">
                تاریخ آزمون: 
              </div>
              <div class="courses__date-value">
                12/10/99 
              </div>
            </div>
            <div class="courses__time-wrapper">
              <div class="courses__time-label">
                ساعت آزمون: 
              </div>
              <div class="courses__time-value">
                10:00 تا 11:30 
              </div>
            </div>
          </div>
          <div class="courses__start-wrapper">
            <div class="courses__start courses__start--active">
              شروع آزمون
            </div>
          </div>
        </div>
      </div>
      <div class="courses__single">
        <div class="courses__image-wrapper">
          <img class="courses__image" src="~/assets/images/books/book_placeholder.svg" alt="">
          <span class="courses__image-badge">امروز</span>
        </div>
        <div class="courses__details-wrapper">
          <div class="courses__details">
            <div class="courses__title-wrapper">
              <div class="courses__title-label">
                آزمون: 
              </div>
              <div class="courses__title-value">
                مقدمات راهنمایی و مشاوره 
              </div>
            </div>
            <div class="courses__date-wrapper">
              <div class="courses__date-label">
                تاریخ آزمون: 
              </div>
              <div class="courses__date-value">
                12/10/99 
              </div>
            </div>
            <div class="courses__time-wrapper">
              <div class="courses__time-label">
                ساعت آزمون: 
              </div>
              <div class="courses__time-value">
                10:00 تا 11:30 
              </div>
            </div>
          </div>
          <div class="courses__start-wrapper">
            <div class="courses__start">
              2 ساعت و 53 دقیقه تا شروع آزمون
            </div>
          </div>
        </div>
      </div>
      <div class="courses__single">
        <div class="courses__image-wrapper">
          <img class="courses__image" src="~/assets/images/books/book_placeholder.svg" alt="">
          <span class="courses__image-badge">۲ روز مانده</span>
        </div>
        <div class="courses__details-wrapper">
          <div class="courses__details">
            <div class="courses__title-wrapper">
              <div class="courses__title-label">
                آزمون: 
              </div>
              <div class="courses__title-value">
                مقدمات راهنمایی و مشاوره 
              </div>
            </div>
            <div class="courses__date-wrapper">
              <div class="courses__date-label">
                تاریخ آزمون: 
              </div>
              <div class="courses__date-value">
                12/10/99 
              </div>
            </div>
            <div class="courses__time-wrapper">
              <div class="courses__time-label">
                ساعت آزمون: 
              </div>
              <div class="courses__time-value">
                10:00 تا 11:30 
              </div>
            </div>
          </div>
          <div class="courses__start-wrapper">
            <div class="courses__start">
              2 ساعت و 53 دقیقه تا شروع آزمون
            </div>
          </div>
        </div>
      </div>
      <div class="courses__single">
        <div class="courses__image-wrapper">
          <img class="courses__image" src="~/assets/images/books/book_placeholder.svg" alt="">
          <span class="courses__image-badge">۲ روز مانده</span>
        </div>
        <div class="courses__details-wrapper">
          <div class="courses__details">
            <div class="courses__title-wrapper">
              <div class="courses__title-label">
                آزمون: 
              </div>
              <div class="courses__title-value">
                مقدمات راهنمایی و مشاوره 
              </div>
            </div>
            <div class="courses__date-wrapper">
              <div class="courses__date-label">
                تاریخ آزمون: 
              </div>
              <div class="courses__date-value">
                12/10/99 
              </div>
            </div>
            <div class="courses__time-wrapper">
              <div class="courses__time-label">
                ساعت آزمون: 
              </div>
              <div class="courses__time-value">
                10:00 تا 11:30 
              </div>
            </div>
          </div>
          <div class="courses__start-wrapper">
            <div class="courses__start">
              2 ساعت و 53 دقیقه تا شروع آزمون
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'studentLayout',
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
      activeSortType: 1
    }
  },
  methods: {
    isActiveSortType(SortTypeId) {
      return this.activeSortType == SortTypeId
    },
    setActiveSortType(SortTypeId) {
      this.activeSortType = SortTypeId
    },
  },
  mounted() {
    this.setActiveSortType(this.activeSortType);
  }
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

    &__list {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
    }

    &__single {
      display: flex;
      margin-bottom: 24px;
      padding: 15px;
      background: #fff;
      border-radius: 10px;
      box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
      width: 100%;
    }

    &__image {
      width: 100%;
      min-width: 100px;
      position: relative;

      &-wrapper {
        position: relative;
        max-width: 100px;
        min-width: 100px;
        border-radius: 4px;
        overflow: hidden;
        box-shadow: 0px 8px 13px -6px #ccc;

        &::after {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
      }

      &-badge {
        position: absolute;
        top: 6px;
        right: -2px;
        font-size: 10px;
        font-weight: bold;
        color: #fff;
        background-color: #fdbc11;
        padding: 4px 6px 4px 12px;
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
        box-shadow: -2px 2px 2px 0px rgba(72, 72, 72, 0.18);
      }
    }

    &__details {
      text-align: right;
      // margin-right: 14px;
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

    &__date {

      &-wrapper {
        display: flex;
        margin-bottom: 3px;
      }

      &-label {
        margin-left: 6px;
        width: 100%;
        max-width: 63px;
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

    &__start {
      opacity: 0.58;
      font-size: 10px;
      background-color: #28a745;
      color: #fff;
      display: inline-block;
      text-align: center;
      vertical-align: middle;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      padding: 0.375rem 0.75rem;
      line-height: 1.5;
      border-radius: 0.25rem;
      width: 100%;
      transition: all 0.15s ease-in-out;
      
      &-wrapper {
        display: flex;
      }

      &--active {
        opacity: 1;
        background-color: #28a745;
        color: #fff;
        font-weight: normal;
        cursor: pointer;
        font-size: 1rem;
        box-shadow: 0px 8px 13px -6px #ccc;
        line-height: 30px;
        
        &:hover {
          background-color: darken(#28a745, 3%);
        }
        
        &:active {
          background-color: darken(#28a745, 7%) !important;
        }
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

      &__single {
        width: 332px;
        margin-left: 24px;
      }

      &__single:nth-child(2n+0) {
        margin-left: 0px;
      }
    }
  }
  
  // large devices (laptops, 768px and up)
  @media (min-width: 991.98px) {
    .courses {
      &__single {
        width: 452px;
        margin-left: 24px;
      }

      &__single:nth-child(2n+0) {
        margin-left: 0px;
      }
    }
  }

  // extra large devices (desktops, 768px and up)
  @media (min-width: 1199.98px) {
    .courses {
      &__single {
        width: 354px;
        margin-left: 24px;
      }

      &__single:nth-child(2n+0) {
        margin-left: 24px;
      }

      &__single:nth-child(3n+0) {
        margin-left: 0px;
      }
    }
  }
</style>
