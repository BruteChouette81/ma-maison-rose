//file to manage nfts


import './css/nftbox.css'
import {useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { post, put } from 'aws-amplify/api';
import { uploadData} from 'aws-amplify/storage'
import Receipt from './receipt';

const MarketAddress = '0x710005797eFf093Fa95Ce9a703Da9f0162A6916C'; // goerli new test contract
const nftAddress = '0xa244B3e1e6Bd2ccf1D226F3E269D0Af88Ef86CEE'

const tags = ["Vases",
    "Casse-tête",
    "Soldes",
    "Produits corporels",
    "Accessoires",
    "Bouteilles & thermos",
    "Papeterie",
    "Cuisine",
    "Plantes, jardinage etc.",
    "Bougies et parfums d'ambiance",
    "Déco",
    "Linge de maison"]

let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});


function NftBox (props) {
    //see in bigger using modal
   
    const [id, setId] = useState()
    const [market, setMarket] = useState()
    const [credits, setCredits] = useState()
    const [amm, setAmm] = useState()
    const [dds, setDds] = useState()
    const [seller, setSeller] = useState()
    const [price, setPrice] = useState(0)
    const [total, setTotal] = useState(0)
    const [state, setState] = useState("ontario")
    const [quebec, setQuebec] = useState(false)
    const [tax, setTax] = useState(0)
    const [taxprice, setTaxprice] = useState(0.0)
    const [account, setAccount] = useState()
    const [pay, setPay] = useState()
    const [did, setDid] =useState()
    const [image, setImage] = useState()
    const [tokenId, setTokenId] = useState()
    const [signer, setSigner] = useState()
    const [currency, setCurrency] = useState()
    const [pk, setPk] = useState()
    const [buyloading, setBuyloading] = useState(false)
    const [itemSold, setItemSold] = useState(false)
    const [marketLoaded, setMarketLoaded] = useState(false)
    const [marketLoadedItem, setMarketLoadedItem] = useState({})
    const [notload, setNotload] = useState(false)
    

    const [purchasing, setPurchasing] = useState(false)

    const cancelPurchase = () => {
        setPurchasing(false)
    }


    const getItem = async () => {
        //const ddsc = await configureMarket(haswallet, wallet)
    
        //let credits = await ddsc?.credits()
        //console.log(credits)        
        //only real items
        console.log(props.dds)

        let item = await props.dds.items(parseInt(props.id + 1))
        console.log(item)
        let newItem = {}

        if(item.sold) {
            console.log("SOLD")
            setItemSold(true)
            //alert("item already sold, redirecting to market!")
            //window.location.replace("/market")
        }

        else {
            //props.setnumloaded((props.numloaded + 1))
            var data = {
                body: {
                    address: item.seller.toLowerCase(),
                }
            }

            var url = "/getItems"

            //console.log(typeof(item))
            //console.log(item)
            
            post({apiName:'serverv2', path:url, options:{body:data.body}}).response.then((res) => res.body.json()).then((response) => {
                console.log(response)
                for(let i=0; i<=response.ids.length; i++) { //loop trought every listed item of an owner 
                    if (response.ids[i] == item.itemId - 1) { // once you got the item we want to display:
                                newItem.itemId = item.itemId
                                newItem.tokenId = item.tokenId
                                newItem.price = item.price
                                newItem.seller = item.seller
                                newItem.name = response.names[i] //get the corresponding name
                                newItem.score = response.scores[i] //get the corresponding score
                                newItem.tag = response.tags[i] //get the corresponding tag

                                if(response.descriptions[i].length > 40) {
                                    var middle = Math.floor(response.descriptions[i].length / 2);
                                    var before = response.descriptions[i].lastIndexOf(' ', middle);
                                    var after = response.descriptions[i].indexOf(' ', middle + 1);

                                    if (middle - before < after - middle) {
                                        middle = before;
                                    } else {
                                        middle = after;
                                    }

                                    var s1 = response.descriptions[i].substr(0, middle);
                                    var s2 = response.descriptions[i].substr(middle + 1);
                                    newItem.description = [s1, s2]
                                } else {
                                    newItem.description = response.descriptions[i]
                                }
                                
                               
                                newItem.image = response.image[i]
                    }
                }
            })

            
        }
        
        return newItem
    
    }

    const deleteItems = async () => {
         //connect to market inside the function to save time 
        //const marketContract = connectContract(MarketAddress, abi.abi)
        try {
            var config = {
                body: {
                    owner: seller,
                    itemId: id
                }
            };
            var url = "/deleteItem"

            post('serverv2', url, config).then((response) => {
                console.log(response)
                if (response.status === 60) {
                    alert("Unable to delete Item (" + id + "). Error code - 60")
                } else {
                    alert("Item: " + id + " has been sucessfully deleted!")
                }
            }).catch((e) => {
                alert("Unable to delete Item (" + id + "). Error code - 60")
                console.log(e)
            })

            
        }
        catch(error) {
            alert("Unable to delete Item (" + id + "). Error code - 60")
            console.log(error)
        }
    }


    const calculateTax = () => {
        //fct to calculate taxes
    }

    const purchase = async () => {
        //crypto purchase
    
    }

    function setS3Config(bucket, level) {
        Amplify.configure({
            ...Amplify.getConfig(),
            Storage: {
                S3: {
                    bucket: bucket,
                    level: level,
                    region: "ca-central-1",
                    identityPoolId: 'ca-central-1:85ca7a33-46b1-4827-ae75-694463376952'
                }
            }
            
        })
    }


    const realPurchase = async () => {
        try {
            //setBuyloading(true)
            const url = '/uploadFile';
            var config = {
                body: {
                    account: account.toLowerCase(),
                    realPurchase: [parseInt(tokenId), id]

                }
            };
            setS3Config("didtransfer", "public");

            put('serverv2', url, config).then((response) => {
                console.log(response)
                uploadData(`${seller.toLowerCase()}/${account.toLowerCase()}.txt`, window.localStorage.getItem("did")).then((results) => { // add ".png"
                    console.log(results)
                    
                    setBuyloading(false)
                    return results
                });

                
            })

            //alert("Sucessfully bought NFT n." + id + " . Congrats :)")
        } catch (error){
            //setBuyloading(false)
            alert("Unable to connect properly with the blockchain. Make sure your account is connected. Error code - 2")
            console.log(error)
            return error
            //console.log(seller)
        }
    }

    useEffect(() => {
       
        
            if(props.isMarket) { //instaview
                setMarketLoaded(true)
                setId(props.id + 1)
                console.log(props.id)
                if (!props.displayItem) {
                    setPk(props.password)
                    setAccount(props.account)
                    setSigner(props.signer)
                }
                
                const newItem = getItem()
                newItem.then((res) => {
                    if (props.catID === 3) {
                        setTokenId(res.tokenId)
                        console.log(id)
                        console.log(res.seller)
                        setSeller(res.seller)
                        setPrice(res.price)
                        setImage(res.image)
                        setMarketLoadedItem(res)
                    } else {
                        if (res.tag === tags[props.catID]) {
                            setTokenId(res.tokenId)
                            console.log(id)
                            console.log(res.seller)
                            setSeller(res.seller)
                            setPrice(res.price)
                            setImage(res.image)
                            setMarketLoadedItem(res)
                        } else {
                            setNotload(true)
                        }
                    }
                })
            }

            else { //alone
                
                setId(props.id)
                setPrice(props.price) /// (1 - 0.029) + 4.6*100000
                console.log(props.price)
                setSeller(props.seller)
                setTokenId(props.tokenId)
                setMarket(props.market)
                setCredits(props.credits)
                setDds(props.dds)
                setPurchasing(false)
                setAccount(props.account)
                setPay(props.pay)
                setDid(props.did)
                setImage(props.image)
                setSigner(props.signer)
                setCurrency(window.localStorage.getItem("currency"))
                if (props.pk) {
                    setPk(props.pk)
                }
                else {
                    //console.log(props.password)
                    setPk(props.password)
                }
                
                setAmm(props.amm)
            }
    
    }, []) //setId

    /*<p>{window.localStorage.getItem("language") == "en" ? "Seller:" : "Vendeur:" } <a href={`/Seller/${marketLoadedItem?.seller}`} >{marketLoadedItem?.seller?.slice(0,7) + "..."}</a></p>
                    
                    <p>Description: {marketLoadedItem?.description?.length == 2 ? (<div>{marketLoadedItem?.description[0]} <br /> {marketLoadedItem?.description[1]}</div>) : marketLoadedItem?.description}</p>
                     {props.displayItem ? (<button onClick={()=>{alert("Vous devez créer votre compte afin de pouvoir acheter un item!")}} type="button" class="btn btn-secondary" >{window.localStorage.getItem("language") == "en" ? "Purchase" : "Acheter" }</button>) : (<button onClick={calculateTax} type="button" class="btn btn-secondary">{window.localStorage.getItem("language") == "en" ? "Purchase" : "Acheter" }</button>)} */


        return(
            notload ? "" : 
            <div>
                { purchasing ? props.real ? (
                    <Receipt quebec={quebec} state={state} subtotal={price} total={price} taxprice={taxprice} tax={tax} seller={seller} image={image} account={account} contract={credits} dds={dds} amm={amm} signer={signer} id={id} pay={pay} did={did} pk={pk} purchase={realPurchase} cancel={cancelPurchase} buyloading={buyloading} />
                ) : ( <Receipt quebec={quebec} state={state} subtotal={price} total={price} taxprice={taxprice} tax={tax} seller={seller} image={image} account={account} contract={credits} market={market} amm={amm} signer={signer} id={id} pay={pay} did={did} pk={pk} purchase={purchase} cancel={cancelPurchase} /> ) : 
                itemSold ? "" :  marketLoaded ? props.mynft ? marketLoadedItem?.seller === account ? (<div class="nftbox">
                <a href={marketLoadedItem?.image}><img id='itemimg' src={marketLoadedItem?.image} alt="" /></a>
                <h4><a href="">{marketLoadedItem?.name}</a></h4>
                <h4>ID: {id}</h4>
                <h6>current Price: {currency == "CAD" ? USDollar.format((marketLoadedItem?.price/100000) / (1 - 0.029) + 4.74) : USDollar.format((marketLoadedItem?.price/100000) / (1 - 0.029) + 4.74) } {currency}</h6>
                
                <p>description: {marketLoadedItem?.description?.length == 2 ? (<div>{marketLoadedItem?.description[0]} <br /> {marketLoadedItem?.description[1]}</div>) : marketLoadedItem?.description}</p>
                <button onClick={deleteItems} type="button" class="btn btn-secondary">Delete</button>
    
            </div>) : "":(<div class="col">
                <div class="nftbox">
                <a href={marketLoadedItem?.image}><img id='itemimg' src={marketLoadedItem?.image} alt="" /></a>
                    <br />
                    <br />
                    <h4><a href={"/item/" + (id - 1)}>{marketLoadedItem?.name}</a></h4>
                    
                    <h6>{window.localStorage.getItem("language") == "en" ? "current Price:" : "Prix:" } {currency == "CAD" ? USDollar.format((marketLoadedItem?.price/100000) / (1 - 0.029) + 4.74) : USDollar.format((marketLoadedItem?.price/100000) / (1 - 0.029) + 4.74) } {currency}</h6>
                    
                    
                    {props.displayItem ? (<button onClick={()=>{window.location.replace("/item/" + (id - 1))}} type="button" class="btn btn-secondary" >{window.localStorage.getItem("language") == "en" ? "Purchase" : "Acheter" }</button>) : props.numreal == id ? (<button onClick={()=>{window.location.replace("/item/" + (id - 1))}} type="button" class="btn btn-secondary" >{window.localStorage.getItem("language") == "en" ? "Purchase" : "Acheter" }</button>) : (<button onClick={calculateTax} type="button" class="btn btn-secondary">{window.localStorage.getItem("language") == "en" ? "Purchase" : "Acheter" }</button>)}
                    

                </div>
            </div>) : (
                    <div class="col">
                        <div class="nftbox">
                        <a href={image}><img id='itemimg' src={image} alt="" /></a>
                            <br />
                            <br />
                            <h4><a href={"/item/" + (props.id -1)}>{props.name}</a></h4>
                            <h6>{window.localStorage.getItem("language") == "en" ? "current Price:" : "Prix:" } {currency == "CAD" ? USDollar.format((props.price/100000) / (1 - 0.029) + 4.74) : USDollar.format((props.price/100000) / (1 - 0.029) + 4.74) } {currency}</h6>
                            <p>{window.localStorage.getItem("language") == "en" ? "Seller:" : "Vendeur:" } <a href={`/Seller/${seller}`} >{props.seller?.slice(0,7) + "..."}</a></p>
                            <p>Description: {props.description}</p>
                           
                            
        
                        </div>
                    </div>
                    
                )
                }
            </div>
           
        ) //onClick={purchase} onClick={calculateTax("quebec", price)} onClick={calculateTax}
    
   
}

export default NftBox;

