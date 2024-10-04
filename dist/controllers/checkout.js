import prisma from "../prisma.js";
import { Decimal } from "@prisma/client/runtime/library.js";
import stripe from "../stripe.js";
import { v4 as uuidv4 } from "uuid";
import * as communication from "../utils/sendConfirmation.js";
export const paymentIntent = async (req, res) => {
    /*
      we will implement the payment processing logic here,
      where we will take payment through STRIPE,
      validate the payment details,
      complete payment,
      and then update the order status in our database; creating
      a new instance of the model Order with prisma, and sending a confirmation email, generating a
      confirmation/receipt string, and returning it to the client.
      we will also need to update the 'confirmed' status on the
      the transaction record in our database, add the confirmation string to the transaction.
      */
    if (!req.session.transactionId) {
        return res.status(400).json({ error: "Session credentials not found." });
    }
    const transaction = await prisma.transaction.findUnique({
        where: { transaction_id: req.session.transactionId },
        include: { customer: true },
    });
    if (!transaction) {
        return res.status(400).json({ error: "Transaction not found." });
    }
    let total = new Decimal(transaction.orderTotal);
    const totalCents = Math.round(total.toNumber() * 100);
    const paymentIntent = await stripe.paymentIntents.create({
        amount: totalCents,
        currency: "usd",
    });
    res.send({
        clientSecret: paymentIntent.client_secret,
    });
};
export const confirmPayment = async (req, res) => {
    const transaction = await prisma.transaction.findUnique({
        where: { transaction_id: req.session.transactionId },
        include: { customer: true },
    });
    if (!transaction) {
        return res.status(400).json({ error: "Transaction not found." });
    }
    const confirmationString = `${transaction.transaction_id}-` + uuidv4();
    try {
        // update the transaction record
        const [updatedTransaction, newOrder] = await prisma.$transaction([
            prisma.transaction.update({
                where: { transaction_id: transaction.transaction_id },
                data: {
                    confirmed: true,
                    confirmation: confirmationString,
                },
            }),
            prisma.order.create({
                data: {
                    transaction_id: transaction.transaction_id,
                },
            }),
        ]);
        // begin communicating with the customer
        await Promise.all([
            communication.sendEmail(transaction.customer.email, "Booking Confirmation from Skeno", `Your mixing order has been confirmed! Your order confirmation is: ${confirmationString}
        Please keep this information secure and accessible for future reference.
        Feel free to reach out directly if you have any questions or concerns.
        
        Mer Kuti Sound
        Chicago, Illinois
        merkutisound@gmail.com
        3128417401
        `),
            communication.sendText(transaction.customer.phoneNumber, `Your mixing order has been confirmed! Your order confirmation is: ${confirmationString}
        Please keep this information secure and accessible for future reference.
        For your convenience, a duplicate of this message has been sent to the email on file.
        Feel free to reach out directly if you have any questions or concerns.
        
        Mer Kuti Sound
        Chicago, Illinois
        merkutisound@gmail.com
        3128417401
        `),
        ]);
        res.status(200).json({
            message: "Payment confirmed and order created successfully.",
            order: newOrder,
            confirmationString,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Post-payment actions have failed..." });
    }
};
