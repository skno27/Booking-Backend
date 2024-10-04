import prisma from "../prisma.js";
// submit transaction details
export const submitTransaction = async (req, res) => {
    const customer = req.session.customerId;
    // Validate customer existance, this will also be useful in debugging
    if (!customer) {
        return res
            .status(400)
            .json({ error: "Customer ID is missing in this session." });
    }
    try {
        const result = await prisma.$transaction(async (prisma) => {
            const transaction = await prisma.transaction.create({
                data: {
                    customer_id: customer,
                },
            });
            const { mixData, fileData } = req.body;
            // Validate that mixdata and fileData are not empty
            if (!mixData && !fileData) {
                throw new Error("Some mix or file data is required.");
            }
            const mixPromises = mixData.map((slice) => {
                const { songName, type, print } = slice;
                return prisma.mix.create({
                    data: {
                        transaction_id: transaction.transaction_id,
                        songName,
                        type,
                        print,
                    },
                });
            });
            const mixArray = await Promise.all(mixPromises); // await all mix creations, transactionally
            const filePromises = fileData.map((slice) => {
                const { songName, print } = slice;
                return prisma.file.create({
                    data: {
                        transaction_id: transaction.transaction_id,
                        songName,
                        print,
                    },
                });
            });
            const fileArray = await Promise.all(filePromises);
            const generatePrice = (mixArray, fileArray) => {
                let priceSumOfMixes = 0.0;
                let priceSumOfFiles = 0.0;
                // let price;
                for (const mix of mixArray) {
                    if (mix.type === "STEREO") {
                        priceSumOfMixes += 100.0;
                    }
                    else if (mix.type === "TRACKOUT") {
                        priceSumOfMixes += 165.0;
                    }
                    if (mix.print === "WAV") {
                        priceSumOfMixes += 10.0;
                    }
                }
                for (const file of fileArray) {
                    if (file.print === "WAV") {
                        priceSumOfFiles += 20.0;
                    }
                    else if (file.print === "MP3") {
                        priceSumOfFiles += 10.0;
                    }
                }
                return priceSumOfFiles + priceSumOfMixes;
            };
            const updated = await prisma.transaction.update({
                where: { transaction_id: transaction.transaction_id },
                data: { orderTotal: generatePrice(mixArray, fileArray) },
            });
            // return transaction.orderTotal;
            req.session.transactionId = updated.transaction_id;
        });
        return res.status(201).json(result);
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ error: "Something is wrong with this transaction..." });
    }
};
