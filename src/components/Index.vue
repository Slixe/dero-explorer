<template>
    <div id="index">
        <!-- LATEST BLOCKS !-->
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
                <th class="text-center">Size (kB)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(block, i) in blocks" :key="i">
                <td>{{ block.block_header.height }}</td>
                <td>{{ block.block_header.topoheight }}</td>
                <td>{{ blockDate(block.block_header.timestamp) }}</td>
                <td>{{ block.block_header.txcount }}</td>
                <td>{{ block.block_header.hash }}</td>
                <td>0</td>
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
            blocks: []
        }
    },
    async mounted() {
            /* eslint-disable no-console */
          this.txs = await explorer.getTxsPool()
          let info = await explorer.getInfo()
          console.log(info)
          this.blocks = await explorer.loadBlocks(info.topoheight, 15)
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
    margin-top: 5%;
}

#table {
    margin-top: 2%;
    margin-left: 15%;
    margin-right: 15%;
    margin-bottom: 5%;
}
</style>