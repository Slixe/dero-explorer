<template>
    <div id="tx">
        <div id="main">
            <h2 class="title">Tx Hash: <small class="bh">{{tx.Hash}}</small></h2>
            <h5 class="prefix-tx">Tx Prefix Hash: <small>{{tx.PrefixHash}}</small></h5>
            <h5 class="prefix-tx">Block (valid): <small>{{tx.ValidBlock}}</small></h5>
            <h5 class="prefix-tx">Tx Public Key: <small>{{tx.TXpublickey}}</small></h5>
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
    }
}
</script>
<style scoped>
.title {
    text-align: left;
    margin-left: 15%;
}

.bh {
    font-size: 1rem;
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
</style>