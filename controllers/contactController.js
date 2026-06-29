const nodemailer = require("nodemailer");
const Contact = require("../models/Contact");

const createTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } =
    process.env;
  if (!SMTP_HOST || !SMTP_PORT) {
    return null;
  }
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === "true",
    auth:
      SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  });
  return transporter;
};

const sendConfirmationEmail = async (contact) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log(
      "Contact confirmation email skipped because SMTP is not configured.",
    );
    return;
  }

  const fromEmail =
    process.env.FROM_EMAIL ||
    `no-reply@${process.env.SMTP_HOST || "buybliss.com"}`;
  const mailOptions = {
    from: fromEmail,
    to: contact.email,
    subject: "BuyBliss Contact Form Received",
    html: `
      <p>Hi ${contact.name},</p>
      <p>Thank you for contacting BuyBliss. We have received your message and will respond shortly.</p>
      <p><strong>Subject:</strong> ${contact.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${contact.message}</p>
      <p>Best regards,<br/>The BuyBliss Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Contact confirmation email sent to", contact.email);
  } catch (error) {
    console.error("Failed to send contact confirmation email:", error.message);
  }
};

const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields." });
    }

    const contact = await Contact.create({
      name,
      email,
      phone,
      subject: subject?.trim() || "General Inquiry",
      message,
    });

    await sendConfirmationEmail(contact);

    res.status(201).json({ message: "Message sent successfully.", contact });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getContacts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const query = {};

    if (status && ["Unread", "Read", "Replied"].includes(status)) {
      query.status = status;
    }

    if (search) {
      const escapeRegExp = (text) =>
        text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const safeSearch = escapeRegExp(search.trim());
      query.$or = [
        { name: { $regex: safeSearch, $options: "i" } },
        { email: { $regex: safeSearch, $options: "i" } },
        { phone: { $regex: safeSearch, $options: "i" } },
        { subject: { $regex: safeSearch, $options: "i" } },
        { message: { $regex: safeSearch, $options: "i" } },
      ];
    }

    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const total = await Contact.countDocuments(query);
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    res.json({
      contacts,
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Contact message not found" });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Unread", "Read", "Replied"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    contact.status = status;
    if (status === "Replied") {
      contact.repliedAt = new Date();
    }
    await contact.save();

    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  submitContact,
  getContacts,
  getContactById,
  updateContactStatus,
};
