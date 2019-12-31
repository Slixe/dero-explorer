<template>
    <div id="index">
        <div id="boxes">
            <v-card class="mx-left" dark width="375px" elevation="10">
                <v-card-title>NETWORK INFORMATION</v-card-title>
                <v-card-text>
                    <ul class="net-info">
                        <li>Average Block Time: {{ info.averageblocktime50 }}s</li>
                        <li>Difficulty: {{ formatSupply(info.difficulty) }} </li>
                        <li>Hashrate: {{ formatSupply((info.difficulty/(info.target*1000*1000)).toFixed(2)) }} MH/s</li>
                        <li>Current Height: {{ formatSupply(info.height) }} </li>
                        <li>Median Block Size: {{ formatSupply(info.median_block_size/1000) }} kB</li>
                        <li>Total Supply: {{ formatSupply(info.total_supply) }} DERO</li>
                    </ul>
                </v-card-text>
            </v-card>

            <v-card class="mx-auto" dark width="375px" elevation="10">
                <v-card-title>MEM POOL</v-card-title>
                <v-card-subtitle class="subtitle">({{ info.tx_pool_size }} transactions)</v-card-subtitle>
                <v-card-text>
                    <ul v-for="(tx, i) in txs" :key="i">
                        <li>{{ tx }}</li>
                    </ul>
                </v-card-text>
            </v-card>

            <v-card dark width="375px" elevation="10">
                <v-card-title>PRICE INFORMATION</v-card-title>
                <v-card-text>
                    <ul>
                        <li>Rank: {{ formatSupply(coinGecko.market_cap_rank) }}</li>
                        <li>Market Cap: {{ formatSupply(coinGecko.marketcap) }}</li>
                        <li>Price: {{ coinGecko.priceUSD }} USD / {{ coinGecko.priceBTC }} BTC</li>
                        <li>ATH: {{ coinGecko.ATHpriceUSD }} USD / {{ coinGecko.ATHpriceBTC }} BTC</li>
                        <li>ATL: {{ coinGecko.ATLpriceUSD }} USD / {{ coinGecko.ATLpriceBTC }} BTC</li>
                        <li>24h Volume: {{ formatSupply(coinGecko.volume24hUSD) }} USD / {{ formatSupply(coinGecko.volume24hBTC) }} BTC</li>
                    </ul>
                </v-card-text>
            </v-card>
        </div>

        <div> <!-- Latest blocks -->
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
    </div>
</template>

<script>
import * as explorer from '../explorer.js';

export default {
    data() {
        return { 
            txs: [],
            info: {},
            blocks: [],
            coinGecko: {
                priceUSD: 0,
                priceBTC: 0,
                volume24hUSD: 0,
                volume24hBTC: 0,
                ATHpriceUSD: 0,
                ATHpriceBTC: 0,
                ATLpriceUSD: 0,
                ATLpriceBTC: 0,
                marketcap: 0,
                market_cap_rank: 0,
            }
        }
    },
    async mounted() {
            /* eslint-disable no-console */
          let pool = await explorer.getTxsPool()

          if (pool.txs)
            this.txs = pool.txs
          else
            this.txs = ["No unconfirmed transactions !"]

          this.info = await explorer.getInfo()
          this.blocks = await explorer.loadBlocks(this.info.topoheight, 15)
          
          fetch("https://api.coingecko.com/api/v3/coins/dero?localization=en&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false")
            .then(result => result.json()).then(result => {
                this.coinGecko.priceUSD = result.market_data.current_price.usd
                this.coinGecko.priceBTC = result.market_data.current_price.btc
                this.coinGecko.volume24hUSD = result.market_data.total_volume.usd
                this.coinGecko.volume24hBTC = result.market_data.total_volume.btc
                this.coinGecko.ATHpriceUSD = result.market_data.ath.usd
                this.coinGecko.ATHpriceBTC = result.market_data.ath.btc
                this.coinGecko.ATLpriceUSD = result.market_data.atl.usd
                this.coinGecko.ATLpriceBTC = result.market_data.atl.btc
                this.coinGecko.marketcap = result.market_data.market_cap.usd
                this.coinGecko.market_cap_rank = result.market_data.market_cap_rank
            })
    },
    methods: {
        blockDate(timestamp) {
            let date = new Date(timestamp * 1000);
            let hours = date.getHours();
            let minutes = "0" + date.getMinutes();
            let seconds = "0" + date.getSeconds();
            let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
            return formattedTime;
        },
        formatSupply(supply) {
            if (!supply)
                return 0
            return supply.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
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
    display: flex;
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

li {
    list-style: none;
}

.subtitle {
    text-align: left;
}
</style>