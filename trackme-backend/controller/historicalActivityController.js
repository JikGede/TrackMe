const DailyActivity = require('../database/dailyActivityModel');

// Fungsi untuk mendapatkan Historical Activity
exports.getHistoricalActivities = async (req, res) => {
  try {
    const activities = await DailyActivity.find().sort({ date: -1 }); // Ambil semua aktivitas berdasarkan tanggal terbaru
    const historicalActivities = activities.map((activity) => ({
      title: 'Daily Activity on ' + activity.date.toDateString(),
      description: `
        Transportation: ${activity.transportationModels},
        Energy Usage: ${activity.energyUsage},
        Meals: ${activity.meals}.
      `,
    }));

    res.status(200).json({ historicalActivities });
  } catch (error) {
    console.error('Error fetching historical activities:', error);
    res.status(500).json({ message: 'Failed to fetch historical activities', error });
  }
};
