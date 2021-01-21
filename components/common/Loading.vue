<template>
  <div class="loading-wrapper" :class="{'loading-wrapper--overlay': isOverlay}">
    <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  props:['isOverlay'],
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

    &--overlay {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(#000000, 0.3);
      z-index: 1000;
    }
  }
</style>
