import express, { Request, Response } from "express";
import { Agency, Client } from "../models/model";
import jwt from "jsonwebtoken";
const secretKey = "secret";
import { verifyToken } from "../middleware/authenticationMiddleware";

const router = express.Router();

router.post("/create", verifyToken, async (req: Request, res: Response) => {
  try {
    const { agencyData, clientData } = req.body;

    let agency = await Agency.findOne({
      name: agencyData.name,
      phoneNumber: agencyData.phoneNumber,
    });

    let agentId;
    if (agency) {
      agentId = agency._id;
    } else {
      agency = new Agency(agencyData);
      await agency.save();
      agentId = agency._id;
    }

    const existingClient = await Client.findOne({
      $or: [
        { email: clientData.email },
        { phoneNumber: clientData.phoneNumber },
      ],
    });

    if (existingClient) {
      return res
        .status(400)
        .json({ error: "Email or phone number already exists" });
    }

    const client = new Client({
      ...clientData,
      agencyId: agentId,
    });
    await client.save();

    res.status(201).json({ message: "Agency and client created successfully" });
  } catch (error) {
    console.error("Error creating agency and client:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put(
  "/update-client",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { clientId, updatedClientData } = req.body;

      if (!clientId) {
        return res
          .status(400)
          .json({ message: "clientId is required in the request body" });
      }

      const client = await Client.findById(clientId);

      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }

      await Client.findByIdAndUpdate(clientId, updatedClientData);

      res.json({ message: "Client details updated successfully" });
    } catch (error) {
      console.error("Error updating client details:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/top-client", verifyToken, async (req: Request, res: Response) => {
  try {
   
    const agencies = await Agency.find();

    const topClientsInfo = [];

    for (const agency of agencies) {
      const maxTotalBill = await Client.findOne({ agencyId: agency._id }).sort({
        totalBill: -1,
      });

      if (maxTotalBill) {
        const topClients = await Client.find({
          totalBill: maxTotalBill.totalBill,
          agencyId: agency._id,
        });

        for (const client of topClients) {
          topClientsInfo.push({
            agencyName: agency.name,
            clientName: client.name,
            totalBill: client.totalBill,
          });
        }
      }
    }

    res.json(topClientsInfo);
  } catch (error) {
    console.error("Error fetching top client details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!(username == "Akshay" && password == "Akshay@4141")) {
      res.json({ message: "Invalid username and password" });
    }

    const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
