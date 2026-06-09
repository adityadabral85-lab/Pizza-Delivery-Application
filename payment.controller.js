import Razorpay from 'razorpay';

function getRazorpay() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return null;
  if (process.env.RAZORPAY_KEY_ID === 'rzp_test_dummykey') return null;
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}

export async function createPaymentOrder(req, res) {
  const { amount } = req.body;
  if (!amount || amount < 1) return res.status(400).json({ message: 'Valid amount is required' });

  const razorpay = getRazorpay();
  if (!razorpay) {
    return res.json({
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummykey',
      order: {
        id: `order_dummy_${Date.now()}`,
        amount: Math.round(amount * 100),
        currency: 'INR',
        status: 'created'
      }
    });
  }

  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency: 'INR',
    receipt: `pizza_${Date.now()}`
  });

  res.json({ keyId: process.env.RAZORPAY_KEY_ID, order });
}
