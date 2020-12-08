<template>
  <div class="login__background">
    <div class="login__form-wrapper">
      <nav class="login__navbar">
        <a href="/admin" class="logo__wrapper">
          <img class="logo" src="~/assets/images/logo.svg" alt="">
        </a>
      </nav>
      <div v-if="!isPhoneChecked" class="login__form">
        <div class="login__form-title">
          پنل مدیریتی سیستم لومین
        </div>

        <b-form class="w-100 text-right" @submit="onSubmitLogin">
          <b-form-group
            id="input-group-1"
            label-for="input-1"
          >
            <b-form-input
              id="input-1"
              class="login__phone"
              v-model="phone"
              required
              autofocus
              placeholder="شماره موبایل"
            >
            </b-form-input>
            <div v-if="showPhoneMessage" class="login__phone-message">
              شماره موبایل وارد شده صحیح نمی باشد
            </div>
          </b-form-group>

          <b-button type="submit" class="login__submit">ادامه</b-button>
        </b-form>
      </div>

      <div v-else class="verify__form">
        <div class="verify__form-title">
          پنل مدیریتی سیستم لومین
        </div>

        <b-form class="w-100 text-right" @submit="onSubmitVerify">
          <div class="verify__edit-wrapper">
            <div class="verify__edit-label">
              کد 5 رقمی به شماره شما پیامک شد
            </div>
            <div class="verify__edit" @click="editPhone">
              {{phone}}
            </div>
          </div>

          <b-form-group
            id="input-group-2"
            label-for="input-2"
          >
            <b-form-input
              id="input-2"
              class="verify__code"
              v-model="verifyCode"
              required
              ref="verifyCode"
              type="number"
              @keyup="checkVerifyCode($event)"
              placeholder="کد ارسالی را وارد کنید..."
            >
            </b-form-input>

          </b-form-group>

          <b-button type="submit" class="verify__submit">تایید</b-button>

          <div class="verify__countdown-wrapper">
            <div class="verify__countdown-label">
              پیامکی دریافت نکردید؟ 
            </div>
            <div v-if="isVerifyCountdownStarted" class="verify__countdown">
              {{this.verifyCurrentTime}} ثانیه تا ردیافت مجدد کد
            </div>
            <div v-else class="verify__retry" @click="resendCode">ارسال مجدد کد تایید</div>
          </div>
        </b-form>
      </div>

    </div>
    <div class="login__image">
    </div>  
  </div>

</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      phone: '',
      showPhoneMessage: false,
      verifyCode: '',
      verifyTime: 120,
      verifyCurrentTime: 120,
      timer: null,
      isVerifyCountdownStarted: false,
      isPhoneChecked: false,
    }
  },
  methods: {
    ...mapActions([
      'loginAdmin',
      'verifyAdmin',
    ]),
    async login() {
      let loginResult = await this.loginAdmin(this.phone);
      if (loginResult && loginResult.success === true) {
        let loginData = {
          mobile: this.phone,
          loginToken: loginResult.data.token
        }
        this.toggleVerifyForm();
      } else {
        console.log("Error: login result ", loginResult);
      }
    },
    resendCode()  {
      this.countdown(false);
      this.isVerifyCountdownStarted = false;
      this.login();
    },
    async verify() {
      let verifyResult = await this.verifyAdmin(this.verifyCode);
      if (verifyResult && verifyResult.success === true) {
        console.log("verify", verifyResult)
        this.$router.push('/admin');
      } else {
        console.log("Error: verify result ", verifyResult);
      }
    },
    goToLogin() {
      this.$router.push('/admin')
    },
    editPhone() {
      this.countdown(false);
      this.isPhoneChecked = false;
      this.isVerifyCountdownStarted = false;
    },
    checkPhone() {
      let regex = new RegExp('^(\\+98|0)?9\\d{9}$');
      let result = regex.test(this.phone);
      if (!result) {
        this.$toast.error(
          "لطفا شماره‌ی موبایل وارد کنید..."
        )  
      } 
      

      // else {
      //   this.showPhoneMessage = true;
      // }
      return result;
    },
    toggleVerifyForm() {
      this.isPhoneChecked = true;
      this.isVerifyCountdownStarted = true;
      this.countdown(true);
      setTimeout(() => {
        this.$refs.verifyCode.focus();
      }, 0)
    },
    checkVerifyCode(e) {
      e = (e) ? e : window.event;
      let verifyLength = e.target.value.length;
      var charCode = (e.which) ? e.which : e.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        e.preventDefault();
      } else {
        return true;
      }
    },
    countdown(isStarted) {
      if (isStarted) {
        this.timer = setInterval(() => {
          if (this.verifyCurrentTime <= 1) {
            clearInterval(this.timer);
            this.isVerifyCountdownStarted = false;
          }
          --this.verifyCurrentTime
        }, 1000);
      } else {
        clearInterval(this.timer);
        this.verifyCurrentTime = this.verifyTime;
      }
    },
    async onSubmitLogin(e) {
      e.preventDefault();
      let isPhoneValid = await this.checkPhone();
      if (isPhoneValid) {
        this.login();
      }
    },
    async onSubmitVerify(e) {
      e.preventDefault();
      let isPhoneValid = await this.checkPhone();
      if (isPhoneValid) {
        this.verify();
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
      position: absolute;
      top: 0;
      right: 0;
    }

    &__form {
      display: flex;
      justify-content: center;
      width: 80%;
      max-width: 400px;
      flex-direction: column;
      align-items: center;
      transition: all 0.2s ease-in-out;
      
      &-wrapper {
        width: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        position: relative;
      }

      &-title {
        margin-bottom: 56px;
        font-size: 22px;
        color: #8e8e8e;
      }
    }

    &__phone {
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

      &-message {
        color: red;
        font-size: 12px;
        margin-top: 6px;
      }
    }

    &__image {
      display: none;
    }

    &__submit {
      background-color: #FDBC11;
      border: none;
      border-radius: 50px;
      height: 46px;
      width: 100%;
      margin-top: 32px;
      box-shadow: 4px 10px 10px -4px rgba(253, 188, 17, 0.32);
      text-align: center;
      line-height: 34px;
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
  }

  .verify {

    &__form {
      display: flex;
      justify-content: center;
      width: 80%;
      max-width: 400px;
      flex-direction: column;
      align-items: center;
      transition: all 0.2s ease-in-out;
      
      &-wrapper {
        width: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        position: relative;
      }

      &-title {
        margin-bottom: 56px;
        font-size: 22px;
        color: #8e8e8e;
      }
    }

    &__code {
      border: none;
      border-bottom: 1px solid #e4e4e4;
      border-radius: 0;
      padding: 0;
      background-color: transparent;
      box-shadow: none;

      &:focus {
        outline: none;
        border-color: darken(#e4e4e4, 15%);
        box-shadow: none !important;
      }
    }

    &__countdown {

      &-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        color: #ababab;
      }
    }

    &__retry {
      color: #F68E1E;
      transition: all 0.2s;
      cursor: pointer;
      text-align: center;

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
      margin-top: 32px;
      margin-bottom: 32px;
      box-shadow: 4px 10px 10px -4px rgba(253, 188, 17, 0.32);
      text-align: center;
      line-height: 34px;
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

    &__edit {
      color: #F68E1E;
      transition: all 0.2s;
      cursor: pointer;
      
      &:hover {
        text-decoration: none;
        color: darken(#F68E1E, 10%);
      }

      &-wrapper {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        margin-bottom: 24px;
        font-size: 14px;
        color: #ababab;
      }

      &-label {

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
        background: url('~assets/images/login_bg_1.jpg');
        background-size: cover;
        background-position: center;
        width: 50%;
        height: 100%;
        box-shadow: 0px 0px 18px 6px #ccc;
      }
    }

    .verify {

      &__edit {

        &-wrapper {
          flex-direction: row;
        }
      }
    }
  }
</style>
