package main

import "time"
import "fmt"
import "encoding/hex"
import "encoding/json"
import "syscall/js"

import "github.com/deroproject/derosuite/block"
import "github.com/deroproject/derosuite/crypto"
import "github.com/deroproject/derosuite/globals"
import "github.com/deroproject/derosuite/transaction"
import "github.com/deroproject/derosuite/structures"

type txinfo struct {
	//Hex          string // raw tx
	Height       string // height at which tx was mined
	Depth        int64
	Timestamp    uint64 // timestamp
	Age          string //  time diff from current time
	Block_time   string // UTC time from block header
	Epoch        uint64 // Epoch time
	In_Pool      bool   // whether tx was in pool
	Hash         string // hash for hash
	PrefixHash   string // prefix hash
	Version      int    // version of tx
	Size         string // size of tx in KB
	Sizeuint64   uint64 // size of tx in bytes
	Fee          string // fee in TX
	Feeuint64    uint64 // fee in atomic units
	In           int    // inputs counts
	Out          int    // outputs counts
	Amount       string
	CoinBase     bool     // is tx coin base
	Extra        string   // extra within tx
	Keyimages    []string // key images within tx
	OutAddress   []string // contains output secret key
	OutOffset    []uint64 // contains index offsets
	Type         string   // ringct or ruffct ( bulletproof)
	ValidBlock   string   // the tx is valid in which block
	InvalidBlock []string // the tx is invalid in which block
	Skipped      bool     // this is only valid, when a block is being listed
	Ring_size    int
	Ring         [][]globals.TX_Output_Data

	TXpublickey string
	PayID32     string // 32 byte payment ID
	PayID8      string // 8 byte encrypted payment ID


	Proof_address string // address agains which which the proving ran
	Proof_index  int64  // proof satisfied for which index
	Proof_amount string // decoded amount 
	Proof_PayID8 string // decrypted 8 byte payment id
	Proof_error  string // error if any while decoding proof

}

type block_info struct {
	Major_Version uint64
	Minor_Version uint64
	Height        int64
	TopoHeight    int64
	Depth         int64
	Timestamp     uint64
	Hash          string
	Tips          []string
	Nonce         uint64
	Fees          string
	Reward        string
	Size          string
	Block_time    string // UTC time from block header
	Epoch         uint64 // Epoch time
	Outputs       string
	Mtx           txinfo
	Txs           []txinfo
	Orphan_Status bool
	SyncBlock     bool // whether the block is sync block
	Tx_Count      int64
	Difficulty	  string
}

var done = make(chan struct{})

func main() {
	js.Global().Set("deserializeTx", js.FuncOf(deserializeTx))
	js.Global().Set("getMinerTxFromBlob", js.FuncOf(getMinerTxFromBlob))
	js.Global().Set("loadBlock", js.FuncOf(loadBlock))
	js.Global().Set("testWASM", js.FuncOf(test))
	<-done
}

func test(this js.Value, inputs []js.Value) interface{} {
	return "Hello from WASM !!"
}

func deserializeTx(this js.Value, inputs []js.Value) interface{} {
	var infos []txinfo
	var tx_result structures.GetTransaction_Result
	
	json.Unmarshal([]byte(inputs[0].String()), &tx_result)
	
	for i := 0; i < len(tx_result.Txs_as_hex); i++ {
	
		var tx transaction.Transaction
		var info txinfo

		if  len(tx_result.Txs_as_hex[i]) < 50 {
			return js.Null()
		}
	
		tx_bin, _ := hex.DecodeString(tx_result.Txs_as_hex[i])
		tx.DeserializeHeader(tx_bin)
	
		// fill as much info required from headers
		if tx_result.Txs[i].In_pool {
			info.In_Pool = true
		} else {
			info.Height = fmt.Sprintf("%d", tx_result.Txs[i].Block_Height)
		}
	
		for x := range tx_result.Txs[i].Output_Indices {
			info.OutOffset = append(info.OutOffset, tx_result.Txs[i].Output_Indices[x])
		}
	
		if tx.IsCoinbase() { // fill miner tx reward from what the chain tells us
			info.Amount = fmt.Sprintf("%.012f", float64(uint64(tx_result.Txs[i].Reward))/1000000000000)
		}
	
		info.ValidBlock = tx_result.Txs[i].ValidBlock
		info.InvalidBlock = tx_result.Txs[i].InvalidBlock
	
		info.Ring = tx_result.Txs[i].Ring
	
		load_tx_info_from_tx(&info, &tx)
		
		infos = append(infos, info)
	}
	
	res, err := json.Marshal(infos)

	if err != nil {
		fmt.Println(err)
		return js.Null()
	}

	return js.ValueOf(string(res))
}

func getMinerTxFromBlob(this js.Value, inputs []js.Value) interface{} {
	block_blob := inputs[0].String()
	var block block.Block
	block_bin, err := hex.DecodeString(block_blob)
	
	if err != nil {
		fmt.Println(err)
		return js.Null()
	}
		
	block.Deserialize(block_bin)
	
	return js.ValueOf(block.Miner_TX.GetHash().String())
}

//js should send response from /getblock AND /gettransactions
func loadBlock(this js.Value, inputs []js.Value) interface{} {
	fmt.Println("loadBlock called")
	
	var blinfo block_info
	var block_result structures.GetBlock_Result
	var tx_result structures.GetTransaction_Result
	
	json.Unmarshal([]byte(inputs[0].String()), &block_result)
	json.Unmarshal([]byte(inputs[1].String()), &tx_result)
	
	
	var block block.Block
	block_bin, err := hex.DecodeString(block_result.Blob)
	
	if err != nil {
		fmt.Println(err)
		return js.Null()
	}

	blinfo.TopoHeight = block_result.Block_Header.TopoHeight
	blinfo.Height = block_result.Block_Header.Height
	blinfo.Depth = block_result.Block_Header.Depth
	blinfo.Block_time = time.Unix(int64(block_result.Block_Header.Timestamp), 0).Format("2006-01-02 15:04:05")
	blinfo.Epoch = block_result.Block_Header.Timestamp
	blinfo.Outputs = fmt.Sprintf("%.03f", float32(block_result.Block_Header.Reward)/1000000000000.0)
	blinfo.Size = "N/A"
	blinfo.Hash = block_result.Block_Header.Hash
	blinfo.Tips = block_result.Block_Header.Tips
	blinfo.Orphan_Status = block_result.Block_Header.Orphan_Status
	blinfo.SyncBlock = block_result.Block_Header.SyncBlock
	blinfo.Nonce = block_result.Block_Header.Nonce
	blinfo.Major_Version = block_result.Block_Header.Major_Version
	blinfo.Minor_Version = block_result.Block_Header.Minor_Version
	blinfo.Reward = fmt.Sprintf("%.03f", float32(block_result.Block_Header.Reward)/1000000000000.0)
	blinfo.Tx_Count = block_result.Block_Header.TXCount
	blinfo.Difficulty = block_result.Block_Header.Difficulty
	blinfo.Timestamp = block_result.Block_Header.Timestamp
	
	block.Deserialize(block_bin)
	
	fees := uint64(0)
	size := uint64(0)
	
	for i := 0; i < len(tx_result.Txs_as_hex); i++ {
	
		var tx transaction.Transaction
		var info txinfo

		if  len(tx_result.Txs_as_hex[i]) < 50 {
			fmt.Println("Something is wrong! hex < 50")
			continue
		}
	
		tx_bin, _ := hex.DecodeString(tx_result.Txs_as_hex[i])
		tx.DeserializeHeader(tx_bin)
	
		// fill as much info required from headers
		if tx_result.Txs[i].In_pool {
			info.In_Pool = true
		} else {
			info.Height = fmt.Sprintf("%d", tx_result.Txs[i].Block_Height)
		}
	
		for x := range tx_result.Txs[i].Output_Indices {
			info.OutOffset = append(info.OutOffset, tx_result.Txs[i].Output_Indices[x])
		}
	
		if tx.IsCoinbase() { // fill miner tx reward from what the chain tells us
			info.Amount = fmt.Sprintf("%.012f", float64(uint64(tx_result.Txs[i].Reward))/1000000000000)
		}
	
		info.ValidBlock = tx_result.Txs[i].ValidBlock
		info.InvalidBlock = tx_result.Txs[i].InvalidBlock
	
		info.Ring = tx_result.Txs[i].Ring
	
		load_tx_info_from_tx(&info, &tx/*, block_result*/)
		
		if info.ValidBlock != block.GetHash().String() {       // track skipped status
			info.Skipped = true
		}
		
		if (i == 0) {
			blinfo.Mtx = info
		} else {
			blinfo.Txs = append(blinfo.Txs, info)
		}
		fees += info.Feeuint64
		size += info.Sizeuint64
	}

	blinfo.Fees = fmt.Sprintf("%.03f", float32(fees)/1000000000000.0)
	blinfo.Size = fmt.Sprintf("%.03f", float32(size)/1024)
	
	var res []byte
	res, err = json.Marshal(blinfo)
	
	return js.ValueOf(string(res))
}

func load_tx_info_from_tx(info *txinfo, tx *transaction.Transaction/*, blinfo block_info*/) {
	info.Hash = tx.GetHash().String()
	info.PrefixHash = tx.GetPrefixHash().String()
	info.Size = fmt.Sprintf("%.03f", float32(len(tx.Serialize()))/1024)
	info.Sizeuint64 = uint64(len(tx.Serialize()))
	info.Version = int(tx.Version)
	info.Extra = fmt.Sprintf("%x", tx.Extra)
	info.In = len(tx.Vin)
	info.Out = len(tx.Vout)

	if tx.Parse_Extra() {

		// store public key if present
		if _, ok := tx.Extra_map[transaction.TX_PUBLIC_KEY]; ok {
			info.TXpublickey = tx.Extra_map[transaction.TX_PUBLIC_KEY].(crypto.Key).String()
		}

		// store payment IDs if present
		if _, ok := tx.PaymentID_map[transaction.TX_EXTRA_NONCE_ENCRYPTED_PAYMENT_ID]; ok {
			info.PayID8 = fmt.Sprintf("%x", tx.PaymentID_map[transaction.TX_EXTRA_NONCE_ENCRYPTED_PAYMENT_ID].([]byte))
		} else if _, ok := tx.PaymentID_map[transaction.TX_EXTRA_NONCE_PAYMENT_ID]; ok {
			info.PayID32 = fmt.Sprintf("%x", tx.PaymentID_map[transaction.TX_EXTRA_NONCE_PAYMENT_ID].([]byte))
		}

	}

	if !tx.IsCoinbase() {
		info.Fee = fmt.Sprintf("%.012f", float64(tx.RctSignature.Get_TX_Fee())/1000000000000)
		info.Feeuint64 = tx.RctSignature.Get_TX_Fee()
		info.Amount = "?"

		info.Ring_size = len(tx.Vin[0].(transaction.Txin_to_key).Key_offsets)
		for i := 0; i < len(tx.Vin); i++ {
			info.Keyimages = append(info.Keyimages, fmt.Sprintf("%s ring members %+v", tx.Vin[i].(transaction.Txin_to_key).K_image, tx.Vin[i].(transaction.Txin_to_key).Key_offsets))
		}
	} else {
		info.CoinBase = true
		info.In = 0
	}

	for i := 0; i < len(tx.Vout); i++ {
		info.OutAddress = append(info.OutAddress, tx.Vout[i].Target.(transaction.Txout_to_key).Key.String())
	}

	// if outputs cannot be located, do not panic
	// this will be the case for pool transactions
	if len(info.OutAddress) != len(info.OutOffset) {
		info.OutOffset = make([]uint64, len(info.OutAddress), len(info.OutAddress))
	}

	switch tx.RctSignature.Get_Sig_Type() {
	case 0:
		info.Type = "RingCT/0"
	case 1:
		info.Type = "RingCT/1 MG"
	case 2:
		info.Type = "RingCT/2 Simple"
	case 3:
		info.Type = "RingCT/3 Full bulletproof"
	case 4:
		info.Type = "RingCT/4 Simple Bulletproof"
	}

	/*if !info.In_Pool { // find the age of block and other meta
		info.Age = blinfo.Age
		info.Block_time = blinfo.Block_time
		info.Epoch = blinfo.Epoch
		info.Timestamp = blinfo.Epoch
		info.Depth = blinfo.Depth
	}*/
}