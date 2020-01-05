<template>
    <div id="block">
        <div id="main">
            <h2 class="title">Block<a :href="previous()"><v-icon>keyboard_arrow_left</v-icon></a>{{block.block_header.topoheight}}<a :href="next()"><v-icon>keyboard_arrow_right</v-icon></a><small class="bh">{{block.block_header.hash}}</small></h2>
            <div v-for="(hash, i) in block.block_header.tips" :key="i">
                <h5 class="previous-block">Previous Block: <small @click="goBlock(hash)">{{ hash }}</small></h5>
            </div>
        </div>
        <v-divider class="div"></v-divider>
        <div id="boxes">
            <v-card dark class="block-info">
            <ul>
                <li>Topo Height (unique): <span>{{explorer.formatSupply(block.block_header.topoheight)}}</span></li>
                <li>Block Height: <span>{{explorer.formatSupply(block.block_header.height)}}</span></li>
                <li>Depth: <span>{{explorer.formatSupply(block.block_header.depth)}}</span></li>
                <li>Timestamp: <span>{{new Date(block.block_header.timestamp * 1000).toLocaleString()}}</span></li>
            </ul>
            </v-card>
            <v-card dark class="block-info">
            <ul>
                <li>Hashrate: <span>{{ explorer.formatSupply((block.block_header.difficulty/(info.target*1000*1000)).toFixed(2)) }} MH/s</span></li>
                <li>Difficulty: <span>{{explorer.formatSupply(block.block_header.difficulty)}}</span></li>
                <li>Reward: <span>{{(block.block_header.reward / 1000000000000).toFixed(4)}} <strong>DERO</strong></span></li>
                <li>Nonce: <span>{{explorer.formatSupply(block.block_header.nonce)}}</span></li>
            </ul>
            </v-card>
            <v-card dark class="block-info">
            <ul>
                <li>Major Version: <span>{{ block.block_header.major_version }}</span></li>
                <li>Minor Version: <span>{{ block.block_header.minor_version }}</span></li>
                <li>Block Type: <span>{{ getBlockType() }}</span></li>
                <li>Transactions: <span>{{ block.block_header.txcount }}</span></li>
            </ul>
            </v-card>
        </div>
        <v-divider class="div"></v-divider>
        <div>
            <h1>Miner reward transaction</h1>
            <v-simple-table dark id="table">
                <template v-slot:default>
                <thead>
                    <tr>
                    <th class="text-center">Tx Hash</th>
                    <th class="text-center">Outputs</th>
                    <th class="text-center">Size (kB)</th>
                    <th class="text-center">Version</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>{{ block.json.Mtx.Hash }}</td>
                    <td>{{ block.json.Mtx.Amount }}</td>
                    <td>{{ block.json.Mtx.Size }}</td>
                    <td>{{ block.json.Mtx.Version }}</td>
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
                    <tr v-for="(tx, i) in block.json.txs" :key="i">
                    <td><font :color="tx.Skipped ? 'indianred' : ''">{{ tx.Hash }}</font></td>
                    <td>{{ tx.Amount }}</td>
                    <td>{{ tx.Fee }}</td>
                    <td>{{ tx.Size }}</td>
                    </tr>
                </tbody>
                </template>
            </v-simple-table>
        </div>
    </div>
</template>

<script>
import * as explorer from '../explorer.js';
import * as wasm from '../wasm.js'

export default {
    data() {
        return {
            block: {
                block_header: {
                    txcount: 0,
                    tips: []
                },
                json: {
                    tx_hashes: [],
                    Mtx: {
                        Hash: "",
                        Amount: 0,
                        Size: ""
                    },
                    txs: []
                }
            },
            blockID: this.$route.params.id, /* Block ID can be block Hash or Topo Height */
            explorer,
            info: {}
        }
    },
    async mounted() {
        /* eslint-disable no-console */
        this.info = await explorer.getInfo()
        let block = await explorer.loadBlock(this.blockID)

        if (block.json)
        {
            block.json = JSON.parse(block.json)

            if (!block.json.tx_hashes)
            {
                block.json.tx_hashes = []
            }
            await wasm.useWASM()
            wasm.addMinerTxToBlock(block)
            await wasm.loadTxs(block.json)
            console.log(block)
            this.block = block
        }
    },
    methods: {
        getBlockType() {
            if (!this.block) {
                return "Invalid"
            }
            return (this.block.block_header.syncblock ? "Sync Block" : (this.block.block_header.orphan_status ? "Side Block" : "Normal"))
        },
        previous() {
            let topoheight = this.block.block_header.topoheight
            if (topoheight > 1)
                --topoheight
            return '/block/' +  topoheight
        },
        next() {
           return '/block/' +  (this.block.block_header.topoheight + 1)
        },
        goBlock(hash)
        {
            //this.$router.push("/block/" + hash)
            window.location = "/block/" + hash
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
    justify-content: space-evenly;
}

.block-info {
    text-align: left;
    padding: 1%;
    width: 25%;
    
}

.title {
    text-align: left;
    margin-left: 15%;
}

li {
    border-bottom: 1px solid hsla(0,0%,100%,.12);
    margin-top: 7px;
}

ul {
    list-style: square;
}

a:link, a:visited, a:active {
    color: white;
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

.previous-block {
    margin-left: 15%;
    text-align: left;
}
</style>