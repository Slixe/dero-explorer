<template>
    <div id="block">
        <div id="main">
            <h2 >Block<a @click="previous()"><v-icon>keyboard_arrow_left</v-icon></a>{{block.block_header.topoheight}}<a @click="previous()"><v-icon>keyboard_arrow_right</v-icon></a><small class="bh">{{block.block_header.hash}}</small></h2>
        </div>
        <v-divider class="div"></v-divider>
        <div>
            <ul class="block-info">
                <li>Topo Height (unique): <span>{{explorer.formatSupply(block.block_header.topoheight)}}</span></li>
                <li>Block Height: <span>{{explorer.formatSupply(block.block_header.height)}}</span></li>
                <li>Timestamp: <span></span></li>
            </ul>
        </div>
        <!--<div id="boxes">
            <v-card dark class="box" elevation="10">
                    Topo Height (unique): {{explorer.formatSupply(block.block_header.topoheight)}} 
            </v-card>
            <v-card dark class="box" elevation="10">
                    hell
            </v-card>
        </div>
        <div id="boxes">
            <v-card dark class="box" elevation="10">
                   Height: {{explorer.formatSupply(block.block_header.height)}}
            </v-card>
            <v-card dark class="box" elevation="10">
                   Block Reward: {{(block.block_header.reward/1000000000000).toFixed(4)}} DERO
            </v-card>
        </div>-->
        <v-divider class="div"></v-divider>
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
                    <td></td>
                    <td></td>
                    </tr>
                </tbody>
                </template>
            </v-simple-table>
        </div>
          <v-divider class="div"></v-divider>
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
                    <td>{{ tx.hash }}</td>
                    <td>?</td>
                    <td>{{ tx.reward }}</td>
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
            blockID: this.$route.params.id, /* Block ID can be block Hash or Topo Height */
            explorer
        }
    },
    async mounted() {
        /* eslint-disable no-console */
        let block = await explorer.loadBlock(this.blockID)
        if (block.json)
        {
            block.json = JSON.parse(block.json)
            this.block = block
            if (this.block.json.tx_hashes)
            {
                let txs = await explorer.loadTxs(this.block.json.tx_hashes)
                if (txs && txs.status === "OK")
                    this.block.json.tx_hashes = txs.txs
                console.log(JSON.stringify(txs))
            }
            else
                this.block.json.tx_hashes = []
            /*
            this.block.json.tx_hashes = await explorer.loadTxs(this.block.json.tx_hashes)
            console.log(this.block.json.tx_hashes)
            */
        }
    }
}
</script>

<style scoped>
#table {
    margin-top: 2%;
    margin-left: 15%;
    margin-right: 15%;
    margin-bottom: 3%;
}

#boxes {
    margin-left: 15%;
    margin-right: 15%;
    margin-bottom: 2%;
    margin-top: 2%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
}

.box {
    padding: 0.65em;
    width: 25%;
    text-align: center;
}

.block-info {
    margin-left: 15%;
    margin-right: 15%;
    text-align: left;
    background-color: #424242;
    color: white;
    width: 28%;
    padding-top: 0.5%;
    
}

li {
    border-bottom: 1px solid hsla(0,0%,100%,.12);
}

ul {
    margin: 0;
    padding: 0;
    list-style: none;
}

span {
    color: hsla(0,0%,100%,.7);
}

.bh {
    font-size: 1rem;
}

#main {
    margin-top: 1%;
}

.div {
    margin-top: 1%;
    margin-bottom: 1%;
}
</style>