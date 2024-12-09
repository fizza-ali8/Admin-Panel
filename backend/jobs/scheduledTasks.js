const cron = require('node-cron');
const ScheduledReport = require('../models/ScheduledReport');
const { generateReport } = require('../utils/reportGenerators');
const { sendEmail, emailTemplates } = require('../utils/emailService');

// Run scheduled reports
const runScheduledReports = cron.schedule('0 1 * * *', async () => { // Run at 1 AM daily
  try {
    const reports = await ScheduledReport.find({
      status: 'active',
      nextRun: { $lte: new Date() }
    });

    for (const report of reports) {
      try {
        const reportUrl = await generateReport(report);
        
        // Send email to recipients
        await sendEmail({
          to: report.recipients,
          ...emailTemplates.reportReady(reportUrl)
        });

        // Update report schedule
        report.lastRun = new Date();
        report.nextRun = calculateNextRunDate(report.frequency);
        await report.save();
      } catch (error) {
        console.error(`Failed to generate report ${report._id}:`, error);
      }
    }
  } catch (error) {
    console.error('Scheduled reports job failed:', error);
  }
});

// Clean up old notifications
const cleanupNotifications = cron.schedule('0 0 * * *', async () => { // Run at midnight
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    await Notification.deleteMany({
      status: 'Read',
      createdAt: { $lt: thirtyDaysAgo }
    });
  } catch (error) {
    console.error('Notification cleanup job failed:', error);
  }
});

module.exports = {
  runScheduledReports,
  cleanupNotifications
}; 