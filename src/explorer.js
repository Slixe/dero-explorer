/* eslint-disable no-console */
var daemon = 'https://wallet.dero.io'

export function blockDate(timestamp) {
    let date = new Date(timestamp * 1000);
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    let seconds = "0" + date.getSeconds();
    let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
}

export function formatSupply(supply) {
    if (!supply)
        return 0
    return supply.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}

export function getInfo()
{
    return postData("get_info")
}

export function loadTxs(txsHashes = [])
{
    const body = {
        txs_hashes: txsHashes
      }
      console.log(body)
    return fetch(daemon + "/gettransactions", {
        method: "POST",
        body: JSON.stringify(body)
    }).then(result => result.json())
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