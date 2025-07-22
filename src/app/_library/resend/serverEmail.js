"use server";

async function serverSendNewOrderEmail(toEmail, orderNumer, htmlBody) {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Kick Start Records <orders@kickstartrecords.com>",
        to: [toEmail],
        bcc: "admin@kickstartrecords.com",
        subject: `You order #${orderNumer}`,
        html: htmlBody,
      }),
    });

    if (!res.ok) {
      throw new Error(`${res.status} - failed to send email to ${toEmail}`);
    }
    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.log(error.message);
  }
}

export { serverSendNewOrderEmail };
