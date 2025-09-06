const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const { connectionModel } = require("../models/connectionRequest");
const { sendEmail }  = require('./emailService');

const scheduler = cron.schedule("* 8 * * *", async () => {
  try {
    const yesterday = subDays(new Date(), 1);
    const yesterdayStartDay = startOfDay(yesterday);
    const yesterdayEndDay = endOfDay(yesterday);

    const yesterdayFriendRequests = await connectionModel
      .find({
        status: "interested",
        createdAt: {
          $gte: yesterdayStartDay,
          $lte: yesterdayEndDay,
        },
      })
      .populate("sender receiver");

    if (!yesterdayFriendRequests) return;
    const emails = [
      ...new Set(yesterdayFriendRequests.map((item) => item.receiver.email)),
    ];

    for (const email of emails) {
      try {
        // sending email
        const subject = `You got some friend requests`;
        const html = `
            <h2>Hello ${email},</h2>
            <p>You got some friend requests</b>.</p>
            <p>Login to your account to accept or decline.</p>
        `;

        await sendEmail("ankurkushwaha7408@gmail.com", subject, html);
      } catch (err) {
        console.error(err.message);
      }
    }
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = scheduler;
