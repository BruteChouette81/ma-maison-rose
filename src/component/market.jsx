import { useState, useEffect } from "react";
import NftBox from "./nfts";
import { ethers } from "ethers";
import DDSABI from '../abis/DDS.sol/DDS.json'
import './css/market.css'
import './css/nftbox.css'

const DDSAddress = '0xa244B3e1e6Bd2ccf1D226F3E269D0Af88Ef86CEE'


const getContract = () => { //for Imperial Account
    
    const provider = new ethers.providers.InfuraProvider("sepolia")
    console.log(provider)
    const contract = new ethers.Contract(DDSAddress, DDSABI, provider);
    return contract 
}


function SideBar() {
    //component for the side bar, including tags
    return (
        <div class="sideBar">
            <div class="container" >
                <div class="col " >
                    <div class="row " >
                        <h5 style={{'color':'#664346'}}>Parcourir par catégorie</h5>
                        <button type="button" class="btn btn-link">Tous les articles</button>
                    <button type="button" class="btn btn-link">Vases</button>
                    <button type="button" class="btn btn-link">Casse-tête</button>
                    <button type="button" class="btn btn-link">Soldes</button>
                    <button type="button" class="btn btn-link">Produits corporels</button>
                    <button type="button" class="btn btn-link">Accessoires</button>
                    <button type="button" class="btn btn-link">Bouteilles & thermos</button>
                    <button type="button" class="btn btn-link">Papeterie</button>
                    <button type="button" class="btn btn-link">Cuisine</button>
                    <button type="button" class="btn btn-link">Plantes, jardinage etc.</button>
                    <button type="button" class="btn btn-link">Bougies et parfums d'ambiance</button>
                    <button type="button" class="btn btn-link">Déco</button>
                    <button type="button" class="btn btn-link">Linge de maison</button>                    
                    </div>
                </div>
            </div>
        </div>
    )
}

function InstaView() {
    const [numrealItems, setNumRealItems] = useState(0);
    const [dds, setDds] = useState();
    let timeo = 2000;
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
        
    }, [])
    /*{ numrealItems > 0 ? Array.from({ length: based }, (_, k) =>  (<NftBox id={k} catID={3} real={true} displayItem={true} isMarket={true} dds={dds}/> )) : ""}
            {chunk_number > 0 ? Array.from({ length: chunk_number}, (_, i) => Array.from({ length: based + (increasingby * (i + 1)) }, (_, k) => k <=  (based-1) + (increasingby * i) || k >= numrealItems ? "" : (<NftBox id={k} catID={3} real={true} displayItem={true} isMarket={true} dds={dds}/> ) )) : ""} */
    return (
        <div class="instaView">
            <div class="row">
                <div class="col">
                { numrealItems > 0 ? Array.from({ length: based }, (_, k) =>  (<NftBox id={k} catID={3} real={true} displayItem={true} isMarket={true} dds={dds}/> )) : ""}
                {chunk_number > 0 ? Array.from({ length: chunk_number}, (_, i) => Array.from({ length: based + (increasingby * (i + 1)) }, (_, k) => k <=  (based-1) + (increasingby * i) || k >= numrealItems ? "" : (<NftBox id={k} catID={3} real={true} displayItem={true} isMarket={true} dds={dds}/> ) )) : ""}
            </div>
            </div>
            <button onClick={loadmore} class="btn btn-primary btn-lg" style={{"float": "bottom"}}>En voir davantage!</button>
        </div>
    );
}


function Market ()  {
    return (
        <div class="market">
            <div class="container">
                <div class="row">
                <div class="col-2">
                    <SideBar/>
                </div>
                <div class="col-10">
                    <InstaView />
                    </div>
                    </div>
            </div>
            
        </div>
    )
}

export default Market;