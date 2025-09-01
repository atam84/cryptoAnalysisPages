// Donation Configuration for GitHub Pages
// This file contains all donation links and configuration
const DONATION_CONFIG = {
    // Fiat Donations
    fiat: {
        usd: {
            paypal: {
                name: "PayPal (USD)",
                url: "https://www.paypal.com/donate/?hosted_button_id=YOUR_PAYPAL_BUTTON_ID_USD",
                icon: "💳",
                description: "Donate via PayPal in US Dollars"
            },
            googlePay: {
                name: "Google Pay (USD)",
                url: "https://pay.google.com/gp/v/merchant/YOUR_GOOGLE_PAY_ID",
                icon: "📱",
                description: "Donate via Google Pay in US Dollars"
            },
            applePay: {
                name: "Apple Pay (USD)",
                url: "https://apple.co/YOUR_APPLE_PAY_ID",
                icon: "🍎",
                description: "Donate via Apple Pay in US Dollars"
            },
            buyMeACoffee: {
                name: "Buy Me a Coffee (USD)",
                url: "https://www.buymeacoffee.com/YOUR_USERNAME",
                icon: "☕",
                description: "Support via Buy Me a Coffee in US Dollars"
            }
        },
        eur: {
            paypal: {
                name: "PayPal (EUR)",
                url: "https://www.paypal.com/donate/?hosted_button_id=YOUR_PAYPAL_BUTTON_ID_EUR",
                icon: "💳",
                description: "Donate via PayPal in Euros"
            },
            googlePay: {
                name: "Google Pay (EUR)",
                url: "https://pay.google.com/gp/v/merchant/YOUR_GOOGLE_PAY_ID",
                icon: "📱",
                description: "Donate via Google Pay in Euros"
            },
            applePay: {
                name: "Apple Pay (EUR)",
                url: "https://apple.co/YOUR_APPLE_PAY_ID",
                icon: "🍎",
                description: "Donate via Apple Pay in Euros"
            },
            buyMeACoffee: {
                name: "Buy Me a Coffee (EUR)",
                url: "https://www.buymeacoffee.com/YOUR_USERNAME",
                icon: "☕",
                description: "Support via Buy Me a Coffee in Euros"
            }
        }
    },
    
    // Cryptocurrency Donations
    crypto: {
        btc: {
            name: "Bitcoin (BTC)",
            address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
            qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
            icon: "₿",
            description: "Donate Bitcoin to support the project",
            network: "Bitcoin Mainnet"
        },
        eth: {
            name: "Ethereum (ETH)",
            address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
            qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
            icon: "Ξ",
            description: "Donate Ethereum to support the project",
            network: "Ethereum Mainnet"
        },
        ltc: {
            name: "Litecoin (LTC)",
            address: "ltc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
            qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ltc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
            icon: "Ł",
            description: "Donate Litecoin to support the project",
            network: "Litecoin Mainnet"
        },
        ada: {
            name: "Cardano (ADA)",
            address: "addr1qx2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
            qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=addr1qx2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
            icon: "₳",
            description: "Donate Cardano to support the project",
            network: "Cardano Mainnet"
        },
        sol: {
            name: "Solana (SOL)",
            address: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
            qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
            icon: "◎",
            description: "Donate Solana to support the project",
            network: "Solana Mainnet"
        },
        bnb: {
            name: "BNB Smart Chain (BNB)",
            address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
            qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
            icon: "🟡",
            description: "Donate BNB to support the project",
            network: "BNB Smart Chain"
        },
        dot: {
            name: "Polkadot (DOT)",
            address: "1x2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
            qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=1x2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
            icon: "●",
            description: "Donate Polkadot to support the project",
            network: "Polkadot Relay Chain"
        },
        xrp: {
            name: "Ripple (XRP)",
            address: "r9cZA1nxHfYqjA5giSwqkqkqkqkqkqkqkq",
            qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=r9cZA1nxHfYqjA5giSwqkqkqkqkqkqkqkq",
            icon: "✖",
            description: "Donate XRP to support the project",
            network: "XRP Ledger"
        }
    },
    
    // Donation Settings
    settings: {
        defaultCurrency: "usd",
        showQRCode: true,
        copyToClipboard: true,
        donationMessage: "Thank you for supporting the Crypto Analysis Project! 🚀",
        minDonation: {
            usd: 1,
            eur: 1,
            crypto: 0.001
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DONATION_CONFIG;
}
