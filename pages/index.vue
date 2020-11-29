<template>
  <div class="login__background">
    <div class="login__form-wrapper">
      <nav class="login__navbar">
        <a href="#" class="logo__wrapper">
          <img class="logo" src="~/assets/images/logo.svg" alt="">
        </a>
      </nav>
      <div class="login__form">
        <b-form class="w-100">
          <b-form-group
            id="input-group-1"
            label-for="input-1"
          >
            <b-form-input
              id="input-1"
              class="login__username"
              v-model="form.username"
              required
              placeholder="نام کاربری"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-2" label-for="input-2">
            <b-form-input
              id="input-2"
              class="login__password"
              v-model="form.password"
              type="password"
              required
              placeholder="رمز عبور"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-4">
            <!-- <b-form-checkbox-group v-model="form.checked" id="checkboxes-4">
              <b-form-checkbox value="me" class="d-flex flex-row-reverse">مرا به خاطر بسپار</b-form-checkbox>
            </b-form-checkbox-group> -->
              <b-link class="login__forgot-password" href="#">فراموشی رمز عبور</b-link>
          </b-form-group>
          <div class="login__submit" @click="goToLogin">ورود</div>
        </b-form>
      </div>
      <div class="login__footer__wrapper">
        کاربر جدید هستید؟
          <a class="login__register" href="#">ثبت نام کنید</a>
      </div>
    </div>
    <div class="login__image">
    </div>  
  </div>

</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
        checked: []
      },
    }
  },
  methods: {
    goToLogin() {
      this.$router.push('/student/examList')
    }
  }
}
</script>

<style lang="scss" scoped>

  .logo {
    width: 120px;
    height: auto;

    &__wrapper {
      display: flex;
      margin: 20px 40px;
    }
  }

  .title {
    font-size: 24px;
    text-align: center;
    margin-top: 100px;
    margin-bottom: 40px;
  }
  .login {

    &__background {
      // background-color: #f9f9f9;
      width: 100vw;
      height: 100vh;
      display: flex;
      justify-content: space-between;
    }

    &__navbar {
      width: 100%;
      display: flex;
    }

    &__form {
      display: flex;
      justify-content: center;
      // margin-top: 160px;
      width: 80%;
      max-width: 400px;

      &-wrapper {
        width: 100%;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        align-items: center;
      }
    }

    &__username {
      border: none;
      border-bottom: 1px solid #e4e4e4;
      border-radius: 0;
      padding: 0;
      background-color: transparent;

      &:focus {
        outline: none;
        border-color: darken(#e4e4e4, 15%);
        box-shadow: none !important;
      }
    }

    &__password {
      border: none;
      border-bottom: 1px solid #e4e4e4;
      border-radius: 0;
      padding: 0;
      background-color: transparent;

      &:focus {
        outline: none;
        border-color: darken(#e4e4e4, 15%);
        box-shadow: none !important;
      }
    }

    &__image {
      display: none;
    }

    &__forgot-password {
      color: #F68E1E;
      transition: all 0.2s;

      &:hover {
        text-decoration: none;
        color: darken(#F68E1E, 10%);
      }
    }

    &__submit {
      background-color: #FDBC11;
      border: none;
      border-radius: 50px;
      height: 46px;
      margin-top: 32px;
      box-shadow: 4px 10px 10px -4px rgba(253, 188, 17, 0.32);
      text-align: center;
      line-height: 44px;
      color: #fff;
      cursor: pointer;
      transition: all 0.2s ease-in-out;

      &:focus {
        outline: none;
        background-color: #FDBC11 !important;
        border: none;
        box-shadow: 4px 10px 10px -4px rgba(253, 188, 17, 0.32) !important;
      }

      &:hover {
        background-color: darken(#FDBC11, 5%);
      }
      
      &:active {
        background-color: darken(#FDBC11, 7%) !important;
        border: none;
        box-shadow: 4px 10px 10px -4px rgba(253, 188, 17, 0.32);
      }
    }

    &__footer {
      &__wrapper {
        width: 100%;
        display: flex;
        justify-content: center;
        margin: 60px 0;
      }
    }

    &__register {
      color: #F68E1E;
      height: 28px;
      margin: 0 4px;
      border-bottom: 1px solid #F68E1E;
      transition: all 0.2s;
      
      &:hover {
        text-decoration: none;
        color: darken(#F68E1E, 10%);
      }
    }
  }

  // Medium devices (tablets, 768px and up)
  @media (min-width: 991.98px) {

    .login {

      &__form {
        width: 56%;
        
        &-wrapper {
          width: 50%;
        }
      }

      &__image {
        display: block;
        background: url('~assets/images/login_bg_2.jpg');
        background-size: cover;
        background-position: center;
        width: 50%;
        height: 100%;
        box-shadow: 0px 0px 18px 6px #ccc;
      }
    }
  }
</style>
