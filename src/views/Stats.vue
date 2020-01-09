<template>
    <div v-if="ready" id="stats">
        <div id="charts">
            <apexchart class="chart" type="line" :options="networkChart.options" :series="networkChart.datas"></apexchart>
        </div>
    </div>
</template>
<script>
import VueApexCharts from 'vue-apexcharts'
import * as chart from '../charts'

export default {
    components: {
        apexchart: VueApexCharts,
    },
    data() {
        return {
            networkChart: {},
            ready: false
        }
    },
    async mounted() {
        await chart.init()
        this.networkChart = chart.hashrateChart()
        this.ready = true
    }
}
</script>
<style scoped>
#charts {
    margin-top: 5%;
    margin-left: 15%;
    margin-right: 15%;
    margin-bottom: 5%;
}
.chart {

}
</style>