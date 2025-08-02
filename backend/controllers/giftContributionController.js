// backend/controllers/giftContributionController.js

const GiftContribution = require('../models/GiftContribution');
const mongoose = require('mongoose');
const Emailhandler = require('../utils/sendEmail');



const createContribution = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: User not found in request' });
    }

    const { productId, productName, productPrice, participants } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid productId' });
    }

    if (!participants || !Array.isArray(participants) || participants.length === 0 || participants.length > 3) {
      return res.status(400).json({ message: 'Participants must be an array with 1-3 emails.' });
    }

    for (const email of participants) {
      if (typeof email !== 'string' || !email.includes('@') || email.trim() === '') {
        return res.status(400).json({ message: `Invalid participant email: ${email}` });
      }
    }

    const deadline = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    const contribution = await GiftContribution.create({
      product: productId,
      productName,
      productPrice,
      createdBy: req.user._id,
      participants: participants.map(email => ({ email: email.trim().toLowerCase() })),
      deadline,
    });

    // Send Email Invitations
    for (const email of participants) {
      await Emailhandler({
        to: email,
        subject: `🎁 You're Invited to Contribute a Gift!`,
        html: `
          <h2>Hello 👋</h2>
          <p>You’ve been invited to contribute towards <strong>${productName}</strong> (Rs. ${productPrice})</p>
          <p>Deadline: <strong>${deadline.toDateString()}</strong></p>
          <p>Click the link below to contribute or decline:</p>
          <a href="http://localhost:3000/contribution/${contribution._id}">View & Respond</a>
          <br><br>
          <p>From, <br/> Best Wishes Team 💜</p>
        `
      });
    }

    res.status(201).json({ success: true, contribution });

  } catch (err) {
    console.error('Error in createContribution:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};


// Other controller functions unchanged (getContribution, markPaid, etc.)
// Just keep the same as you have.

const getContribution = async (req, res) => {
  try {
    const { id } = req.params;
    const contribution = await GiftContribution.findById(id)
      .populate('product')
      .populate('createdBy', 'name email');

    if (!contribution) return res.status(404).json({ message: 'Contribution not found' });

    res.json(contribution);
  } catch (err) {
    console.error('Error in getContribution:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

const markPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const contribution = await GiftContribution.findById(id);
    if (!contribution) return res.status(404).json({ message: 'Contribution not found' });

    const participant = contribution.participants.find(p => p.email === email);
    if (!participant) return res.status(404).json({ message: 'Participant not found' });

    participant.hasPaid = true;
    participant.paidAt = new Date();

    if (contribution.participants.every(p => p.hasPaid)) {
      contribution.status = 'completed';
    }

    await contribution.save();
    res.json(contribution);
  } catch (err) {
    console.error('Error in markPaid:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

const declineContribution = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const contribution = await GiftContribution.findById(id);
    if (!contribution) return res.status(404).json({ message: 'Contribution not found' });

    const participant = contribution.participants.find(p => p.email === email);
    if (!participant) return res.status(404).json({ message: 'Participant not found' });

    participant.declined = true;
    contribution.status = 'cancelled';

    await contribution.save();
    res.json(contribution);
  } catch (err) {
    console.error('Error in declineContribution:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

const listUserContributions = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const userId = req.user._id;

    const contributions = await GiftContribution.find({
      $or: [
        { createdBy: userId },
        { 'participants.email': userEmail }
      ]
    }).populate('product');

    res.json(contributions);
  } catch (err) {
    console.error('Error in listUserContributions:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

module.exports = {
  createContribution,
  getContribution,
  markPaid,
  declineContribution,
  listUserContributions,
};
