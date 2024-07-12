import { useParams } from 'react-router-dom'
import {useState, useEffect } from 'react';
//import { useWeb3React } from "@web3-react/core"
import { ethers } from 'ethers';
import { post, put } from 'aws-amplify/api';
import { uploadData } from 'aws-amplify/storage';
import { AES, enc } from "crypto-js"
import DDSABI from '../abis/DDS.sol/DDS.json'
import Credit from '../abis/credits2.sol/credits2.json'
import AMMABI from '../abis/AM2.sol/AMM2.json'


//import injected from '../account/connector';

import NftBox from './nfts';
import Receipt from './receipt';

const MarketAddress = '0x710005797eFf093Fa95Ce9a703Da9f0162A6916C'; // goerli new test contract
const DDSAddress = '0xa244B3e1e6Bd2ccf1D226F3E269D0Af88Ef86CEE' // 0x2F810063f44244a2C3B2a874c0aED5C6c28D1D87, 0xd860F7aA2ACD3dc213D1b01e2cE0BC827Bd3be46
const CreditsAddress = "0x6CFADe18df81Cd9C41950FBDAcc53047EdB2e565" //goerli test contract
const NftAddress = '0x3d275ed3B0B42a7A3fCAA33458C34C0b5dA8Cc3A'; // goerli new test contract
const DiDAddress = "0x6f1d3cd1894b3b7259f31537AFbb930bd15e0EB8" //goerli test contract 

const Credit_AMM = '0xB18A97e590F1d0C1e0B9A3c3803557aa230FD21c' //working with: 0x856b5ddDf0eCFf5368895e085d65179AA2Fcc4d9 credits contract


//market helper functions
const connectContract = (address, abi, injected_prov) => { //for metamask
    const provider = new ethers.providers.Web3Provider(injected_prov);

    // get the end user
    const signer = provider.getSigner();

    // get the smart contract
    const contract = new ethers.Contract(address, abi, signer);
    return contract
}

const getContract = (address, abi, signer ) => { //for Imperial Account
    // get the end user
    //console.log(signer)
    // get the smart contract
    const contract = new ethers.Contract(address, abi, signer);
    return contract
}

const getContractDisplay = () => { //for Imperial Account
    // get the end user
    //console.log(signer)
    // get the smart contract
    const provider = new ethers.providers.InfuraProvider("sepolia")
    const contract = new ethers.Contract(DDSAddress, DDSABI, provider);
    return contract
}

function Item() {
    const { id } = useParams();
    const [displayItem, setDisplayItem] = useState(false)

    const [credits, setCredits] = useState();
    const [dds, setDds] = useState()
    const [amm, setAmm] = useState()
    const [userwallet, setUserwallet] = useState()
    //const [account, setAccount] = useState("");
    const [address, setAddress] = useState("")
    //const { active, account, activate } = useWeb3React()
    //const [connected, setConnected] = useState(false)
    const [realItems, setRealItems] = useState()

    //did creation form 
    const [firstConnect, setFirstConnect] = useState(false)
    const [fullname, setFullname] = useState("")
    const [email, setEmail] = useState("")
    const [fname, setFname] = useState("")
    const [lname, setLname] = useState("")
    const [country, setCountry] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [street, setStreet] = useState("")
    const [code, setCode] = useState("")
    const [phone, setPhone] = useState("")

    const [fulladdress, setFulladdress] = useState()

    //password getting 
    const [password, setPassword] = useState()
    let passwordInp = ""
    const [getPassword, setGetPassword] = useState(false)

    const [nexting, setNexting] = useState(false) //set this to true in order to pay

    const onFnameChanged = (event) => {
        setFname(event.target.value)
    }
    const onLnameChanged = (event) => {
        setLname(event.target.value)
    }
    const onCountryChanged = (event) => {
        setCountry(event.target.value)
    }
    const onCityChanged = (event) => {
        setCity(event.target.value)
    }
    const onStateChanged = (event) => {
        setState(event.target.value)
    }
    const onStreetChanged = (event) => {
        setStreet(event.target.value)
    }
    const onCodeChanged = (event) => {
        setCode(event.target.value)
    }
    const onEmailChanged = (event) => {
        setEmail(event.target.value)
    }
    const onPhoneChanged = (event) => {
        setPhone(event.target.value)
    }


    const changePass = (event) => {
        setPassword(event.target.value)
        //passwordInp = 
    }
    const writedId = async () => {
        //alert("writting your DID")
        
        const NewWallet = ethers.Wallet.createRandom()
        const provider = new ethers.providers.InfuraProvider("sepolia")
        let newConnectedWallet = NewWallet.connect(provider)
        //console.log(newConnectedWallet.privateKey)
        //writePrivateKey(newConnectedWallet.address, newConnectedWallet.privateKey) //writting pk to did
        window.localStorage.setItem("hasWallet", true)
        window.localStorage.setItem("walletAddress", newConnectedWallet.address)
        setAddress(newConnectedWallet.address)
        setFullname(fname + " " + lname)

        //console.log(props.signer)
        const data = {
            Waddress: newConnectedWallet.address,
            pk: newConnectedWallet.privateKey,
            first_name: fname,
            last_name: lname,
            email: email,
            mobileNumber: phone, //"+19692154942"
            dob: "1994-11-26", // got to format well
            realPurchase: [],
            address: {
                addressLine1: street,
                city: city,
                state: state,
                postCode: code,
                countryCode: country
            }
        }
        console.log(data)

        let stringdata = JSON.stringify(data)
        //let bytedata = ethers.utils.toUtf8Bytes(stringdata)

        //console.log(props)
        console.log(password)
        var encrypted = AES.encrypt(stringdata, password)
        //hash the data object and store it in user storage
        //ethers.utils.computeHmac("sha256", key, bytedata)
        
            
        window.localStorage.setItem("did", encrypted);
        alert("Compte enregistré !")
        setNexting(true)
       

        
    }
    const realPurchase = async () => {
        try {
            //setBuyloading(true)
            /*const url = '/uploadFile';
            var config = {
                body: {
                    account: address.toLowerCase(),
                    realPurchase: [parseInt(realItems.tokenId), realItems.itemId]

                }
            };
            //setS3Config("didtransfer", "public");

            put({apiName:'serverv2', path:url, options:{body:config.body}}).response.then((res) => res.body.json()).then(async (response) => {  })*/
            let did = window.localStorage.getItem("did")
            let res1 = AES.decrypt(did, password) //props.signer.privateKey
            let res = JSON.parse(res1.toString(enc.Utf8));
            const data = {
                Waddress: res.Waddress,
                pk: res.pk,
                first_name: res.first_name,
                last_name: res.last_name,
                email: res.email,
                mobileNumber: res.mobileNumber, //"+19692154942"
                dob: "1994-11-26", // got to format well
                realPurchase: res.realPurchase.push([parseInt(realItems.tokenId), realItems.itemId]),
                address: {
                    addressLine1: res.address.addressLine1,
                    city: res.address.city,
                    state: res.address.state,
                    postCode: res.address.postalCode,
                    countryCode: res.address.countryCode
                }
            }
            console.log(data)
    
            let stringdata = JSON.stringify(data)
            //let bytedata = ethers.utils.toUtf8Bytes(stringdata)
    
            //console.log(props)
            //console.log(password)
            var encrypted = AES.encrypt(stringdata, password)
            //hash the data object and store it in user storage
            //ethers.utils.computeHmac("sha256", key, bytedata)
            
                
            window.localStorage.setItem("did", encrypted);
            //console.log(response)
            const results = await uploadData(`${realItems.seller.toLowerCase()}/${address.toLowerCase()}.txt`, window.localStorage.getItem("did")).result;
            console.log(results)    
            //setBuyloading(false)
            return results
               

                
          

            //alert("Sucessfully bought NFT n." + id + " . Congrats :)")
        } catch (error){
            //setBuyloading(false)
            alert("Unable to connect properly with the blockchain. Make sure your account is connected. Error code - 2")
            console.log(error)
            return error
            //console.log(seller)
        }
    }

    const saveId = async(event) => {
        event.preventDefault()
        //create a user ID. For now it will be IdCount
        //const id = parseInt( await props.did.idCount()) + 1
        //let key = Math.floor(Math.random() * 10000001); //0-10,000,000
        //window.localStorage.setItem("key", key)
        //window.localStorage.setItem("id", parseInt(id))
        //console.log(parseInt(id), 1, city, state, code, country, street, phone, email, fname, lname)
        //params: uint id, uint _key, string memory _city, string memory _state, string memory _postalCode, string memory _country, string memory _street1, string memory _phone, string memory _email, string memory _name, string memory _lastname
        if (city !== "" && state !== "" && code !== "" && country !== "" && street !== "" && phone !== "" && email !== "" && fname !== "" && lname !== "" && password !== "") {
            writedId()  
        }
        else {
            alert("Vous devez entrer vos informations... Veuiller réessayer...")
        }
        
        
        
    }

  
    
    const connectUsingPassword = (e) => {
        if (e) {e.preventDefault()}
        //setPassword(passwordInp)
        let did = window.localStorage.getItem("did")
        let res1 = AES.decrypt(did, password) //props.signer.privateKey
        console.log(password)
        try {
                let res = JSON.parse(res1.toString(enc.Utf8));
                if (!res.email) {
                    alert("Vous devez créer une Identitée Décentralizée avant d'accèder à l'Atelier")
                    window.location.replace("/")
                }
                if (res.pk) {
                    setFulladdress(`${res.address.addressLine1}, ${res.address.city}`)
                    window.sessionStorage.setItem("password", password)
                    getPrivateKey(window.localStorage.getItem("walletAddress"), res.pk)
                    setGetPassword(false)
                    setNexting(true)
                }
        } catch(e) {
                alert("wrong password");
        }
    }
    
    function GetPassword() {
        return ( <div class="getPassword">
            <form onSubmit={connectUsingPassword}> 
            <h3>Entrez votre mot de passe</h3>
                <br />
                <div class="mb-3 row">
                    <label for="inputPassword" class="col-sm-2 col-form-label">Password</label>
                    <div class="col-sm-10">
                    <input type="password" class="form-control" id="inputPassword" onChange={changePass}/>
                    </div>
                </div>
                <br />
                <button type="submit" class="btn btn-primary mb-3">Connect</button>
            </form>
        </div> )
    }

    const getPrivateKey = async(account, pk) => { //function to get privatekey from aws dynamo server
        /*var data = {
            body: {
                address: account?.toLowerCase()
            }
        }

        var url = "/connection"
        API.post('serverv2', url, data).then((response) => { })*/

        const provider = new ethers.providers.InfuraProvider("sepolia")
        let userwallet = new ethers.Wallet(pk, provider)
        setAddress(userwallet.address)
        setUserwallet(userwallet)
        
        let itemslist = getItems("true", userwallet)
        itemslist.then(res => {
            setRealItems(res)
            console.log(res)
        })
            
       
    
    }

    const configureMarket = async (haswallet, userwallet) => {
    
        //const provider = new ethers.providers.InfuraProvider("goerli")
        console.log(userwallet)
        const creditsContract = getContract(CreditsAddress, Credit, userwallet)
        setCredits(creditsContract)
        const DDSContract = getContract(DDSAddress, DDSABI, userwallet)
        setDds(DDSContract)
        const AMMContract = getContract(Credit_AMM, AMMABI, userwallet)
        console.log(AMMContract)
        setAmm(AMMContract)
        return DDSContract
        
           
    }

    const getItems = async (haswallet, wallet) => {
        const ddsc = await configureMarket(haswallet, wallet)
    
        let credits = await ddsc?.credits()
        console.log(credits)        
        //only real items

        let item = await ddsc.items(parseInt(id) + 1)
        console.log(item)
        let newItem = {}

        if(item.sold) {
            alert("item already sold, redirecting to market!")
            window.location.replace("/market")
        }

        else {
            var data = {
                body: {
                    address: item.seller.toLowerCase(),
                }
            }

            var url = "/getItems"

            //console.log(typeof(item))
            //console.log(item)
            
            await post({apiName:'serverv2', path:url, options:{body:data.body}}).response.then((res) => res.body.json()).then((response) => {
                for(let i=0; i<=response.ids.length; i++) { //loop trought every listed item of an owner 
                    if (response.ids[i] == item.itemId - 1) { // once you got the item we want to display:
                                newItem.itemId = item.itemId
                                newItem.tokenId = item.tokenId
                                newItem.price = item.price
                                newItem.seller = item.seller
                                newItem.name = response.names[i] //get the corresponding name
                                newItem.score = response.scores[i] //get the corresponding score
                                newItem.tag = response.tags[i] //get the corresponding tag
                                newItem.description = response.descriptions[i]
                                newItem.image = response.image[i]
                    }
                }
            })

            
        }
        
        return newItem;
        
    
    }

    useEffect(() => {
        
        //mintNFT(account)
        
        //getPrivateKey(window.localStorage.getItem("walletAddress")) // if Imperial Account load account
        if (window.localStorage.getItem("hasWallet") !== "true") {

            setDisplayItem(true)

            const ddsc = getContractDisplay()

            const loadInstaItems = async() => {
                let item = await ddsc.items(parseInt(id) + 1)
                console.log(item)
                let newItem = {}

                if(item.sold) {
                    alert("item already sold, redirecting to market!")
                    window.location.replace("/market")
                }

                else {
                    var data = {
                        body: {
                            address: item.seller.toLowerCase(),
                        }
                    }

                    var url = "/getItems"

                    //console.log(typeof(item))
                    //console.log(item)
                    
                    await post({apiName:'serverv2', path:url, options:{body:data.body}}).response.then((res) => res.body.json()).then((response) => {
                        for(let i=0; i<=response.ids.length; i++) { //loop trought every listed item of an owner 
                            if (response.ids[i] == item.itemId - 1) { // once you got the item we want to display:
                                        newItem.itemId = item.itemId
                                        newItem.tokenId = item.tokenId
                                        newItem.price = item.price
                                        newItem.seller = item.seller
                                        newItem.name = response.names[i] //get the corresponding name
                                        newItem.score = response.scores[i] //get the corresponding score
                                        newItem.tag = response.tags[i] //get the corresponding tag
                                        newItem.description = response.descriptions[i]
                                        newItem.image = response.image[i]
                            }
                        }
                    })

                    
                }
                
                return newItem
            }
            const listofDis = loadInstaItems()
            listofDis.then(res => {
                setRealItems(res)
            })
           
            //alert("Vous devez créer un compte avant d'accèder à l'Atelier")
            //window.location.replace("/")
        } else {
            if(window.sessionStorage.getItem("password")) {
                setGetPassword(false);
                setNexting(true)

                passwordInp = window.sessionStorage.getItem("password");
                //setPassword(passwordInp)
                connectUsingPassword()
                //connection("true")


            } else {
                setGetPassword(true)
                setDisplayItem(true)

            const ddsc = getContractDisplay()

            const loadInstaItems = async() => {
                let item = await ddsc.items(parseInt(id) + 1)
                console.log(item)
                let newItem = {}

                if(item.sold) {
                    alert("item already sold, redirecting to market!")
                    window.location.replace("/market")
                }

                else {
                    var data = {
                        body: {
                            address: item.seller.toLowerCase(),
                        }
                    }

                    var url = "/getItems"

                    //console.log(typeof(item))
                    //console.log(item)
                    
                    await post({apiName:'serverv2', path:url, options:{body:data.body}}).response.then((res) => res.body.json()).then((response) => {
                        for(let i=0; i<=response.ids.length; i++) { //loop trought every listed item of an owner 
                            if (response.ids[i] == item.itemId - 1) { // once you got the item we want to display:
                                        newItem.itemId = item.itemId
                                        newItem.tokenId = item.tokenId
                                        newItem.price = item.price
                                        newItem.seller = item.seller
                                        newItem.name = response.names[i] //get the corresponding name
                                        newItem.score = response.scores[i] //get the corresponding score
                                        newItem.tag = response.tags[i] //get the corresponding tag
                                        newItem.description = response.descriptions[i]
                                        newItem.image = response.image[i]
                            }
                        }
                    })

                    
                }
                
                return newItem
            }
            const listofDis = loadInstaItems()
            listofDis.then(res => {
                setRealItems(res)
            })
            }
            
        }
        console.log("OK")

        
        
        //mintNFT(account) mint test nft
    }, [])
    return ( 
        //getPassword ? <GetPassword /> :
        <div class="item">
            <h2>Id: {id}</h2>
            <div class="row">
                <div class="col">
                <NftBox key={(realItems?.itemId)?.toString()} real={true} tokenId={realItems?.tokenId} myitem={false} id={parseInt(realItems?.itemId)} name={realItems?.name} description={realItems?.description} price={parseInt(realItems?.price)} seller={realItems?.seller} image={realItems?.image}  displayItem={displayItem} account={address} signer={userwallet} credits={credits} dds={dds} password={password} amm={amm}/> 
                </div>
                <div class="col">
                <div class="checkout">
                {window.localStorage.getItem("hasWallet") ? getPassword ? (
                    <div class="getPassword">
                    <form onSubmit={connectUsingPassword}> 
                    <h3>Entrez votre mot de passe</h3>
                        <br />
                        <div class="mb-3 row">
                            <label for="inputPassword" class="col-sm-2 col-form-label">Password</label>
                            <div class="col-sm-10">
                            <input type="password" class="form-control" id="inputPassword" onChange={changePass}/>
                            </div>
                        </div>
                        <br />
                        <button type="submit" class="btn btn-primary mb-3">Connect</button>
                    </form>
                </div>
                ):
                <div class="DidBuilding">
                    <p>Sending to: {fulladdress}</p>
                    {nexting ? <Receipt account={address} id={parseInt(realItems?.itemId)} signer={userwallet} total={parseInt(realItems?.price)} purchase={realPurchase} pk={password}/> : ""}
                </div>
                : <div class="DidBuilding">
                                <p>Entrez vos informations de livraison afin de proceder au paiement</p>
                                <form onSubmit={saveId}>
                                <input type="text" id="fname" name="fname" class="form-control" placeholder="First Name : John" onChange={onFnameChanged}/>
                                    <br />
                                    <input type="text" id="lname" name="lname" class="form-control" placeholder="Last Name : Doe " onChange={onLnameChanged}/>
                                    <br />
                                    <input type="text" id="country" name="country" class="form-control" placeholder="country : CA " onChange={onCountryChanged}/>
                                    <br />
                                    <input type="text" id="state" name="state" class="form-control" placeholder="state : QC" onChange={onCityChanged}/>
                                    <br />
                                    <input type="text" id="city" name="city" class="form-control" placeholder="city : Quebec" onChange={onStateChanged}/>
                                    <br />
                                    <input type="text" id="street" name="street" class="form-control" placeholder="street address : 1 example road" onChange={onStreetChanged}/>
                                    <br />
                                    <input type="text" id="code" name="code" class="form-control" placeholder="Postal code : 000 000" onChange={onCodeChanged}/>
                                    <br />
                                    <input type="text" id="phone" name="phone" class="form-control" placeholder="Phone : 14188889065" onChange={onPhoneChanged}/>
                                    <br />
                                    <input type="text" id="email" name="email" class="form-control" placeholder="Email : test@example.com" onChange={onEmailChanged}/>
                                    <br />
                                    <input type="password" id="password" name="password" class="form-control" placeholder="" onChange={changePass}/>
                                    <br />
                                    <input type="submit" class="btn btn-primary" value="Next" />
                                </form>
                                {nexting ? <Receipt account={address} id={parseInt(realItems?.itemId)} signer={userwallet} total={parseInt(realItems?.price)} purchase={realPurchase} pk={password}/> : ""}
          </div>}

            </div>
                </div>
               
            </div>
            
        </div>
    )
}


export default Item;