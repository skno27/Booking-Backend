import { RequestHandler } from "express";
import prisma from "../prisma.js";

// submit the customer info
export const submitInfo: RequestHandler = async (req, res) => {
  try {
    // destructure and clean up input data
    const { email, phoneNumber, personName, artistName, genre } = req.body;
    const cleanNumber = phoneNumber.replace(/-/g, "");
    const capName = personName.toUpperCase();
    const capEmail = email.toLowerCase();

    // see if the customer exists already
    const customer = await prisma.customer.findFirst({
      where: {
        OR: [{ email: capEmail }, { phoneNumber: cleanNumber }],
      },
    });

    let customerId;

    if (!customer) {
      // create the customer
      const newCustomer = await prisma.customer.create({
        data: {
          email: capEmail,
          phoneNumber: cleanNumber,
          personName: capName,
          artistName,
          genre,
          points: 0,
        },
      });
      customerId = newCustomer.id;

      req.session.customerId = customerId;
      return res
        .status(201)
        .json({ message: "Customer info submitted", customerId });
    } else {
      customerId = customer.id;
      // update the customer if it exists
      await prisma.customer.update({
        where: { id: customer.id },
        data: {
          email: capEmail,
          phoneNumber: cleanNumber,
          personName: capName,
          artistName,
          genre: customer.genre ? `${customer.genre}, ${genre}` : genre,
        },
      });
      req.session.customerId = customerId;
      return res
        .status(200)
        .json({ message: "Customer info updated", customerId });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong here..." });
  }
};
