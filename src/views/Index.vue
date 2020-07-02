<template>
    <div id="index">
        <div id="boxes">
            <v-card class="box" :loading="!infoReady ? 'info' : false" color="primary" elevation="10">
                <v-card-title>NETWORK INFORMATION</v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <ul class="net-info">
                        <li><strong>Current Height:</strong> {{ explorer.formatSupply(info.height) }}</li>
                        <li><strong>Topo Height:</strong> {{ explorer.formatSupply(info.topoheight) }}</li>
                        <li><strong>Hashrate:</strong> {{ explorer.formatSupply((info.difficulty/(info.target*1000*1000)).toFixed(2)) }} MH/s</li>
                        <li><strong>Average Block Time:</strong> {{ info.averageblocktime50 }}s</li>
                        <li><strong>Difficulty:</strong> {{ explorer.formatSupply(info.difficulty) }} </li>
                        <li><strong>Median Block Size:</strong> {{ explorer.formatSupply(info.median_block_size/1000) }} kB</li>
                        <li><strong>Current Supply:</strong> {{ explorer.formatSupply(info.total_supply) }} DERO</li>
                    </ul>
                </v-card-text>
            </v-card>

            <v-card class="box" :loading="!poolReady ? 'info' : false" color="primary" elevation="10">
                <v-card-title>MEM POOL<h5 class="subtitle">({{ txs.length }} transactions)</h5></v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <ul class="mempool" v-for="(tx, i) in txs" :key="i">
                        <li>{{ tx }}</li>
                    </ul>
                </v-card-text>
            </v-card>
            <v-card class="box" :loading="!chartReady ? 'info' : false" color="primary" elevation="10">
                <v-card-title>HASHRATE CHART</v-card-title>
                <v-divider></v-divider>
                <div v-if="chartReady">
                    <apexchart type="line" :options="networkChart.options" :series="networkChart.datas"></apexchart>
                </div>
            </v-card>
        </div>
        <v-divider></v-divider>
        <div class="lb"> <!-- Latest blocks -->
            <h1 :style="this.$vuetify.theme.dark ? 'color: white;' : 'color: black;'">LATEST BLOCKS</h1>
            <v-simple-table id="table">
                <template v-slot:default>
                <thead>
                    <tr>
                    <th class="text-center">Height</th>
                    <th class="text-center">Topo Height</th>
                    <th class="text-center">Timestamp</th>
                    <th class="text-center">Tx</th>
                    <th class="text-center">Block Hash</th>
                    <th class="text-center">Block Reward</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(block, i) in blocks" :key="i" @click='goBlock(block)'>
                    <td>{{ block.block_header.height }}</td>
                    <td>{{ block.block_header.topoheight }}</td>
                    <td>{{ explorer.blockDate(block.block_header.timestamp) }}</td>
                    <td>{{ block.block_header.txcount }}</td>
                    <td>{{ block.block_header.hash }}</td>
                    <td>{{ (block.block_header.reward / 1000000000000).toFixed(4) }} <img src="/logo.png" align="center" height="25px" width="25px" /></td>
                    </tr>
                </tbody>
                </template>
            </v-simple-table>
        </div>
    </div>
</template>

<script>
import * as explorer from '../explorer.js';
import VueApexCharts from 'vue-apexcharts'
import * as chart from '../charts'

export default {
    components: {
        apexchart: VueApexCharts,
    },
    data() {
        return { 
            txs: [],
            info: {},
            blocks: [],
            explorer,
            networkChart: {},
            poolReady: false,
            infoReady: false,
            chartReady: false
        }
    },
    async mounted() {
        explorer.getTxsPool().then(pool => {
            if (pool.txs)
                this.txs = pool.txs
            this.poolReady = true
        })

        explorer.getInfo().then(info => {
            this.info = info
            this.infoReady = true

            explorer.loadBlocks(this.info.topoheight, 15).then(blocks => {
                this.blocks = blocks
            })
        })

        await chart.init()
        this.networkChart = chart.hashrateChart()

        //...
        if (this.$vuetify.theme.dark) {
            this.networkChart.options.chart.background = this.$vuetify.theme.themes.dark.primary
            
        } else {
            this.networkChart.options.chart.background = this.$vuetify.theme.themes.light.primary
            this.networkChart.options.chart.foreColor = "black"
        }
        this.chartReady = true

          setInterval(() => {
              explorer.getInfo().then(info => {

                  if (this.info.topoheight !== info.topoheight)
                  {
                    explorer.loadBlocks(info.topoheight, info.topoheight - this.info.topoheight).then(result => {
                        for (let i = result.length; i > 0; i--)
                        {
                            if (this.blocks[0].block_header.topoheight < result[i - 1].block_header.topoheight)
                                this.blocks.unshift(result[i - 1])
                        }
                    })
                  }

                  this.info = info
              })

              explorer.getTxsPool().then(result => {
                    this.txs = result.txs

                    if (this.txs == null)
                        this.txs = []
              })
          }, 1000 * 8) //every 8s 
    },
    methods: {
        goBlock(block) {
            this.$router.push('/block/' + block.block_header.hash)
        }
    }
}
</script>

<style scoped>
#index {
    margin-top: 3%;
}

#boxes {
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 2%;
    display: flex;
    justify-content: space-around;
}

#table {
    margin-top: 2%;
    margin-left: 15%;
    margin-right: 15%;
    margin-bottom: 5%;
}

.net-info {
    text-align: left;
}

.box {
    width: 22em;
}

ul li {
    list-style: none;
    padding: 0;
    margin-bottom: 2%;
}
h1 {
    color: black;
}

.theme--dark.v-data-table {
    background-color: var(--v-primary-base);
}
.theme--light.v-data-table {
    background-color: var(--v-primary-base);
}

.mempool {
    text-align: center;
    padding: 0;
    list-style: none;
}

.subtitle {
    padding-left: 16px;
    text-align: center;
    font-size: .875rem;
    font-weight: 400;
    line-height: 1.375rem;
    letter-spacing: .0071428571em;
}

.lb {
    margin-top: 1%;
}

@media screen and (max-width: 1280px)
{
    #boxes {
        flex-direction: column;
    }

    .box {
        margin-bottom: 2%;
        /*width: 96%;*/
        margin-left: auto;
        margin-right: auto;
    }

    #table {
        margin-top: 2%;
        margin-left: 5%;
        margin-right: 5%;
        margin-bottom: 5%;
    }
}
</style>