<template>
    <div id="index">
        <div id="boxes">
            <v-card dark width="340px" elevation="10">
                <v-card-title>NETWORK INFORMATION</v-card-title>
                <v-card-text>
                    <ul>
                        <li>Average Block Time: {{ info.averageblocktime50 }}s</li>
                        <li>Difficulty: {{ info.difficulty }} </li>
                        <li>Hashrate: {{ (info.difficulty/(info.target*1000*1000)).toFixed(2) }} MH/s</li>
                        <li>Current Height: {{ info.height }} </li>
                        <li>Median Block Size: {{ info.median_block_size/1000 }} kB</li>
                    </ul>
                </v-card-text>
            </v-card>
<!--
            <v-card dark width="340px" elevation="10">
                <v-card-title>NETWORK INFORMATION</v-card-title>
                <v-card-text>
                    <ul>
                        <li>Average Block Time: {{ info.averageblocktime50 }}s</li>
                        <li>Difficulty: {{ info.difficulty }} </li>
                        <li>Hashrate: {{ (info.difficulty/(info.target*1000*1000)).toFixed(2) }} MH/s</li>
                        <li>Current Height: {{ info.height }} </li>
                        <li>Median Block Size: {{ info.median_block_size/1000 }} kB</li>
                    </ul>
                </v-card-text>
            </v-card>

            <v-card dark width="340px" elevation="10">
                <v-card-title>NETWORK INFORMATION</v-card-title>
                <v-card-text>
                    <ul>
                        <li>Average Block Time: {{ info.averageblocktime50 }}s</li>
                        <li>Difficulty: {{ info.difficulty }} </li>
                        <li>Hashrate: {{ (info.difficulty/(info.target*1000*1000)).toFixed(2) }} MH/s</li>
                        <li>Current Height: {{ info.height }} </li>
                        <li>Median Block Size: {{ info.median_block_size/1000 }} kB</li>
                    </ul>
                </v-card-text>
            </v-card>-->
        </div>

        <h1>LATEST BLOCKS</h1>
        <v-simple-table dark id="table">
            <template v-slot:default>
            <thead>
                <tr>
                <th class="text-center">Height</th>
                <th class="text-center">Topo Height</th>
                <th class="text-center">Timestamp</th>
                <th class="text-center">Tx</th>
                <th class="text-center">Block Hash</th>
                <th class="text-center">Block Reward</th>
                <!--<th class="text-center">Size (kB)</th>-->
                </tr>
            </thead>
            <tbody>
                <tr v-for="(block, i) in blocks" :key="i">
                <td>{{ block.block_header.height }}</td>
                <td>{{ block.block_header.topoheight }}</td>
                <td>{{ blockDate(block.block_header.timestamp) }}</td>
                <td>{{ block.block_header.txcount }}</td>
                <td>{{ block.block_header.hash }}</td>
                <td>{{ (block.block_header.reward / 1000000000000).toFixed(4) }} <img src="/logo.png" align="center" height="25px" width="25px" /></td>
                <!--<td>0</td>-->
                </tr>
            </tbody>
            </template>
        </v-simple-table>
    </div>
</template>

<script>
import * as explorer from '../explorer.js';

export default {
    data() {
        return { 
            txs: [],
            info: {},
            blocks: []
        }
    },
    async mounted() {
            /* eslint-disable no-console */
          this.txs = await explorer.getTxsPool()
          this.info = await explorer.getInfo()
          console.log(this.info)
          this.blocks = await explorer.loadBlocks(this.info.topoheight, 15)
          console.log(this.blocks)
          /* eslint-enable no-console */
        //loadBlocks(topoHeight, 10)
    },
    methods: {
        blockDate(timestamp) {
            let date = new Date(timestamp * 1000);
            let hours = date.getHours();
            let minutes = "0" + date.getMinutes();
            let seconds = "0" + date.getSeconds();
            let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
            return formattedTime;
        }
    }
}
</script>

<style scoped>
#index {
    margin-top: 3%;
}

#boxes {
    margin-left: 5%;
    margin-right: 5%;
    margin-bottom: 2%;
}

#table {
    margin-top: 2%;
    margin-left: 15%;
    margin-right: 15%;
    margin-bottom: 5%;
}

li {
    text-align: left;
    list-style: none;
}
</style>