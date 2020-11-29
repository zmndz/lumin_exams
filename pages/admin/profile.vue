<template>
  <div class="profile__wrapper">
    <div class="profile">
      <div class="row">
        <div class="col-12 col-md-6">
          <div class="profile__form">
            <div class="profile__title-wrapper">
              <div class="profile__title-label">
                نام و نام خانوادگی
              </div>
              <input class="profile__title-input" type="text" placeholder="مثال: ریاضی مقدماتی">
            </div>
            <div class="profile__title-wrapper">
              <div class="profile__title-label">
                شماره موبایل
              </div>
              <input class="profile__title-input" type="text" placeholder="مثال: ریاضی مقدماتی">
            </div>
            <div class="profile__title-wrapper">
              <div class="profile__title-label">
                عنوان آزمون
              </div>
              <input class="profile__title-input" type="text" placeholder="مثال: ریاضی مقدماتی">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'adminLayout',
  data() {
    return {

    }
  },
  methods: {

  },
  mounted() {

  }
}
</script>

<style lang="scss" scoped>

  input {
    border: 1px solid #d9d9d9;
    background-color: #f9f9f9;
    padding: 12px;
    border-radius: 4px;
    height: 40px;
    width: 100%;

    &:focus {
      outline: none;
    }

    &::-webkit-input-placeholder { /* Chrome/Opera/Safari */
      color: #bfbfbf;
    }
    &::-moz-placeholder { /* Firefox 19+ */
      color: #bfbfbf;
    }
    &:-ms-input-placeholder { /* IE 10+ */
      color: #bfbfbf;
    }
    &:-moz-placeholder { /* Firefox 18- */
      color: #bfbfbf;
    }
  }

  .profile {

    &__wrapper {
      background: #fff;
      border-radius: 4px;
      width: 100%;
      box-shadow: 0 1px 6px 0 rgba(32, 33, 36, 0.14);
      padding: 24px;
    }

    &__form {
      display: flex;
      flex-direction: column;
      text-align: right;
    }

    &__title {

      &-wrapper {
        margin-bottom: 16px;
      }

      &-label {
        margin-bottom: 2px;
      }

      &-input {

      }
    }

    &__date {

      &-wrapper {
        margin-bottom: 16px;
      }

      &-label {
        margin-bottom: 2px;
      }

      &-input {
        
      }
    }


    &__time {

      &-wrapper {
        margin-bottom: 16px;
      }

      &-label {
        margin-bottom: 2px;
      }

      &-duration {
        display: flex;
        line-height: 40px;
      }

      &-start {
        text-align: center;
        margin: 0 6px;
        width: 50%;
      }

      &-end {
        text-align: center;
        margin-right: 6px;
        width: 50%;
      }
    }

    &__code {

      &-wrapper {
        margin-bottom: 16px;
      }

      &-label {
        margin-bottom: 2px;
      }

      &-input {

      }
    }


    &__course {

      &-wrapper {
        margin-bottom: 16px;
      }

      &-label {
        margin-bottom: 2px;
      }

      &-input {

      }
    }
  }

  .upload {
    display: flex;
    flex-direction: column;
    text-align: right;
    align-items: flex-start;

    &__questions {

      &-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 180px;
        width: 180px;
        border: 1px dashed #d9d9d9;
        background-color: #f9f9f9;
        border-radius: 4px;
        color: #bfbfbf;
        cursor: pointer;
        margin-top: 24px;
      }

      &-icon {
        font-size: 42px;
        height: 56px;
        line-height: 50px;
      }
    }

    &__students {

      &-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 180px;
        width: 180px;
        border: 1px dashed #d9d9d9;
        background-color: #f9f9f9;
        border-radius: 4px;
        color: #bfbfbf;
        cursor: pointer;
        margin-top: 24px;
      }

      &-icon {
        font-size: 42px;
        height: 56px;
        line-height: 50px;
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
