import AppError from "../../errorHandlers/appError.js";
import userService from "../Users/user.service.js";
import prisma from "../../config/prisma.js";
import paystackService from "./Paystack/paystack.service.js";

class Payment {
  async makePayment(userId: string, fineId: string) {
    // Find user
    const user = await userService.findUserById(userId);
    if (!user) {
      throw new AppError("You are not permitted", 403);
    }

    // Find fine
    const fine = await prisma.fine.findUnique({
      where: {
        id: fineId,
      },
    });

    if (!fine) {
      throw new AppError("Fine not found", 404);
    }

    // Check ownership
    if (fine.userId !== userId) {
      throw new AppError("You are not permitted to pay this fine", 403);
    }

    // Check fine status
    if (fine.status === "PAID") {
      throw new AppError("This fine has already been paid", 400);
    }

    if (fine.status === "WAIVED") {
      throw new AppError("This fine has already been waived", 400);
    }

    // Check pending payment
    const existingPayment = await prisma.payment.findFirst({
      where: {
        fineId,
        status: "PENDING",
      },
    });

    if (existingPayment) {
      throw new AppError(
        "There is already a pending payment for this fine",
        400,
      );
    }

    // Create payment
    const payment = await prisma.payment.create({
      data: {
        fineId,
        amount: fine.amount,
      },
    });

    try {
      // Initialize Paystack
      const paystack = await paystackService.initializePayment(
        user.email,
        Number(fine.amount),
      );

      // Save Paystack reference
      const updatedPayment = await prisma.payment.update({
        where: {
          id: payment.id,
        },
        data: {
          reference: paystack.data.reference,
        },
      });

      return {
        payment: updatedPayment,
        paystack: paystack.data,
      };
    } catch (error) {
      // Remove failed payment attempt
      await prisma.payment.delete({
        where: {
          id: payment.id,
        },
      });

      throw error;
    }
  }

  async verifyPayment(reference: string) {
    // find payment
    const payment = await prisma.payment.findUnique({
      where: {
        reference,
      },
    });
    if (!payment) {
      throw new AppError("Payment not found", 404);
    }

    // verify with paystack

    const paystack = await paystackService.verifyPayment(reference);
    if (paystack.data.status !== "success") {
      throw new AppError("Payment was not successful", 400);
    }

    // update payment status

    const updatedPayment = await prisma.payment.update({
      where:{
        id:payment.id
      },
      data:{
        status:"SUCCESS",
        paidAt:new Date()
      }
    })

    // update fine status
    await prisma.fine.update({
      where:{
        id:payment.fineId
      },
      data:{
        status:"PAID"
      }
    })

    return updatedPayment;
  }
}

export default new Payment();
