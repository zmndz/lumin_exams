<script>
import { Pie } from 'vue-chartjs'

export default {
  extends: Pie,
  props:['chartData','chartOptions'],
  data() {
    return {
      dt: this.chartData,
      op: this.chartOptions
    }
  },
  methods: {
    update() {
      console.log("ssS",this.dt)
      // this.renderChart(this.dt, this.op)
      this.$data._chart.update()
    }
  },
  mounted () {
    this.renderChart(this.dt, this.op)
  }
};
</script>
