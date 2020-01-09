/* eslint-disable no-console */
import * as explorer from './explorer'

const cache = {
    depth: 0,
    info: {},
    blocks: []
}
export async function init(depth = 100, n = 1000)
{
    let info = await explorer.getInfo()
    cache.info = info
    cache.depth = depth
    cache.n = n
    cache.blocks = await explorer.getBlocks(cache.info.topoheight, cache.depth, cache.n)
}

function createChart(title, name, categories = [], data = [])
{
    const options = {
        chart: {
          height: 500,
          type: 'line',
          background: '#424242',
          toolbar: {
              show: false
          },
          shadow: {
            enabled: false,
            color: 'red',
            top: 3,
            left: 2,
            blur: 3,
            opacity: 1
          },
        },
        theme: {
            mode: 'dark', 
            palette: 'palette1', 
            monochrome: {
                enabled: false,
                color: '#255aee',
                shadeTo: 'dark',
                shadeIntensity: 0.65
            },
        },
        stroke: {
          width: 7,
          curve: 'smooth'
        },
        xaxis: {
          type: 'string',
          categories: [],
          labels: {
              show: false
          }
        },
        title: {
          text: 'No Text',
          align: 'center',
          style: {
            fontSize: "24px"
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            gradientToColors: ['#FDD835'],
            shadeIntensity: 1,
            type: 'horizontal',
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100, 100, 100]
          },
        },
        markers: {
          size: 4,
          opacity: 0.9,
          colors: ["#FFA41B"],
          strokeColor: "#fff",
          strokeWidth: 2,
          hover: {
            size: 7,
          }
        }
    }

    options.title.text = title
    options.xaxis.categories = categories

    return {
        datas: [{
            name: name,
            data: data
        }],
        options: options
    }
}
/*
export function networkChart()
{
    const categories = []
    const datas = []
    let val = getNetwork()
    let diff = []
    let hashrate = []
    for (let i = 0; i < cache.depth; i++)
    {
        categories.push(explorer.formatSupply(val[i].height))
        diff.push(val[i].difficulty)
        hashrate.push(val[i].hashrate)
        
    }

    datas.push({name: "Difficulty", data: diff}, {name: "MH/s", data: hashrate})

    return createChart("Network Chart", "", categories, datas)
}*/

export function difficultyChart()
{    
    const categories = []
    const data = []
    let val = getDifficulty()
    
    for (let i = 0; i < cache.depth; i++)
    {
        categories.push(explorer.formatSupply(val[i].height))
        data.push(val[i].difficulty)
    }

    return createChart("Difficulty Chart", "Difficulty", categories, data)
}

export function rewardChart()
{    
    const categories = []
    const data = []
    let val = getRewards()
    
    for (let i = 0; i < cache.depth; i++)
    {
        categories.push(explorer.formatSupply(val[i].height))
        data.push(val[i].reward)
    }

    return createChart("Reward Chart", "Reward", categories, data)
}

export function hashrateChart()
{    
    const categories = []
    const data = []
    let val = getHashrates()
    
    for (let i = 0; i < cache.depth; i++)
    {
        categories.push(explorer.formatSupply(val[i].height))
        data.push(val[i].hashrate)
    }

    return createChart("Hashrate Chart", "MH/s", categories, data)
}

function getDifficulty()
{
    const array = []

    for (let i = 0; i < cache.depth; i++)
    {
        let block = cache.blocks[i]
        array.push({height: block.height, difficulty: block.difficulty})
    }

    return array
}

function getHashrates()
{
    const array = []

    for (let i = 0; i < cache.depth; i++)
    {
        let block = cache.blocks[i]
        array.push({height: block.height, hashrate: (block.difficulty/(cache.info.target*1000*1000)).toFixed(2)})
    }

    return array
}

function getRewards()
{
    const array = []

    for (let i = 0; i < cache.depth; i++)
    {
        let block = cache.blocks[i]
        array.push({height: block.height, reward: block.reward})
    }

    return array
}

/*
function getNetwork()
{
    const array = []

    for (let i = 0; i < cache.depth; i++)
    {
        let block = cache.blocks[i]
        array.push({height: block.height, difficulty: block.difficulty, hashrate: (block.difficulty/(cache.info.target*1000*1000)).toFixed(2)})
    }

    return array
}*/