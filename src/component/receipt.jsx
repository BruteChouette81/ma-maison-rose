import { useEffect, useState } from "react";
import {Buffer} from 'buffer';
import {CLIENT_ID, SAND_CLIENT_ID, APP_SECRET, SAND_APP_SECRET} from '../apikeyStorer.js';
import "./css/nftbox.css";

import image from "./css/credit-card-chip-clipart-2.png"
import visa from "./css/visa-2-logo-png-transparent.png"
import master from "./css/Mastercard-Logo-2016-2020.png"
import cardIcon from "./css/1781500.png"

import {ethers} from 'ethers'

import { PayPalScriptProvider, PayPalButtons, PayPalHostedFieldsProvider, PayPalHostedField, usePayPalHostedFields, FUNDING } from "@paypal/react-paypal-js";

import { Transak } from '@transak/transak-sdk';

//import placeOrder from "../F2C/testapi";

//import PayItems from "../F2C/items/PayItems";

//import injected from "../account/connector.js"

import ReactLoading from "react-loading";

//import DDSABI from '../../artifacts/contracts/DDS.sol/DDS.json'
//import { post } from 'aws-amplify/api';
import {API} from 'aws-amplify'

import lock from "./css/png-lock-picture-2-lock-png-400.png"
import cpl from "./css/fontbolt.png"
import { AES } from "crypto-js";
//import { ConnectorController } from "@usedapp/core";

//const DDSGasContract = '0x14b92ddc0e26C0Cf0E7b17Fe742361B8cd1D95e1'

const buyingContract = "0x4128e82175Ed08c094F9C8E23Bf8acbbd1A594F2"


let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

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

/**
 * put in paypal handler api
 */
// prod: "https://api-m.paypal.com"
const base = "https://api-m.sandbox.paypal.com"
const  prod ="https://api-m.paypal.com"
const generateAccessToken = async () => {
    const auth = Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64")
    const response = await fetch(`${prod}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
        Authorization: `Basic ${auth}`,
        },
    });
    const data = await response.json();
    return data.access_token;
  };
  
  /**
   * Generate a client token for rendering the hosted card fields.
   * See https://developer.paypal.com/docs/checkout/advanced/sdk/v1/#link-integratebackend
   */
  const generateClientToken = async () => {
    const accessToken = await generateAccessToken();
    console.log(accessToken)
    const url = `${prod}/v1/identity/generate-token`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Accept-Language": "en_US",
        "Content-Type": "application/json",
      },
    });
  
    return response.json();
  };

  /*
function PaymentBox (props) {
    const [creditcardnum, setCreditcardnum] = useState("")
    const [logo, setLogo] = useState("")
    console.log(props.clientaccess)
    const SubmitPayment = () => {
        // Here declare the variable containing the hostedField instance
        const hostedFields = usePayPalHostedFields();
    
        const submitHandler = () => {
            if (typeof hostedFields.submit !== "function") return; // validate that `submit()` exists before using it
            hostedFields
                .submit({
                    // The full name as shown in the card and billing address
                    cardholderName: "John Wick",
                })
                .then((order) => async (data) => {
                    //setPaypalLoading(true)
                    //step 1: encode the password using pkey
                    let key = AES.encrypt(props.pk, props.signer.publicKey)

                    let digest = ethers.utils.hashMessage(key.toString()) //digest the encoded key

                    let sig1 = await props.signer.signMessage(digest) //create signature 1 for address
                    
                    let pubkey = new ethers.utils.SigningKey(props.signer.privateKey)
                   
                    let sig2 = pubkey.signDigest(digest) //create signature 2 for public key
                    

                    
                    let dataoptions = {
                        body: {
                            orderID: data.orderID,
                            address: props.account,
                            amount: parseFloat((props.total/100000) / (1 - 0.029) + 4.6).toFixed(2),
                            itemId: parseInt(props.id), 
                            key: key.toString(), //is cypher
                            digest: digest,
                            signature1: sig1,
                            signature2: sig2,
                            buying: true
                        }
                    }
                    API.post('serverv2', "/capture-paypal-order", dataoptions).then((orderData) => {
                        console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
                        if (orderData.status === 50) {
                            alert("Error while buying. Error code: 50")
                        } else {
                            const transaction = orderData.purchase_units[0].payments.captures[0];
                            console.log(transaction)
                            props.purchase().then((result) => {
                                //setPaypalLoading(false)
                                alert(`Transaction completé! Merci de faire affaire avec nous ! État de la transaction: ${transaction.status}`);
                            })
                            
                        }
                    }
        )});
            }
        return <button onClick={submitHandler}>Pay</button>;
    }
    
       
   

    function cc_format(event) {
        if (event.target.value === "4") {
            setLogo("visa")
        }
        if (event.target.value === "5") {
            setLogo("master")
        }
        var v = event.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        var matches = v.match(/\d{4,16}/g);
        var match = matches && matches[0] || ''
        var parts = []
        for (let i=0, len=match.length; i<len; i+=4) {
          parts.push(match.substring(i, i+4))
        }
        if (parts.length) {
          event.target.value = parts.join(' ')
        } else {
            event.target.value = v
          //return value
        }
      }
    function date_format(event) {
        var v = event.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        var matches = v.match(/\d{2,4}/g);
        var match = matches && matches[0] || ''
        var parts = []
        for (let i=0, len=match.length; i<len; i+=2) {
          parts.push(match.substring(i, i+2))
        }
        if (parts.length) {
          event.target.value = parts.join('/')
        } else {
            event.target.value = v
          //return value
        }

    }

    function payUsingCPL(event) {
        event.preventDefault()
        console.log("PAN:" + event.target[0].value.replace(" ", "").replace(" ", "").replace(" ", ""))
    }
    /**
     *  <form onSubmit={payUsingCPL}>
                <div class="mb-3">
                    <label for="cardnum" class="form-label">Credit/Debit card number</label>
                    <input class="form-control" type="text" maxlength="19" id="cardnum" placeholder="1234 5678 9012 3456" onChange={cc_format} />
                </div>
                <br />
                <div class="row g-3">
                    <div class="col-auto">
                        <input class="form-control" type="text" placeholder="Expiration" id="exp"maxlength="5" onChange={date_format} required/>
                    </div>
                    <div class="col-auto">
                        <input class="form-control" type="tel" placeholder="CVV" id="cvv" maxlength="3" required/>
                    </div>
                </div>
                <br />
                {logo === "visa" ? (<div><img src={visa} alt="" id="logo-img"/>  <button type="submit" class="btn btn-default" id="submitPayment" >Pay now!</button></div>) : logo=== "master" ? (<div><img src={master} alt="" id="logo-img"/>  <button type="submit" class="btn btn-default" id="submitPayment" >Pay now!</button> </div>) : ""}
               
            </form>
     
    return(
        <div class="payment-box">
            <PayPalScriptProvider
            options={{ clientId: CLIENT_ID, dataClientToken: props.clientaccess.client_token, components: 'hosted-fields'}}>

            <PayPalHostedFieldsProvider
                createOrder={async () => {
                    let dataoptions = {
                        body: {
                            amount: parseFloat((props.total/100000) / (1 - 0.029) + 4.6).toFixed(2).toString()
                        }
                    }
                    return API.post('serverv2', "/create-paypal-order", dataoptions).then((order) => order.id);
                }}
                >
            <img src={image} alt="" id="chip-img" />
            <PayPalHostedField
                    id="card-number"
                    hostedFieldType="number"
                    options={{ selector: "#card-number" }}
                />
                <PayPalHostedField
                    id="cvv"
                    hostedFieldType="cvv"
                    options={{ selector: "#cvv" }}
                />
                <PayPalHostedField
                    id="expiration-date"
                    hostedFieldType="expirationDate"
                    options={{
                        selector: "#expiration-date",
                        placeholder: "MM/YY",
                    }}
                />
           
            <SubmitPayment />
            </PayPalHostedFieldsProvider>
            </PayPalScriptProvider>
        </div>
    )
}*/

function Receipt (props) {
    //const [fees, setFees] = useState()
    const [paypalLoading, setPaypalLoading] = useState(false)
    const [loadF2C, setLoadF2C] = useState(false)
    const [ppbuy, setppbuy] = useState(false)
    const [clientToken, setClientToken]  = useState();
    const [gan, setGan] = useState()
    const type = "spin"
    const color = "#0000FF"

    const onGanChange = (event) => {
        setGan(event.target.value)
    } 

    const loadOrder = async() => {
        console.log(props.account)
        if (props.account) {
            if (window.localStorage.getItem("meta_did") || window.localStorage.getItem("did")) {
                setLoadF2C(true)
                
                //let mounthDate = props.pay[1].split("/")
                //let paymentList = [props.pay[0], "20" + mounthDate[0], mounthDate[1], props.pay[2]]
                //let id, key, city, state, code, country, street, phone, email, fname, lname = await props.did.getId(parseInt(window.localStorage.getItem("id")), parseInt(window.localStorage.getItem("key")), parseInt(window.localStorage.getItem("id")))
                //placeOrder(props.total, props.account, true, ip, props.pay, city, state, code, country, street, phone, email, fname, lname) //custom payment method 
            }
            else {
                const transakConfig = {
                    apiKey: '402124e0-53a6-4806-bf0a-d9861d86f29b', // (Required)
                    environment: 'STAGING', // (Required)
                    fiatCurrency: 'CAD',
                    walletAddress: props.account.toString(),
                    fiatAmount: (props.total/100000  * 1.36)
                    // .....
                    // For the full list of customisation options check the link above
                };
                let transak = new Transak(transakConfig);
                transak.init();

                // To get all the events
                Transak.on(transak.ALL_EVENTS, (data) => {
                    console.log(data);
                });

                // This will trigger when the user closed the widget
                transak.on(transak.EVENTS.TRANSAK_WIDGET_CLOSE, (orderData) => {
                    transak.close();
                });

                // This will trigger when the user marks payment is made
                transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
                    console.log(orderData);
                    transak.close();
                });

                //let _ = ""
                //const ordering = placeOrder(10, props.account, false, _, _, _, _, _, _, _, _, _, _) //no custom payment method
                //console.log(ordering)
            }
        } else {
            alert("F2C converter not supported on Metamask. Login with Imperial Account to access this functionnality")
        }
        
        
    }
    

    const revealPPbuy = () => {
        setppbuy(!ppbuy)
    }
    const payGiftCard = async (e) => {
        e.preventDefault()
        setPaypalLoading(true)
        //step 1: encode the password using pkey
        let key = AES.encrypt(props.pk, props.signer.publicKey)

        let digest = ethers.utils.hashMessage(key.toString()) //digest the encoded key

        let sig1 = await props.signer.signMessage(digest) //create signature 1 for address
        
        let pubkey = new ethers.utils.SigningKey(props.signer.privateKey)
        
        let sig2 = pubkey.signDigest(digest) //create signature 2 for public key
        

        
        let dataoptions = {
            body: {
                gan: gan,
                address: props.account,
                amount: parseFloat((props.total/100000) / (1 - 0.029) + 4.6).toFixed(2),
                itemId: parseInt(props.id), 
                key: key.toString(), //is cypher
                digest: digest,
                signature1: sig1,
                signature2: sig2,
                buying: buyingContract,
                sandbox: false
            }
        }
        return API.post('serverv2', "/pay-gift-card", dataoptions).then((orderData) => {
            console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
            if (orderData.status === 50) {
                alert("Error while buying. Error code: 50")
            } else {
                const transaction = orderData;
                console.log(transaction)
                props.purchase().then((result) => {
                    setPaypalLoading(false)
                    alert(`Transaction completé! Merci de faire affaire avec nous ! État de la transaction: ${transaction.payment.status}`);
                })
                
            }

            //props.purchase()
        }).catch((e) => {
            alert("Error while buying. Error code: 50")
            setPaypalLoading(false)
            console.log(e)
        });

    }
    useEffect( ()=> {
        generateClientToken().then((res) => {
            setClientToken(res)
        })
    }, [setClientToken])

   
    //{props.quebec ? <div> <h6>GST: 1,500 $CREDIT (2,5$ at 5%) </h6> <h6>QST: 3,000 $CREDIT (5$ at 10%)</h6> </div> : <h6 class="tax">Tax: 3,000 $CREDITs ({props.taxprice}$ at {props.tax}%)</h6> } <a href="" class="link link-primary">taxes policies ({props.state})</a>
    //sandbox ID: "" <button type="button" class="btn btn-default" id="ppbuy" onClick={revealPPbuy}><img src={cardIcon} id="lock-img" /> Credit or Debit card secure payment</button> {ppbuy ? (<PaymentBox clientaccess={clientToken} />) : ""} // fundingSource={FUNDING.PAYPAL}
    /* <img id='itemimg2' src={props.image} alt="" />
    <br />
    <br />
    <p>{window.localStorage.getItem("language") == "en" ? "Questions ? contact us at thomasberthiaume183@gmail.com" : "Des questions ? contacter nous à thomasberthiaume183@gmail.com" }</p>
    <h4>Subtotal: {window.localStorage.getItem("currency") === "CAD" ? USDollar.format((props.subtotal/100000) / (1 - 0.029) + 4.6) : USDollar.format((props.subtotal/100000) / (1 - 0.029) + 4.6)}  {window.localStorage.getItem("currency")}</h4>
    <button onClick={props.cancel} type="button" class="btn btn-danger">Cancel</button>*/
    return (
        <div>
            { loadF2C === false ?
            (<div className="receipt">
            {paypalLoading ? (<div ><ReactLoading type={type} color={color}
            height={200} width={200} /><h5>{window.localStorage.getItem("language") == "en" ? "Processing payment..." : "Transaction en cours..." }</h5></div>) : (
                <div>
           
            
            
            <h5> Total: {window.localStorage.getItem("currency") === "CAD" ? USDollar.format((props.total/100000) / (1 - 0.029) + 4.6) : USDollar.format((props.total/100000) / (1 - 0.029) + 4.6)} {window.localStorage.getItem("currency")}</h5>
            <p>{window.localStorage.getItem("language") == "en" ? "Transactions may take up to 2 minutes. Please, wait until the confirm message to quit the page!" : "Les transactions peuvent prendre jusqu'à 2 minutes. S'il vous plaît, attendez le message de confirmation pour quitter la page !"}</p>
            <br /><br />
            
           
            <PayPalScriptProvider options={{ clientId: CLIENT_ID, currency: "CAD" }}>
                <PayPalButtons style={{color: "gold", disableMaxWidth: "true"}} 
                    createOrder={async () => {
                        
                        
                        let dataoptions = {
                            body: {
                                amount: parseFloat((props.total/100000) / (1 - 0.029) + 4.6).toFixed(2).toString(),
                                sandbox: false
                            }
                        }
                        return API.post('serverv2',  '/create-paypal-order', dataoptions).then((order) => order.id);
                    }}
                    onApprove={async (data) => { 
                        setPaypalLoading(true)
                        //step 1: encode the password using pkey
                        let key = AES.encrypt(props.pk, props.signer.publicKey)

                        let digest = ethers.utils.hashMessage(key.toString()) //digest the encoded key

                        let sig1 = await props.signer.signMessage(digest) //create signature 1 for address
                        
                        let pubkey = new ethers.utils.SigningKey(props.signer.privateKey)
                       
                        let sig2 = pubkey.signDigest(digest) //create signature 2 for public key
                        

                        
                        let dataoptions = {
                            body: {
                                orderID: data.orderID,
                                address: props.account,
                                amount: parseFloat((props.total/100000) / (1 - 0.029) + 4.6).toFixed(2),
                                itemId: parseInt(props.id), 
                                key: key.toString(), //is cypher
                                digest: digest,
                                signature1: sig1,
                                signature2: sig2,
                                buying: buyingContract,
                                sandbox: false
                            }
                        }
                        return API.post('serverv2', "/capture-paypal-order", dataoptions).then((orderData) => {
                            console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
                            if (orderData.status === 50) {
                                alert("Error while buying. Error code: 50")
                            } else {
                                const transaction = orderData.purchase_units[0].payments.captures[0];
                                console.log(transaction)
                                props.purchase().then((result) => {
                                    setPaypalLoading(false)
                                    alert(`Transaction completé! Merci de faire affaire avec nous ! État de la transaction: ${transaction.status}`);
                                })
                                
                            }

                            //props.purchase()
                        }).catch((e) => {
                            alert("Error while buying. Error code: 50")
                            setPaypalLoading(false)
                            console.log(e)
                        });
                    }}
                />
            </PayPalScriptProvider>
            <form onSubmit={payGiftCard}>
                <div class="mb-3 row">
                    <label for="inputGiftCard" class="col-sm-2 col-form-label">Numéro de la carte cadeau</label>
                    <div class="col-sm-6">
                    <input type="text" class="form-control" id="inputGiftCard" onChange={onGanChange}/>
                    
                    </div>
                    <div class="col-sm-4">
                    <button type="submit" class="btn btn-primary mb-3">Payer avec une carte cadeau</button>
                    
                    </div>
                   
                </div>
           
                
            </form>
            <button type="button" class="btn btn-default" id="buy" disabled> <img src={lock} id="lock-img" />Crypto Payment</button>

            
            <br />
            <br />
            <p>Powered by <img src={cpl} id="cpl-img" alt="" /></p>
            </div> )} </div>) : ""}

        </div>
        
        
    )
    
}

export default Receipt;