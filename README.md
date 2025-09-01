# Crypto Analysis Dashboard

A modern, responsive web dashboard for displaying comprehensive crypto analysis signals and technical analysis data. Built specifically for GitHub Pages compatibility.

## 🚀 Features

- **Real-time Data Display**: Shows all crypto analysis data from the `assets/` directory
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Interactive Filtering**: Filter by timeframe, signal type, and trend direction
- **Modern UI**: Beautiful dark theme with smooth animations and hover effects
- **Statistics Overview**: Key metrics including total pairs, active signals, win rates, and risk levels
- **Export Functionality**: Download filtered data as JSON
- **GitHub Pages Ready**: No server-side dependencies required

## 📁 Project Structure

```
cryptoAnalysisPages/
├── assets/
│   └── pairs/
│       ├── ICP-USDT/
│       │   ├── data-ICP-USDT.json
│       │   ├── data-ICP-USDT-1h.json
│       │   ├── data-ICP-USDT-4h.json
│       │   ├── data-ICP-USDT-8h.json
│       │   └── graph-*.png
│       └── SOL-USDT/
│           ├── data-SOL-USDT.json
│           ├── data-SOL-USDT-1h.json
│           ├── data-SOL-USDT-4h.json
│           ├── data-SOL-USDT-8h.json
│           └── graph-*.png
├── config/
│   └── pairs.json
├── dashboard.html          # Main dashboard (NEW!)
├── index.html             # Legacy signal viewer
├── index2.html            # Legacy page
├── index3.html            # Legacy page
├── index4.html            # Legacy page
└── README.md
```

## 🎯 Dashboard Features

### Overview Statistics
- **Total Pairs**: Count of all available trading pairs
- **Active Signals**: Number of pairs with actionable signals
- **Average Win Rate**: Expected performance across all pairs
- **Risk Level**: Portfolio risk assessment

### Signal Cards
Each trading pair displays:
- **Signal Classification**: MODERATE, HIGH, or NO_SIGNAL
- **Technical Analysis**: Trend direction, volume confirmation, pattern strength
- **Position Sizing**: Confidence tier, base position percentage, risk management
- **Risk Management**: Stop-loss, take-profit targets, risk/reward ratios
- **Recommendations**: Action (BUY/SELL/WAIT), timeframe, entry ranges

### Filtering Options
- **Timeframe**: 1h, 4h, 8h, or all
- **Signal Type**: Filter by signal quality
- **Trend Direction**: Bullish, Bearish, or Neutral

## 🚀 Getting Started

### For GitHub Pages

1. **Upload Files**: Upload the entire repository to GitHub
2. **Enable Pages**: Go to Settings → Pages → Source → Deploy from branch
3. **Access Dashboard**: Navigate to `https://yourusername.github.io/repositoryname/dashboard.html`

### Local Development

1. **Clone Repository**: `git clone <your-repo-url>`
2. **Open Dashboard**: Open `dashboard.html` in your web browser
3. **Data Structure**: Ensure your `assets/pairs/` directory contains the expected JSON structure

## 📊 Data Format

The dashboard expects each trading pair to have a JSON file with this structure:

```json
{
  "signal": {
    "symbol": "ICP-USDT",
    "timestamp": 1756719887.93,
    "analysis_time": "2025-09-01T10:44:47.930+01:00",
    
    "classification": {
      "type": "MODERATE",
      "confidence": "MEDIUM",
      "confluence_score": "6/10",
      "expected_win_rate": "70%",
      "frequency_tier": "MEDIUM"
    },
    
    "recommendation": {
      "action": "WAIT",
      "timeframe": "SWING",
      "entry_range": [4.884, 4.957],
      "stop_loss": 4.7619,
      "take_profit": [5.15, 5.29, 5.58],
      "risk_reward_ratio": 2.5,
      "max_drawdown": "-2.5%"
    },
    
    "technical_analysis": {
      "primary_timeframe": "4h",
      "timeframes_aligned": 2,
      "trend_direction": "BULLISH",
      "volume_confirmation": "STRONG",
      "key_level_proximity": "AT_LEVEL",
      "pattern_strength": "STRONG"
    },
    
    "position_sizing": {
      "confidence_tier": "LOW",
      "base_position_percent": 0.5,
      "max_portfolio_risk": 1,
      "volatility_adjustment": "NORMAL"
    },
    
    "risk_management": {
      "stop_loss_type": "TECHNICAL",
      "reward_targets": [
        {"price": 5.15, "probability": "60%"},
        {"price": 5.29, "probability": "20%"},
        {"price": 5.58, "probability": "10%"}
      ]
    }
  }
}
```

## 🎨 Customization

### Colors and Theme
The dashboard uses CSS custom properties for easy theming. Modify the `:root` section in the CSS to change colors:

```css
:root {
    --primary: #6366f1;        /* Primary accent color */
    --success: #10b981;        /* Success/green color */
    --warning: #f59e0b;        /* Warning/yellow color */
    --danger: #ef4444;         /* Danger/red color */
    --bg-primary: #0f172a;     /* Background color */
    /* ... more variables */
}
```

### Adding New Features
The dashboard is built with a modular JavaScript class structure. You can easily extend it by:

1. Adding new filter options
2. Creating additional visualization components
3. Implementing real-time updates
4. Adding chart integrations

## 🔧 Technical Details

- **No Dependencies**: Pure HTML, CSS, and JavaScript
- **Modern ES6+**: Uses classes, async/await, and modern JavaScript features
- **Responsive Grid**: CSS Grid and Flexbox for responsive layouts
- **Performance**: Efficient data loading and rendering
- **Accessibility**: Semantic HTML and ARIA labels

## 📱 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues or have questions:

1. Check the browser console for error messages
2. Verify your data structure matches the expected format
3. Ensure all JSON files are valid
4. Check that GitHub Pages is properly configured

---

**Note**: The `graphs/` and `config/` directories are not used by the main dashboard. The dashboard focuses on displaying the comprehensive analysis data from the `assets/pairs/` directory.