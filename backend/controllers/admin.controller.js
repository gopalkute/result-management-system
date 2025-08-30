import { Admin } from "../models/admin.model.js";

// Create Admin
const createAdmin = async (req, res) => {
   try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
         return res
            .status(400)
            .json({ success: false, message: "All fields are required" });
      }

      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
         return res
            .status(400)
            .json({ success: false, message: "Admin already exists" });
      }

      const admin = new Admin({ name, email, password });
      await admin.save();

      res.status(201).json({ success: true, data: admin });
   } catch (error) {
      res.status(500).json({ success: false, message: error.message });
   }
};

// Get all Admins
const getAdmins = async (req, res) => {
   try {
      const admins = await Admin.find();
      res.status(200).json({ success: true, data: admins });
   } catch (error) {
      res.status(500).json({ success: false, message: error.message });
   }
};

// Get single Admin by ID
const getAdminById = async (req, res) => {
   try {
      const admin = await Admin.findById(req.params.id);
      if (!admin) {
         return res
            .status(404)
            .json({ success: false, message: "Admin not found" });
      }
      res.status(200).json({ success: true, data: admin });
   } catch (error) {
      res.status(500).json({ success: false, message: error.message });
   }
};

// Update Admin
const updateAdmin = async (req, res) => {
   try {
      const { name, email, password } = req.body;

      const admin = await Admin.findById(req.params.id);
      if (!admin) {
         return res
            .status(404)
            .json({ success: false, message: "Admin not found" });
      }

      if (name) admin.name = name;
      if (email) admin.email = email;
      if (password) admin.password = password; // will be hashed by pre-save hook

      await admin.save();

      res.status(200).json({ success: true, data: admin });
   } catch (error) {
      res.status(500).json({ success: false, message: error.message });
   }
};

//update admin name
const updateData = async (req, res) => {
   try {
      const { name } = req.body;
      const id = req.user._id;

      const admin = await Admin.findById(id);
      if (name) admin.name = name;
      await admin.save();
      res.status(200).json({ success: true, data: admin });
   } catch (error) {
      res.status(500).json({ success: false, message: error.message });
   }
};

// Delete Admin
const deleteAdmin = async (req, res) => {
   try {
      const admin = await Admin.findByIdAndDelete(req.params.id);
      if (!admin) {
         return res
            .status(404)
            .json({ success: false, message: "Admin not found" });
      }
      res.status(200).json({
         success: true,
         message: "Admin deleted successfully",
      });
   } catch (error) {
      res.status(500).json({ success: false, message: error.message });
   }
};

export {
   createAdmin,
   getAdmins,
   getAdminById,
   updateAdmin,
   updateData,
   deleteAdmin,
};
