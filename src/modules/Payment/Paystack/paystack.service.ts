import axios from "axios";
import config from "../../../config/config.js";
import AppError from "../../../errorHandlers/appError.js";

class PaystackService {
  async initializePayment(email: string, amount: number) {
    try {
      const response = await axios.post(
        "https://api.paystack.co/transaction/initialize",
        {
          email,
          amount: amount * 100,
        },
        {
          headers: {
            Authorization: `Bearer ${config.paystack_secret_key}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data;
    } catch (error) {
      throw new AppError("Unable to initialize payment", 500);
    }
  }

  async verifyPayment(reference: string) {
    try {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${config.paystack_secret_key}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      throw new AppError("Unable to verify payment", 500);
    }
  }
}

export default new PaystackService;

