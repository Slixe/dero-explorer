/* eslint-disable no-console */
var daemon = 'https://wallet.dero.io'

export function getInfo()
{
    return postData("get_info")
}

export function loadTxs(txsHashes)
{
    const body = {
        txs_hashes: []
    }
    body.txs_hashes.push(txsHashes)
    console.log(body)

    return fetch("https://wallet.dero.io/gettransactions", {
        method: "POST",
        mode: "cors",
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json; charset=utf-8",
            'Connection': 'close'
        },
        body: JSON.stringify(body)
    }).then(result => result)
}

export async function loadBlocks(pos, size)
{
    const blocks = []

    for (let i = 0; i < size; i++)
    {
        let block = await loadBlock(pos - i)
        if (block) {
            blocks.push(block)
        }
    }

    return blocks
}

export function loadBlock(blockHash)
{ // if block Hash isn't 64, so the parameter is a height, else, the hex blob
    return postData("getblock", blockHash.length != 64 ? {height: parseInt(blockHash)} : {hash: blockHash})
}

export function getTxsPool()
{
    return postData("gettxpool")
}

export function postData(method, params)
{
    if (!params)
        params = {}

    return fetch(daemon + "/json_rpc", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({jsonrpc: '2.0', id:'1', method: method, params: params}),
    }
    ).then(result => result.json()).then(result => result.result);
}