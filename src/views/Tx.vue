<template>
    <div id="tx">
        <div id="main" class="extra">
            <h2 :style="this.$vuetify.theme.dark ? 'color: white;' : 'color: black;'" class="title">Tx Hash: <small class="bh">{{tx.Hash}}</small></h2>
            <h5 :style="this.$vuetify.theme.dark ? 'color: white;' : 'color: black;'" class="sub-title">Prefix Hash: <small>{{tx.PrefixHash}}</small></h5>
            <!--<h5 class="sub-title">Block (valid): <small>{{tx.ValidBlock}}</small></h5>-->
            <h5 :style="this.$vuetify.theme.dark ? 'color: white;' : 'color: black;'" class="sub-title">Public Key: <small>{{tx.TXpublickey}}</small></h5>
        </div>
        <v-divider class="div"></v-divider>
        <div id="card">
            <v-card color="primary" class="tx-info">
            <ul>
                <li>Timestamp: <span>{{new Date(tx.Timestamp * 1000).toLocaleString()}}</span></li>
                <li>Block Topo Height: <span>{{ explorer.formatSupply(tx.Height) }}</span></li>
                <li>Tx Version: <span>{{ tx.Version }}</span></li>
                <li>Signature Type: <span>{{ tx.Type }}</span></li>
            </ul>
            </v-card>
            <v-card color="primary" class="tx-info">
            <ul>
                <li>Fee: <span>{{ parseFloat(tx.Feeuint64 / 1000000000000).toFixed(5) }} DERO</span></li>
                <li>No of Confirmations: <span>{{ tx.Depth }}</span></li>
                <li>Tx Size: <span>{{ tx.Size }} kB</span></li>
                <li>Ring Size: <span>{{ tx.Ring_size }}</span></li>
            </ul>
            </v-card>
        </div>
        <v-divider class="div"></v-divider>
        <div class="extra">
            <h4 :style="this.$vuetify.theme.dark ? 'color: white;' : 'color: black;'" v-if="tx.PayID8 != ''">Encrypted PaymentID: <small class="bh">{{ tx.PayID8 }}</small></h4>
            <h4 :style="this.$vuetify.theme.dark ? 'color: white;' : 'color: black;'" v-if="tx.PayID32 != ''">PaymentID: <small class="bh">{{ tx.PayID32 }}</small></h4>
            <h4 :style="this.$vuetify.theme.dark ? 'color: white;' : 'color: black;'">Extra: <small class="bh">{{ tx.Extra }}</small></h4>
        </div>
        <v-divider class="div"></v-divider>
        <div>
            <h1 :style="this.$vuetify.theme.dark ? 'color: white;' : 'color: black;'">Block</h1>
            <v-simple-table id="table">
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
            <h1 :style="this.$vuetify.theme.dark ? 'color: white;' : 'color: black;'">Outputs ({{ tx.OutAddress.length }})</h1>
            <v-simple-table id="table">
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
        <v-divider v-show="tx.Keyimages.length > 0" class="div"></v-divider>
        <div v-show="tx.Keyimages.length > 0">
            <h1 :style="this.$vuetify.theme.dark ? 'color: white;' : 'color: black;'">Inputs ({{ tx.Keyimages.length }})</h1>
            <div v-for="(ki, i) in tx.Keyimages" :key="i">
                <h5 :style="$vuetify.theme.dark ? 'color: white;' : 'color: black;'" class="ki">{{ i }}: Key Image {{ ki }}</h5>
                <v-simple-table id="table">
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
                OutAddress: [],
                Keyimages: []
            },
            validHash: false,
            explorer
        }
    },
    async mounted() {

        if (this.txHash.length == 64)
        {
            await wasm.waitWASM()
            let result = await wasm.parseTx(this.txHash)
            /* eslint-disable no-console */
            this.tx = result[0]

            if (!this.tx.Keyimages)
            {
                this.tx.Keyimages = []
            }
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

.ki {
    margin-top: 2%;
}

.sub-title {
    text-align: left;
    margin-left: 15%;
}

.theme--dark.v-data-table {
    background-color: var(--v-primary-base);
}
.theme--light.v-data-table {
    background-color: var(--v-primary-base);
}

.tx-info {
    width: 28%;
    text-align: left;
    padding: 1%;
}

.extra {
    margin-left: 5%;
    margin-right: 5%;
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

    .ki {
        font-size: 0.7em;
        margin-left: 5%;
        margin-right: 5%;
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