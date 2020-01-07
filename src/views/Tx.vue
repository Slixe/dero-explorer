<template>
    <div id="tx">
        <div id="main">
            <h2 class="title">Tx Hash: <small class="bh">{{tx.Hash}}</small></h2>
            <h5 class="sub-title">Prefix Hash: <small>{{tx.PrefixHash}}</small></h5>
            <!--<h5 class="sub-title">Block (valid): <small>{{tx.ValidBlock}}</small></h5>-->
            <h5 class="sub-title">Public Key: <small>{{tx.TXpublickey}}</small></h5>
        </div>
        <v-divider class="div"></v-divider>
        <div id="card">
            <v-card dark class="tx-info">
            <ul>
                <li>Timestamp: <span>{{new Date(tx.Timestamp * 1000).toLocaleString()}}</span></li>
                <li>Block Topo Height: <span>{{ tx.Height }}</span></li>
                <li>Tx Version: <span>{{ tx.Version }}</span></li>
                <li>Signature Type: <span>{{ tx.Type }}</span></li>
            </ul>
            </v-card>
            <v-card dark class="tx-info">
            <ul>
                <li>Fee: <span>{{ parseFloat(tx.Feeuint64 / 1000000000000).toFixed(5) }} DERO</span></li>
                <li>No of Confirmations: <span>{{ tx.Depth }}</span></li>
                <li>Tx Size: <span>{{ tx.Size }} kB</span></li>
                <li>Ring Size: <span>{{ tx.Ring_size }}</span></li>
            </ul>
            </v-card>
        </div>
        <v-divider class="div"></v-divider>
        <div>
            <h4 class="sub-title" v-if="tx.PayID8 != ''">Encrypted PaymentID: <small class="bh">{{ tx.PayID8 }}</small></h4>
            <h4 class="sub-title" v-if="tx.PayID32 != ''">PaymentID: <small class="bh">{{ tx.PayID32 }}</small></h4>
            <h4 class="sub-title">Extra: <small class="bh">{{ tx.Extra }}</small></h4>
        </div>
        <v-divider class="div"></v-divider>
        <div>
            <h1>Block</h1>
            <v-simple-table dark id="table">
                <template v-slot:default>
                <thead>
                    <tr>
                    <th class="text-center">Block Hash</th>
                    </tr>
                </thead>
                <tbody>
                    <tr @click="goTo('/block/' + tx.ValidBlock)">
                    <td>{{ tx.ValidBlock }} <font color="green">(Valid)</font></td>
                    </tr>
                    <tr v-for="(block, i) in tx.InvalidBlock" :key="i" @click="goTo('/block/' + block)">
                    <td>{{ block }} <font color="indianred">(Invalid)</font></td>
                    </tr>
                </tbody>
                </template>
            </v-simple-table>
        </div>
        <v-divider class="div"></v-divider>
        <div>
            <h1>Outputs</h1>
            <v-simple-table dark id="table">
                <template v-slot:default>
                <thead>
                    <tr>
                    <th class="text-center">Stealth Address</th>
                    <th class="text-center">Amount</th>
                    <th class="text-center">Amount idx</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(oa, i) in tx.OutAddress" :key="i">
                    <td>{{ oa }}</td>
                    <td>{{ tx.Amount }}</td>
                    <td>{{ tx.OutOffset[i] }}</td>
                    </tr>
                </tbody>
                </template>   
            </v-simple-table>
        </div>
        <v-divider class="div"></v-divider>
        <div v-show="tx.Keyimages != null">
            <h1>Inputs</h1>
            <div v-for="(ki, i) in tx.Keyimages" :key="i">
                <h5>{{ i }}: key image {{ ki }}</h5>
                <v-simple-table dark id="table">
                <template v-slot:default>
                <thead>
                    <tr>
                    <th class="text-center">Ring Member</th>
                    <th class="text-center">Global Index</th>
                    <th class="text-center">Height</th>
                    <th class="text-center">Topo Height</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(ring, i) in tx.Ring[i]" :key="i">
                    <td>{{ ring.inkey.Destination }}<br/>{{ ring.inkey.Mask }}</td>
                    <td>{{ ring.indexglobal }}</td>
                    <td>{{ ring.height }}</td>
                    <td>{{ ring.Topoheight }}</td>
                    </tr>
                </tbody>
                </template>
            </v-simple-table>
            </div>
        </div>
    </div>
</template>
<script>
import * as explorer from '../explorer.js';
import * as wasm from '../wasm.js'

export default {
    data() {
        return {
            txHash: this.$route.params.hash,
            tx: {
            },
            validHash: false,
            explorer
        }
    },
    async mounted() {

        if (this.txHash.length == 64)
        {
            await wasm.useWASM()
            let result = await wasm.parseTx(this.txHash)
            /* eslint-disable no-console */
            console.log(result)
            this.tx = result[0]
        }
    },
    methods: {
        goTo(path)
        {
            window.location = path
        }
    }
}
</script>
<style scoped>
h1, h2, h3, h4, h5 {
    word-break: break-all;
}

#main {
    margin-top: 1%;
}

#table {
    margin-top: 2%;
    margin-left: 15%;
    margin-right: 15%;
    margin-bottom: 3%;
}

.title {
    text-align: left;
    margin-left: 15%;
}

.bh {
    font-size: 0.9rem;
}

.div {
    margin-top: 1%;
    margin-bottom: 1%;
}

#main {
    margin-top: 1%;
}

li {
    border-bottom: 1px solid hsla(0,0%,100%,.12);
    margin-top: 7px;
}

ul {
    list-style: square;
}

span {
    color: hsla(0,0%,100%,.7);
}

.sub-title {
    text-align: left;
    margin-left: 15%;
}

.tx-info {
    width: 28%;
    text-align: left;
    padding: 1%;
}

#card {
    margin-left: 15%;
    margin-right: 15%;
    margin-bottom: 3%;
    margin-top: 3%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
}

@media screen and (max-width: 1280px)
{
    #card {
        flex-direction: column;
        align-items: center;
        margin: auto;
    }

    .tx-info {
        width: 300px;
        margin-top: 3%;
        margin-bottom: 3%;
        width: 96%;
        margin-left: 2%;
        margin-right: 2%;
    }

    .title, .sub-title, .bh {
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