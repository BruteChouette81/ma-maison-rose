import { useState, useEffect } from "react";
import NftBox from "./nfts";
import { ethers } from "ethers";
import DDSABI from '../abis/DDS.sol/DDS.json'
import { API } from "aws-amplify";
import './css/market.css'
import './css/nftbox.css'
import ReactLoading from "react-loading";
const type = "spin"
const color = "#0000FF"


const DDSAddress = '0xa244B3e1e6Bd2ccf1D226F3E269D0Af88Ef86CEE'


const getContract = () => { //for Imperial Account
    
    const provider = new ethers.providers.InfuraProvider("sepolia")
    console.log(provider)
    const contract = new ethers.Contract(DDSAddress, DDSABI, provider);
    return contract 
}




function InstaView() {
    const [numrealItems, setNumRealItems] = useState(0);
    const [dds, setDds] = useState();
    const [catID, setCatid] = useState()

    function SideBar() {
        const onChangeCatID = (newId) => {
            setCatid(newId)
        }
        //component for the side bar, including tags
        return (
            <div class="sideBar">
                <div class="container" >
                    <div class="col " >
                        <div class="row " >
                            <h5 style={{'color':'#664346'}}>Parcourir par catégorie</h5>
                            <button type="button" class="btn btn-link"  onClick={()=> {onChangeCatID("")}}>Tous les articles</button>
                        <button type="button" class="btn btn-link" onClick={()=> {onChangeCatID("Vases")}}>Vases</button>
                        <button type="button" class="btn btn-link"  onClick={()=> {onChangeCatID("Casse-tête")}}>Casse-tête</button>
                        <button type="button" class="btn btn-link"  onClick={()=> {onChangeCatID("Soldes")}}>Soldes</button>
                        <button type="button" class="btn btn-link" onClick={()=> {onChangeCatID("Produits corporels")}}>Produits corporels</button>
                        <button type="button" class="btn btn-link"  onClick={()=> {onChangeCatID("Accessoires")}}>Accessoires</button>
                        <button type="button" class="btn btn-link"  onClick={()=> {onChangeCatID("Bouteilles & thermos")}}>Bouteilles & thermos</button>
                        <button type="button" class="btn btn-link" onClick={()=> {onChangeCatID("Papeterie")}}>Papeterie</button>
                        <button type="button" class="btn btn-link" onClick={()=> {onChangeCatID("Cuisine")}}>Cuisine</button>
                        <button type="button" class="btn btn-link" onClick={()=> {onChangeCatID("Plantes, jardinage etc.")}}>Plantes, jardinage etc.</button>
                        <button type="button" class="btn btn-link" onClick={()=> {onChangeCatID("Bougies et parfums d'ambiance")}}>Bougies et parfums d'ambiance</button>
                        <button type="button" class="btn btn-link" onClick={()=> {onChangeCatID("Déco")}}>Déco</button>
                        <button type="button" class="btn btn-link" onClick={()=> {onChangeCatID("Linge de maison")}}>Linge de maison</button>                    
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    /*let timeo = 2000;
    const based = 1; //minimum item loading
    const increasingby = 5; //number of more item being load each "load more "
    //let chunk_number = 0;

    const [chunk_number, setChunk_number] = useState(0);

    const loadmore = () => {
        setChunk_number(chunk_number+1)

    }

    useEffect(() => {
        const ddsc = getContract()
        setDds(ddsc)

        const loadInstaItems = async() => {
            //let realList = []
            console.log(ddsc.filters)
            const numReal = await ddsc?.functions.itemCount()
            setNumRealItems(numReal)
        }
        loadInstaItems().then(() => {
            console.log("Done")
        })
        let numtime = 0;
        //let maxtime = 2;
        const timedOutReload = () => {
            setChunk_number(numtime+1)
            if(numtime < 4) { //
                    console.log("reloading")
                    setTimeout(timedOutReload, timeo)
                    numtime+=1;
            } else {
                console.log(chunk_number)
            }
        }
        setTimeout(timedOutReload, timeo);
        //setRealItems(listofDis)
        
    }, [])*/
    const bootAllItems = () =>{
        var data = {
            body: {
                address: "0x3190b9754f22dd2b0514feff6bd299ee7514c777",
            }
        }
        var url = "/getItems"
        API.post('serverv2',  url, data).then((response) => {
            console.log(response)
            setNumRealItems({
                "names": response.names,
                "descriptions": response.descriptions,
                "images": response.image,
                "ids": response.ids,
                "prices": response.prices,
                "quantities": response.scores,
                "tags": response.tags
            })
        })
    }

    useEffect(()=> {
       
        bootAllItems()
       
    }, [setNumRealItems])
    /*{ numrealItems > 0 ? Array.from({ length: based }, (_, k) =>  (<NftBox id={k} catID={3} real={true} displayItem={true} isMarket={true} dds={dds}/> )) : ""}
            {chunk_number > 0 ? Array.from({ length: chunk_number}, (_, i) => Array.from({ length: based + (increasingby * (i + 1)) }, (_, k) => k <=  (based-1) + (increasingby * i) || k >= numrealItems ? "" : (<NftBox id={k} catID={3} real={true} displayItem={true} isMarket={true} dds={dds}/> ) )) : ""} 
               { numrealItems > 0 ? Array.from({ length: based }, (_, k) =>  (<NftBox id={k} catID={3} real={true} displayItem={true} isMarket={true} dds={dds}/> )) : ""}
                {chunk_number > 0 ? Array.from({ length: chunk_number}, (_, i) => Array.from({ length: based + (increasingby * (i + 1)) }, (_, k) => k <=  (based-1) + (increasingby * i) || k >= numrealItems ? "" : (<NftBox id={k} catID={3} real={true} displayItem={true} isMarket={true} dds={dds}/> ) )) : ""}
                <button onClick={loadmore} class="btn btn-primary btn-lg" style={{"float": "bottom"}}>En voir davantage!</button>*/
    return (
        <div class="container">
        <div class="row">
        <div class="col-2">
            <SideBar/>
        </div>
        <div class="col-10">
            
        <div class="instaView">
            <div class="row">
                <div class="col">
                    <p>{catID}</p>
                {numrealItems ? Array.from({ length: numrealItems?.ids?.length }, (_, k) => numrealItems?.quantities[k] > 0 ? catID ? catID == numrealItems?.tags[k] ?  (<NftBox id={parseInt(numrealItems?.ids[k])} isMarket={true}  price={numrealItems?.prices[k]} name={numrealItems?.names[k]} description={numrealItems?.descriptions[k]} image={numrealItems?.images[k]} />  ) :"": (<NftBox id={parseInt(numrealItems?.ids[k])} isMarket={true}  price={numrealItems?.prices[k]} name={numrealItems?.names[k]} description={numrealItems?.descriptions[k]} image={numrealItems?.images[k]} />  ): "") : <div style={{"textAlign": "start"}}><ReactLoading type={type} color={color}
            height={200} width={200} /><h5>{window.localStorage.getItem("language") == "en" ? "Loading..." : "Chargement..." }</h5></div>}
            </div>
            </div>
            
        </div>
            </div>
            </div>
    </div>
        
    );
}


function Market ()  {
    return (
        <div class="market">
           <InstaView/>
            
        </div>
    )
}

export default Market;