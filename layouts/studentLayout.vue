<template>
  <div class="student-page">
    <div class="user__navbar">
      <a href="/" class="logo__wrapper">
        <img class="logo" src="~/assets/images/logo.svg" alt="">
      </a>
      <b-dropdown variant="link" menu-class="user__name-menu" toggle-class="user__name-wrapper">
        <template #button-content>
          <div class="user__name">
            {{getStudentName}} {{getStudentFamily}}
          </div>
        </template>
        <b-dropdown-item href="#">پروفیل</b-dropdown-item>
        <b-dropdown-item href="#" @click="logout">خروج</b-dropdown-item>
      </b-dropdown>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <Nuxt/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'getStudentName',
      'getStudentFamily',
    ])
  },
  methods: {
    ...mapActions([
      'logoutStudent',
    ]),
    logout() {
      this.logoutStudent();
      this.$router.push('/');
    },
  }
}
</script>

<style lang="scss">
html {
  font-family:
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

body {
  color: #515151;
  direction: rtl;
}

.student-page {
  background-color: #f9f9f9;
  min-height: 100vh;
  height: 100%;
}

.logo {
  width: 120px;
  height: auto;

  &__wrapper {
    display: flex;
  }
}

.user {

  &__navbar {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0px 0px 8px 4px #e4e4e4;
    font-weight: 400;
    margin-bottom: 32px;
    align-items: center;
    box-shadow: 5px 10px 20px 0 rgba(0, 0, 0, 0.09);
  }

  &__name {
    color: #515151;
    cursor: pointer;

    &-wrapper {
      text-decoration: none !important;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #515151;
      padding: 0;

      &:focus {
        box-shadow: none;
      }

      &:hover {
        color: #515151;
      }
    }

    &-menu {
      
      a {
        &:active {
          background-color: #fdbc11;
        }
      }
    }
  }
}
</style>