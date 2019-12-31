<template>
    <div id="block">
        <div>
            <ul class="block-info">
                <li>Block Topo Height (unique): {{block.block_header.topoheight}}</li>
                <li>Block Height: {{block.block_header.height}}</li>
                <li>Block Reward: {{block.block_header.reward/1000000000000}} DERO</li>
            </ul>
        </div>
        <v-divider></v-divider>
        <div>
            <h1>Miner reward transaction</h1>
            <v-simple-table dark id="table">
                <template v-slot:default>
                <thead>
                    <tr>
                    <th class="text-center">Tx Hash</th>
                    <th class="text-center">Outputs</th>
                    <th class="text-center">Fees</th>
                    <th class="text-center">Size (kB)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>{{ }}</td>
                    <td></td>
                    </tr>
                </tbody>
                </template>
            </v-simple-table>
        </div>
          <v-divider></v-divider>
        <div>
            <h1>{{ block.block_header.txcount }} Transactions</h1>
            <v-simple-table dark id="table">
                <template v-slot:default>
                <thead>
                    <tr>
                    <th class="text-center">Tx Hash</th>
                    <th class="text-center">Amount</th>
                    <th class="text-center">Fees</th>
                    <th class="text-center">Size (kB)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(tx, i) in block.json.tx_hashes" :key="i">
                    <td>{{ tx }}</td>
                    </tr>
                </tbody>
                </template>
            </v-simple-table>
        </div>
    </div>
</template>

<script>
import * as explorer from '../explorer.js';

export default {
    data() {
        return {
            block: {
                block_header: {
                    txcount: 0
                },
                json: {
                    tx_hashes: []
                }
            },
            blockID: this.$route.params.id /* Block ID can be block Hash or Topo Height */
        }
    },
    async mounted() {
        /* eslint-disable no-console */
        let block = await explorer.loadBlock(this.blockID)
        if (block.json)
        {
            block.json = JSON.parse(block.json)
            explorer.loadTxs(block.json.tx_hashes)
            //console.log(txs)
        }
        this.block = block
        console.log(this.block)
    }
}
</script>

<style scoped>
#table {
    margin-top: 2%;
    margin-left: 15%;
    margin-right: 15%;
    margin-bottom: 5%;
}
</style>