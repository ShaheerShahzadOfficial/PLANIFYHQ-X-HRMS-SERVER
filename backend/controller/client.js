import Client from "../models/client.js";

const createClient = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    const client = new Client({ name, companyId: req.user.id });
    await client.save();
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: "Error creating client", error: error.message });
  }
};

const getClients = async (req, res) => {
  try {
    const clients = await Client.find({ companyId: req.user.id });
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching clients", error: error.message });
  }
};

const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const client = await Client.findOne({ _id: id, companyId: req.user.id });
    
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const updatedClient = await Client.findByIdAndUpdate(
      id, 
      { name, status, updatedAt: Date.now() }, 
      { new: true }
    );
    
    res.status(200).json(updatedClient);
  } catch (error) {
    res.status(500).json({ message: "Error updating client", error: error.message });
  }
};

const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    
    const client = await Client.findOne({ _id: id, companyId: req.user.id });
    
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    await Client.findByIdAndDelete(id);
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting client", error: error.message });
  }
};

export { createClient, getClients, updateClient, deleteClient };
