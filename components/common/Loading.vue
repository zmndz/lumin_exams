<template>
  <div class="loading-wrapper">
    <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'

export default {
  data() {
    return {
    }
  },
  computed: {

  },
  methods: {

  },
  mounted() {

  }
}
</script>

<style lang="scss" scoped>

  .loading-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30vh;
  }
</style>
