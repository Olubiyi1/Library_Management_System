import axios from "axios";
import config from "../../../config/config.js";

class PaystackService{
    async initializePayment(email:string,amount:number){
        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize",{
                email,
                amount: amount * 100
            },
            {
                headers:{
                    Authorization:`Bearer ${config.paystack_secret_key}`,
                    "Content-Type":"application/json"
                }
            }
        )

        return response.data
    }
    
}

export default new PaystackService;