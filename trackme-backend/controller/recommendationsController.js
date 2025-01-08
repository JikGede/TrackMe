exports.getRecommendations = async (req, res) => {
  
  try {
    // Log each parameter individually
    const transportationModels = req.query.transportationModels;
    const energyUsage = req.query.energyUsage;
    const meals = req.query.meals;
    const recommendations = [];

    // Use strict equality and add more logging
    if (transportationModels === 'car' || transportationModels === 'motorcycle') {
      recommendations.push({
        title: 'Use Public Transport',
        description: 'Reduce emissions by 20% by using public transport more often.',
        detail: 'Switching to public transportation can significantly reduce your carbon footprint.',
        benefits: [
          'Reduces air pollution in urban areas.',
          'Saves fuel costs and vehicle maintenance.',
          'Eases traffic congestion.',
        ],
        tips: ['Use public transport at least twice a week.', 'Try alternative routes using buses or trains.'],
      });
    }

    if (energyUsage === 'electricity') {
      recommendations.push({
        title: 'Reduce Energy Consumption',
        description: 'Turn off appliances when not in use to save 15% energy.',
        detail: 'Reducing electricity consumption can significantly lower your households carbon footprint.',
        benefits: ['Lowers strain on power plants.', 'Extends electronics lifespan.', 'Decreases blackout risks.'],
        tips: ['Turn off lights and devices when not in use.', 'Use energy-efficient LED lights.'],
      });
    }

    if (meals === 'high_calorie') {
      recommendations.push({
        title: 'Switch to Plant-Based Meals',
        description: 'Incorporate more plant-based meals to reduce food-related emissions by 10%.',
        detail: 'Eating more plant-based foods helps significantly lower emissions from livestock farming.',
        benefits: ['Reduces methane emissions.', 'Improves health.', 'Preserves natural resources.'],
        tips: ['Replace one meat-based meal per week with a vegetarian or vegan option.'],
      });
    }
    res.status(200).json({ 
      recommendations: recommendations,
      inputParams: {
        transportationModels,
        energyUsage,
        meals
      }
    });
  } catch (error) {
    console.error('Error in getRecommendations:', error);
    res.status(500).json({ 
      message: 'Failed to generate recommendations', 
      error: error.message 
    });
  }
};