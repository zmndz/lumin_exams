<template>
  <div class="register__background">
    <div class="register__form-wrapper">
      <nav class="register__navbar">
        <a href="#" class="logo__wrapper">
          <img class="logo" src="~/assets/images/logo.svg" alt="">
        </a>
      </nav>
      <div class="register__form">
        <div class="register__form-title">
          سیستم آزمون آنلاین لومین
        </div>

        <b-form class="w-100" @submit="register">
          <b-form-group id="input-group-national-code" label-for="input-national-code">
            <b-form-input
              id="input-national-code"
              class="register__national-code"
              v-model="form.nationalCode"
              required
              type="number"
              autofocus
              placeholder="کد ملی"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-student-id" label-for="input-student-id">
            <b-form-input
              id="input-student-id"
              class="register__student-id"
              v-model="form.studentId"
              type="number"
              required
              placeholder="شماره دانشجویی"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-phone" label-for="input-phone">
            <b-form-input
              id="input-phone"
              class="register__phone"
              v-model="form.phone"
              type="number"
              required
              placeholder="شماره موبایل"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-password" label-for="input-password">
            <b-form-input
              id="input-password"
              class="register__password"
              v-model="form.password"
              type="password"
              required
              placeholder="رمز عبور"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-password-confirmation" label-for="input-password-confirmation">
            <b-form-input
              id="input-password-confirmation"
              class="register__password-confirmation"
              v-model="form.passwordConfirmation"
              type="password"
              required
              placeholder="تکرار رمز عبو"
            ></b-form-input>
          </b-form-group>
          <b-button type="submit" class="register__submit">ثبت نام</b-button>
        </b-form>
      </div>
      <div class="register__footer__wrapper">
        حساب کاربری دارید؟
        <a class="register__register" href="/">ورود به صفحه آزمون ها</a>
      </div>
    </div>
    <div class="register__image">
    </div>  
  </div>

</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      form: {
        nationalCode: '',
        studentId: '',
        phone: '',
        password: '',
        passwordConfirmation: '',
      },
    }
  },
  methods: {
    ...mapActions([
      'registerStudent',
    ]),
    checkPhone() {
      let phone = this.form.phone;
      if (phone.length === 11) {
        return true;
      } else {
        this.$toast.error(
        'شماره موبایل باید ۱۱ رقم باشد'
        )
        return false;
      }
    },
    checkPassword() {
      let password = this.form.password;
      let passwordConfirmation = this.form.passwordConfirmation;
      if (password === passwordConfirmation) {
        if (password.length >= 6) {
          return true;
        }else {
          this.$toast.error(
          'حداقل طول رمزعبور 6 کاراکتر می باشد'
          )
          return false;
        }
      } else {
        this.$toast.error(
        '"رمز عبور" و "تکرار رمز عبور" یکسان نیستند'
        )
        return false;
      }
    },
    async register(e) {
      e.preventDefault();
      if (this.checkPhone() && this.checkPassword()) {
        let requestParams = {
          nationalCode: this.form.nationalCode,
          studentID: this.form.studentId,
          mobile: this.form.phone,
          password: this.form.password,
          repassword: this.form.passwordConfirmation,
        }
        let registerResult = await this.registerStudent(requestParams);
        // if (registerResult && registerResult.success === true) {
        //   this.$router.push('/student');
        // } else {
        //   console.log("Error: register result ", registerResult);
        // }
      } else {
        // this.$toast.error(
        // '"رمز عبور" و "تکرار رمز عبور" یکسان نیستند'
        // )
      }
    },
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
  .register {

    &__background {
      width: 100vw;
      min-height: 100vh;
      display: flex;
      justify-content: space-between;
      position: relative;
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
      flex-direction: column;
      align-items: center;
      transition: all 0.2s ease-in-out;

      &-wrapper {
        width: 100%;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        align-items: center;
        
      }

      &-title {
        margin-bottom: 56px;
        margin-top: 24px;
        font-size: 22px;
        color: #8e8e8e;
      }
    }

    &__national-code {
      border: none;
      border-bottom: 1px solid #e4e4e4;
      border-radius: 0;
      padding: 0;
      background-color: transparent;
      margin-bottom: 24px;

      &:focus {
        outline: none;
        border-color: darken(#e4e4e4, 15%);
        box-shadow: none !important;
      }
    }

    &__student-id {
      border: none;
      border-bottom: 1px solid #e4e4e4;
      border-radius: 0;
      padding: 0;
      background-color: transparent;
      margin-bottom: 24px;

      &:focus {
        outline: none;
        border-color: darken(#e4e4e4, 15%);
        box-shadow: none !important;
      }
    }

    &__phone {
      border: none;
      border-bottom: 1px solid #e4e4e4;
      border-radius: 0;
      padding: 0;
      background-color: transparent;
      margin-bottom: 24px;

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
      margin-bottom: 24px;

      &:focus {
        outline: none;
        border-color: darken(#e4e4e4, 15%);
        box-shadow: none !important;
      }
    }

    &__password-confirmation {
      border: none;
      border-bottom: 1px solid #e4e4e4;
      border-radius: 0;
      padding: 0;
      background-color: transparent;
      margin-bottom: 24px;

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
      width: 100%;
      margin-top: 50px;
      box-shadow: 4px 10px 10px -4px rgba(253, 188, 17, 0.32);
      text-align: center;
      line-height: 36px;
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

    .register {

      &__form {
        width: 56%;
        
        &-wrapper {
          width: 50%;
        }
      }

      &__image {
        display: block;
        background: url('~assets/images/login_bg_4.jpg');
        background-size: cover;
        background-position: center;
        width: 50%;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        box-shadow: 0px 0px 18px 6px #ccc;
      }
    }
  }
</style>
