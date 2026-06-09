import nodemailer from 'nodemailer';

function hasSmtpConfig() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function sendEmail({ to, subject, html, text }) {
  if (!hasSmtpConfig()) {
    console.log('\n--- Development email ---');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(text || html.replace(/<[^>]+>/g, ' '));
    console.log('--- End email ---\n');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'PizzaCraft <no-reply@pizzacraft.local>',
    to,
    subject,
    html,
    text
  });
}

export async function sendLowStockEmail(item) {
  await sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `Low stock alert: ${item.name}`,
    text: `${item.name} ${item.category} stock is ${item.stock}, below threshold ${item.threshold}.`,
    html: `<p><strong>${item.name}</strong> ${item.category} stock is ${item.stock}, below threshold ${item.threshold}.</p>`
  });
}
