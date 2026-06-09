import crypto from 'crypto';
import User from '../models/User.js';
import { sendEmail } from '../utils/email.js';
import { signToken } from '../utils/token.js';

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified
  };
}

export async function register(req, res) {
  const { name, email, password, role = 'user' } = req.body;
  const normalizedRole = role === 'admin' ? 'admin' : 'user';
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email is already registered' });

  const user = new User({ name, email, password, role: normalizedRole });
  const verificationToken = user.createToken('verify');
  await user.save();

  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
  await sendEmail({
    to: user.email,
    subject: 'Verify your PizzaCraft email',
    text: `Verify your email: ${verifyUrl}`,
    html: `<p>Welcome to PizzaCraft. Verify your email here: <a href="${verifyUrl}">${verifyUrl}</a></p>`
  });

  res.status(201).json({
    token: signToken(user),
    user: publicUser(user),
    message: 'Registration successful. Check email console/SMTP inbox for verification link.'
  });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({ token: signToken(user), user: publicUser(user) });
}

export async function me(req, res) {
  res.json({ user: publicUser(req.user) });
}

export async function verifyEmail(req, res) {
  const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    emailVerificationToken: hashed,
    emailVerificationExpires: { $gt: Date.now() }
  });
  if (!user) return res.status(400).json({ message: 'Verification token is invalid or expired' });

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  res.json({ message: 'Email verified successfully' });
}

export async function forgotPassword(req, res) {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.json({ message: 'If that email exists, reset instructions were sent.' });

  const resetToken = user.createToken('reset');
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await sendEmail({
    to: user.email,
    subject: 'Reset your PizzaCraft password',
    text: `Reset your password: ${resetUrl}`,
    html: `<p>Reset your password here: <a href="${resetUrl}">${resetUrl}</a></p>`
  });

  res.json({ message: 'If that email exists, reset instructions were sent.' });
}

export async function resetPassword(req, res) {
  const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) return res.status(400).json({ message: 'Reset token is invalid or expired' });

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: 'Password reset successful' });
}
