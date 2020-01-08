<template>
    <div id="block">
        <div id="main">
            <h2 class="title">Block<a :href="previous()"><v-icon>keyboard_arrow_left</v-icon></a>{{block.TopoHeight}}<a :href="next()"><v-icon>keyboard_arrow_right</v-icon></a><small class="bh">{{block.Hash}}</small></h2>
            <div v-for="(hash, i) in block.Tips" :key="i">
                <h5 class="previous-block">Previous Block: <small @click="goTo('/block/' + hash)">{{ hash }}</small></h5>
            </div>
        </div>
        <v-divider class="div"></v-divider>
        <div id="boxes">
            <v-card dark class="block-info">
            <ul>
                <li>Topo Height (unique): <span>{{explorer.formatSupply(block.TopoHeight)}}</span></li>
                <li>Block Height: <span>{{explorer.formatSupply(block.Height)}}</span></li>
                <li>Depth: <span>{{explorer.formatSupply(block.Depth)}}</span></li>
                <li>Timestamp: <span>{{new Date(block.Timestamp * 1000).toLocaleString()}}</span></li>
            </ul>
            </v-card>
            <v-card dark class="block-info">
            <ul>
                <li>Hashrate: <span>{{ explorer.formatSupply((block.Difficulty/(info.target*1000*1000)).toFixed(2)) }} MH/s</span></li>
                <li>Difficulty: <span>{{explorer.formatSupply(block.Difficulty)}}</span></li>
                <li>Reward: <span>{{ block.Reward }} <strong>DERO</strong></span></li>
                <li>Nonce: <span>{{explorer.formatSupply(block.Nonce)}}</span></li>
            </ul>
            </v-card>
            <v-card dark class="block-info">
            <ul>
                <li>Minor / Major Version: <span>{{ block.Minor_Version }} / {{ block.Major_Version }}</span></li>
                <li>Block Size: <span>{{ block.Size }} kB</span></li>
                <li>Block Type: <span>{{ getBlockType() }}</span></li>
                <li>Transactions: <span>{{ block.Tx_Count }}</span></li>
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
                    <tr @click="goTo('/tx/' + block.Mtx.Hash)">
                    <td>{{ block.Mtx.Hash }}</td>
                    <td>{{ block.Mtx.Amount }}</td>
                    <td>{{ block.Mtx.Size }}</td>
                    <td>{{ block.Mtx.Version }}</td>
                    </tr>
                </tbody>
                </template>
            </v-simple-table>
        </div>
          <v-divider class="div"></v-divider>
        <div>
            <h1>{{ block.Tx_Count }} Transactions</h1>
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
                    <tr v-for="(tx, i) in block.Txs" :key="i" @click="goTo('/tx/' + tx.Hash)">
                    <td><font :color="tx.Skipped ? 'indianred' : ''">{{ tx.Hash }}</font></td>
                    <td>{{ tx.Amount }}</td>
                    <td>{{ parseFloat(tx.Fee).toFixed(5) }}</td>
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
                Tx_Count: 0,
                tips: [],
                Mtx: {
                    Hash: "",
                    Amount: 0,
                    Size: ""
                },
                Txs: []
            },
            blockID: this.$route.params.id, /* Block ID can be block Hash or Topo Height */
            explorer,
            info: {}
        }
    },
    async mounted() {
        this.info = await explorer.getInfo()
        await wasm.useWASM()
        this.block = await wasm.loadFullBlock(this.blockID)
    },
    methods: {
        getBlockType() {
            if (!this.block) {
                return "Invalid"
            }
            return (this.block.SyncBlock ? "Sync Block" : (this.block.Orphans_Status ? "Side Block" : "Normal"))
        },
        previous() {
            let topoheight = this.block.TopoHeight
            if (topoheight > 1)
                --topoheight
            return '/block/' +  topoheight
        },
        next() {
           return '/block/' +  (this.block.TopoHeight + 1)
        },
        goTo(path)
        {
            //this.$router.push("/block/" + hash)
            window.location = path
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
    width: 320px;
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

@media screen and (max-width: 1395px)
{
    #boxes {
        margin: auto;
    }

    #table {
        margin-top: 2%;
        margin-left: 5%;
        margin-right: 5%;
        margin-bottom: 5%;
    }
}

@media screen and (max-width: 1280px)
{
    #boxes {
        flex-direction: column;
        align-items: center;
        margin: auto;
    }

    .block-info {
        /*width: 96%;*/
        margin-left: auto;
        margin-right: auto;
        margin-top: 3%;
        margin-bottom: 3%;
    }

    .previous-block, .title, .bh {
        margin-left: 2%;
        margin-right: 2%;
        font-size: 0.7rem;
        text-align: center;
    }

    .title {
        font-size: 0.9rem;
    }

    .bh {
        font-size: 0.59rem;
    }

    #table {
        margin-top: 2%;
        margin-left: 5%;
        margin-right: 5%;
        margin-bottom: 5%;
    }
}
</style>