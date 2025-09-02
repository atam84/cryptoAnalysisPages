// Console-Style Trading Signals Dashboard
class ConsoleTradingDashboard {
    constructor() {
        this.data = [];
        this.filteredData = [];
        this.pairs = [];
        this.dataCache = new Map();
        this.currentFilters = {
            pair: 'all',
            timeframe: 'all',
            trend: 'all',
            action: 'all'
        };
        this.isLoading = false;
        this.currentTheme = 'dark'; // Default theme
        
        this.init();
    }

    async init() {
        console.log('🔄 Initializing dashboard...');
        console.log('🔍 DOM ready state:', document.readyState);
        console.log('🔍 Theme switcher element exists:', !!document.getElementById('themeSwitcher'));
        
        this.setupEventListeners();
        console.log('✅ Event listeners setup complete');
        
        this.updateVersionDisplay();
        console.log('✅ Version display updated');
        
        await this.loadData();
        console.log('✅ Data loaded');
        
        this.updateStats();
        console.log('✅ Stats updated');
        
        this.renderSignals();
        console.log('✅ Signals rendered');
        
        console.log('✅ Dashboard initialization complete');
    }

    updateVersionDisplay() {
        // Update version display
        const versionElement = document.getElementById('dashboardVersion');
        const dateElement = document.getElementById('lastUpdateDate');
        
        if (versionElement) {
            versionElement.textContent = DASHBOARD_VERSION;
        }
        
        if (dateElement) {
            const today = new Date().toISOString().split('T')[0];
            dateElement.textContent = today;
        }
        
        console.log(`📊 Console Dashboard initialized - Version ${DASHBOARD_VERSION}`);
    }

    incrementVersion() {
        // This method should be called before pushing changes
        const newVersion = incrementVersion();
        console.log(`🚀 Version increment required before push: ${DASHBOARD_VERSION} → ${newVersion}`);
        console.log(`📝 Update DASHBOARD_VERSION constant and add to VERSION_HISTORY`);
        return newVersion;
    }

    showVersionInfoModal() {
        this.populateVersionInfo();
        document.getElementById('versionInfoModal').style.display = 'block';
    }

    hideVersionInfoModal() {
        document.getElementById('versionInfoModal').style.display = 'none';
    }

    populateVersionInfo() {
        // Update modal version display
        const modalVersion = document.getElementById('modalVersion');
        const modalDate = document.getElementById('modalDate');
        
        if (modalVersion) modalVersion.textContent = DASHBOARD_VERSION;
        if (modalDate) modalDate.textContent = new Date().toISOString().split('T')[0];
        
        // Populate version history
        const historyList = document.getElementById('versionHistoryList');
        if (historyList) {
            historyList.innerHTML = VERSION_HISTORY.map(version => `
                <div class="version-item">
                    <span class="version">v${version.version}</span>
                    <span class="date">${version.date}</span>
                    <span class="changes">${version.changes}</span>
                </div>
            `).join('');
        }
    }

    setupEventListeners() {
        // Populate pair filter options
        this.populatePairFilter();
        
        // Setup theme switcher
        this.setupThemeSwitcher();
        
        // Setup filter event listeners
        document.getElementById('pairFilter').addEventListener('change', (e) => {
            this.currentFilters.pair = e.target.value;
            this.applyFilters();
        });
        
        document.getElementById('timeframeFilter').addEventListener('change', (e) => {
            this.currentFilters.timeframe = e.target.value;
            this.applyFilters();
        });
        
        document.getElementById('trendFilter').addEventListener('change', (e) => {
            this.currentFilters.trend = e.target.value;
            this.applyFilters();
        });
        
        document.getElementById('actionFilter').addEventListener('change', (e) => {
            this.currentFilters.action = e.target.value;
            this.applyFilters();
        });
        
        // Setup refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.refreshData();
        });
        
        // Setup donation button
        const donateBtn = document.getElementById('donateBtn');
        if (donateBtn) {
            console.log('✅ Donate button found, adding event listener');
            donateBtn.addEventListener('click', () => {
                console.log('🔄 Donate button clicked!');
                this.showDonationModal();
            });
        } else {
            console.error('❌ Donate button not found!');
        }
        
        // Setup donation modal close button
        const closeDonationModal = document.getElementById('closeDonationModal');
        if (closeDonationModal) {
            closeDonationModal.addEventListener('click', () => {
                console.log('🔄 Closing donation modal');
                this.hideDonationModal();
            });
        }

        // Setup data status modal
        document.getElementById('dataStatusBtn').addEventListener('click', () => {
            this.showDataStatusModal();
        });

        document.getElementById('closeDataStatusModal').addEventListener('click', () => {
            this.hideDataStatusModal();
        });

        // Setup version info modal
        document.getElementById('versionInfoBtn').addEventListener('click', () => {
            this.showVersionInfoModal();
        });

        document.getElementById('closeVersionInfoModal').addEventListener('click', () => {
            this.hideVersionInfoModal();
        });

        document.getElementById('versionIncrementBtn').addEventListener('click', () => {
            this.incrementVersion();
        });

        // Setup details modal
        document.getElementById('closeDetailsModal').addEventListener('click', () => {
            this.hideDetailsModal();
        });

        // Setup details modal tab switching
        document.querySelectorAll('.detail-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchDetailsTab(tabName);
            });
        });

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideDataStatusModal();
                this.hideDetailsModal();
                this.hideVersionInfoModal();
                this.hideDonationModal();
            }
        });
    }

    setupThemeSwitcher() {
        console.log('🔧 Setting up theme switcher...');
        const themeSwitcher = document.getElementById('themeSwitcher');
        console.log('🎯 Theme switcher element:', themeSwitcher);
        
        if (!themeSwitcher) {
            console.error('❌ Theme switcher element not found!');
            return;
        }

        // Initialize theme from localStorage, system preference, or default to dark
        const savedTheme = localStorage.getItem('theme');
        const systemTheme = this.getSystemTheme();
        const currentTheme = savedTheme || systemTheme || 'dark';
        
        console.log('🎨 Initial theme setup:', { savedTheme, systemTheme, currentTheme });
        
        this.setTheme(currentTheme);

        // Add click event listener
        themeSwitcher.addEventListener('click', () => {
            console.log('🖱️ Theme switcher clicked!');
            const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
            console.log('🔄 Switching theme from', this.currentTheme, 'to', newTheme);
            this.setTheme(newTheme);
        });
        
        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) { // Only auto-switch if user hasn't set a preference
                    const newTheme = e.matches ? 'dark' : 'light';
                    this.setTheme(newTheme);
                }
            });
        }
        
        console.log('✅ Theme switcher setup complete');
    }

    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    setTheme(theme) {
        console.log('🎨 setTheme called with:', theme);
        this.currentTheme = theme;
        
        // Apply theme to both html and body elements for better compatibility
        document.documentElement.setAttribute('data-theme', theme);
        document.body.setAttribute('data-theme', theme);
        console.log('📝 Set data-theme attribute to html:', theme);
        console.log('📝 Set data-theme attribute to body:', theme);
        console.log('🔍 Document element data-theme:', document.documentElement.getAttribute('data-theme'));
        console.log('🔍 Body data-theme:', document.body.getAttribute('data-theme'));
        
        // Save to localStorage
        localStorage.setItem('theme', theme);
        console.log('💾 Saved theme to localStorage:', theme);
        
        // Update theme switcher display
        const themeSwitcher = document.getElementById('themeSwitcher');
        if (themeSwitcher) {
            const themeIcon = themeSwitcher.querySelector('.theme-icon');
            const themeText = themeSwitcher.querySelector('.theme-text');
            
            if (theme === 'light') {
                themeIcon.textContent = '☀️';
                themeText.textContent = 'Light Mode';
            } else {
                themeIcon.textContent = '🌙';
                themeText.textContent = 'Dark Mode';
            }
            
            console.log('🔄 Updated theme switcher display:', { icon: themeIcon.textContent, text: themeText.textContent });
        } else {
            console.error('❌ Theme switcher not found in setTheme');
        }
        
        console.log(`🎨 Theme switched to: ${theme}`);
    }

    async loadData() {
        try {
            this.setLoadingState(true);
            console.log('🔄 Loading trading signals...');
            console.log(`🚀 Console Dashboard version: ${DASHBOARD_VERSION} - Dual Data Type Support with Main Data Files`);
            
            // Load pairs configuration with cache busting
            const pairsResponse = await fetch('./config/pairs.json?v=' + Date.now());
            if (!pairsResponse.ok) {
                throw new Error('Failed to load pairs configuration');
            }
            
            const pairsConfig = await pairsResponse.json();
            console.log('🔍 Pairs config response:', pairsConfig);
            
            // Check if pairsConfig has the expected structure
            if (!pairsConfig) {
                throw new Error('Empty pairs configuration received');
            }
            
            // Handle different possible structures
            if (pairsConfig.pairs && Array.isArray(pairsConfig.pairs)) {
                this.pairs = pairsConfig.pairs;
            } else if (Array.isArray(pairsConfig)) {
                this.pairs = pairsConfig;
            } else {
                console.warn('⚠️ Unexpected pairs config structure:', pairsConfig);
                this.pairs = [];
            }
            
            if (!this.pairs || this.pairs.length === 0) {
                throw new Error('No trading pairs found in configuration');
            }
            
            console.log(`📊 Loaded ${this.pairs.length} trading pairs:`, this.pairs);
            
            // Load data for each pair
            const allSignals = [];
            const loadedPairs = new Set(); // Track loaded pairs to avoid duplicates
            
            for (const pair of this.pairs) {
                try {
                    if (!pair || !pair.symbol) {
                        console.warn('⚠️ Invalid pair configuration:', pair);
                        continue;
                    }
                    
                    // Skip if we already loaded this pair
                    if (loadedPairs.has(pair.symbol)) {
                        console.log(`⚠️ Skipping ${pair.symbol} - already loaded`);
                        continue;
                    }
                    
                    // Try to load main data file first
                    const mainDataUrl = `./assets/pairs/${pair.symbol}/data-${pair.symbol}.json`;
                    const mainResponse = await fetch(mainDataUrl + '?v=' + Date.now());
                    
                    if (mainResponse.ok) {
                        const mainData = await mainResponse.json();
                        console.log(`✅ Loaded main data for ${pair.symbol}`);
                        
                        // Transform main data to signal format
                        const signalData = this.transformMainDataToSignal(mainData, pair.symbol);
                        if (signalData) {
                            allSignals.push(signalData);
                            loadedPairs.add(pair.symbol);
                            console.log(`✅ Created signal card for ${pair.symbol}`);
                        }
                    } else {
                        console.log(`⚠️ Main data not available for ${pair.symbol}, loading timeframe data`);
                        
                        // Load timeframe-specific data
                        const timeframeSignals = await this.loadTimeframeData(pair);
                        console.log(`🔍 Timeframe signals for ${pair.symbol}:`, timeframeSignals);
                        
                        if (timeframeSignals && timeframeSignals.length > 0) {
                            // Create a comprehensive signal card from all timeframe data
                            console.log(`🔄 Creating comprehensive signal for ${pair.symbol} from ${timeframeSignals.length} timeframes`);
                            const comprehensiveSignal = this.createComprehensiveSignalFromTimeframes(pair.symbol, timeframeSignals);
                            console.log(`🔍 Comprehensive signal created:`, comprehensiveSignal);
                            
                            if (comprehensiveSignal) {
                                allSignals.push(comprehensiveSignal);
                                loadedPairs.add(pair.symbol);
                                console.log(`✅ Created comprehensive signal card for ${pair.symbol} from ${timeframeSignals.length} timeframes`);
                            } else {
                                // Fallback to first timeframe if comprehensive creation fails
                                console.log(`⚠️ Comprehensive signal creation failed, falling back to first timeframe`);
                                const firstSignal = timeframeSignals[0];
                                allSignals.push(firstSignal);
                                loadedPairs.add(pair.symbol);
                                console.log(`✅ Created timeframe signal card for ${pair.symbol}`);
                            }
                        } else {
                            console.log(`⚠️ No timeframe data available for ${pair.symbol}`);
                        }
                    }
                } catch (error) {
                    console.error(`❌ Error loading data for ${pair?.symbol || 'unknown'}:`, error);
                }
            }
            
            // If no signals loaded, create a sample signal for testing
            if (allSignals.length === 0) {
                console.log('⚠️ No signals loaded, creating sample data for testing');
                const sampleSignal = this.createSampleSignal();
                if (sampleSignal) {
                    allSignals.push(sampleSignal);
                }
            }
            
            this.data = allSignals;
            this.filteredData = [...this.data];
            
            console.log(`📊 Total signals loaded: ${this.data.length}`);
            
        } catch (error) {
            console.error('❌ Error loading data:', error);
            console.log('🔄 Creating fallback sample data...');
            
            // Create fallback data if configuration fails
            try {
                this.pairs = [
                    { symbol: 'BTC-USDT' },
                    { symbol: 'ETH-USDT' },
                    { symbol: 'BNB-USDT' }
                ];
                
                const sampleSignal = this.createSampleSignal();
                if (sampleSignal) {
                    this.data = [sampleSignal];
                    this.filteredData = [sampleSignal];
                    console.log('✅ Fallback sample data created');
                }
            } catch (fallbackError) {
                console.error('❌ Fallback data creation failed:', fallbackError);
                this.showError(`Failed to load trading signals: ${error.message}`);
            }
        } finally {
            this.setLoadingState(false);
        }
    }

    createSampleSignal() {
        try {
            return {
                pair: 'BTC-USDT',
                timestamp: new Date().toISOString(),
                classification: {
                    type: 'BULLISH',
                    confidence: 'HIGH',
                    confluence_score: '8/10',
                    win_rate: '75%'
                },
                recommendation: {
                    action: 'BUY',
                    entry_range: '45000 - 46000',
                    targets: '48000 - 50000 - 52000',
                    stop_loss: '44000',
                    risk_reward_ratio: '2.5:1'
                },
                position_sizing: {
                    confidence_tier: 'HIGH',
                    position_size: '2.5%',
                    portfolio_risk: '1.5%'
                },
                technical_analysis: {
                    primary_timeframe: '1d',
                    trend: 'UPTREND',
                    volume_confirmation: 'HIGH',
                    pattern_strength: 'STRONG'
                },
                risk_management: {
                    stop_loss_type: 'FIXED',
                    reward_targets: 3,
                    exit_strategy: 'GRADUAL',
                    max_drawdown: '2.5%'
                },
                reasoning: 'Sample signal data for testing purposes. This is a bullish BTC-USDT signal with high confidence and strong technical indicators.',
                trend: 'bullish',
                action: 'buy',
                dataType: 'sample'
            };
        } catch (error) {
            console.error('❌ Error creating sample signal:', error);
            return null;
        }
    }

    transformMainDataToSignal(mainData, pairSymbol) {
        try {
            // Extract the main signal data
            const signalData = mainData.signal || mainData;
            
            if (!signalData) {
                console.warn(`⚠️ No signal data found in main data for ${pairSymbol}`);
                return null;
            }

            // Handle different entry_range formats
            let entryRange = 'N/A';
            if (signalData.recommendation?.entry_range) {
                if (Array.isArray(signalData.recommendation.entry_range)) {
                    // Format: [min, max]
                    entryRange = `${signalData.recommendation.entry_range[0]} - ${signalData.recommendation.entry_range[1]}`;
                } else if (typeof signalData.recommendation.entry_range === 'object') {
                    // Format: {min: x, max: y}
                    entryRange = `${signalData.recommendation.entry_range.min || 'N/A'} - ${signalData.recommendation.entry_range.max || 'N/A'}`;
                }
            }

            // Handle different targets formats
            let targets = 'N/A';
            if (signalData.recommendation?.take_profit) {
                if (Array.isArray(signalData.recommendation.take_profit)) {
                    targets = signalData.recommendation.take_profit.join(' - ');
                }
            } else if (signalData.recommendation?.targets) {
                if (Array.isArray(signalData.recommendation.targets)) {
                    targets = signalData.recommendation.targets.map(t => t.price || t).join(' - ');
                }
            }

            // Create a comprehensive signal object
            const signal = {
                pair: pairSymbol,
                timestamp: mainData.timestamp || new Date().toISOString(),
                classification: {
                    type: signalData.classification?.type || 'N/A',
                    confidence: signalData.classification?.confidence || 'LOW',
                    confluence_score: signalData.classification?.confluence_score || 'N/A',
                    win_rate: signalData.classification?.expected_win_rate || signalData.classification?.win_rate || 'N/A'
                },
                recommendation: {
                    action: signalData.recommendation?.action || 'N/A',
                    entry_range: entryRange,
                    targets: targets,
                    stop_loss: signalData.recommendation?.stop_loss || 'N/A',
                    risk_reward_ratio: signalData.recommendation?.risk_reward_ratio || 'N/A'
                },
                position_sizing: {
                    confidence_tier: signalData.position_sizing?.confidence_tier || 'N/A',
                    position_size: signalData.position_sizing?.suggested_position_size || signalData.position_sizing?.position_size || 'N/A',
                    portfolio_risk: signalData.position_sizing?.max_portfolio_risk || signalData.position_sizing?.portfolio_risk || 'N/A'
                },
                technical_analysis: {
                    primary_timeframe: signalData.technical_analysis?.primary_timeframe || 'N/A',
                    trend: signalData.technical_analysis?.trend_direction || signalData.technical_analysis?.trend || 'N/A',
                    volume_confirmation: signalData.technical_analysis?.volume_confirmation || 'N/A',
                    pattern_strength: signalData.technical_analysis?.pattern_strength || 'N/A'
                },
                risk_management: {
                    stop_loss_type: signalData.risk_management?.stop_loss_type || 'N/A',
                    reward_targets: signalData.risk_management?.reward_targets?.length || signalData.recommendation?.take_profit?.length || 'N/A',
                    exit_strategy: signalData.risk_management?.exit_strategy || 'N/A',
                    max_drawdown: signalData.recommendation?.max_drawdown || signalData.risk_management?.max_drawdown || 'N/A'
                },
                reasoning: signalData.reasoning || 'No reasoning provided',
                trend: this.determineTrend(signalData),
                action: this.determineAction(signalData),
                dataType: 'main'
            };

            return signal;
        } catch (error) {
            console.error(`❌ Error transforming main data for ${pairSymbol}:`, error);
            return null;
        }
    }

    determineTrend(signalData) {
        const classification = signalData.classification || {};
        const type = classification.type || '';
        
        if (type.includes('BULLISH') || type.includes('BUY')) return 'bullish';
        if (type.includes('BEARISH') || type.includes('SELL')) return 'bearish';
        return 'neutral';
    }

    determineAction(signalData) {
        const recommendation = signalData.recommendation || {};
        const action = recommendation.action || '';
        
        if (action.includes('BUY') || action.includes('LONG')) return 'buy';
        if (action.includes('SELL') || action.includes('SHORT')) return 'sell';
        return 'wait';
    }

    async loadTimeframeData(pair) {
        const timeframes = ['1h', '8h', '1d'];
        const signals = [];
        
        for (const timeframe of timeframes) {
            try {
                const url = `./assets/pairs/${pair.symbol}/data-${pair.symbol}-${timeframe}.json`;
                const response = await fetch(url + '?v=' + Date.now());
                
                if (response.ok) {
                    const data = await response.json();
                    const signal = this.transformTimeframeData(data, pair.symbol, timeframe);
                    if (signal) {
                        signals.push(signal);
                    }
                }
            } catch (error) {
                console.log(`⚠️ No data available for ${pair.symbol} ${timeframe}`);
            }
        }
        
        return signals;
    }

    transformTimeframeData(data, pairSymbol, timeframe) {
        try {
            const signalData = data.signal || data;
            
            if (!signalData) return null;

            return {
                pair: pairSymbol,
                timeframe: timeframe,
                timestamp: data.timestamp || new Date().toISOString(),
                classification: signalData.classification || {},
                recommendation: signalData.recommendation || {},
                position_sizing: signalData.position_sizing || {},
                technical_analysis: signalData.technical_analysis || {},
                risk_management: signalData.risk_management || {},
                reasoning: signalData.reasoning || 'No reasoning provided',
                trend: this.determineTrend(signalData),
                action: this.determineAction(signalData),
                dataType: 'timeframe'
            };
        } catch (error) {
            console.error(`❌ Error transforming timeframe data for ${pairSymbol} ${timeframe}:`, error);
            return null;
        }
    }

    createConsoleSignalCard(signal) {
        try {
            const trend = signal.trend || 'neutral';
            const action = signal.action || 'wait';
            
            // Format data for display with safe fallbacks
            const classification = signal.classification || {};
            const recommendation = signal.recommendation || {};
            const positionSizing = signal.position_sizing || {};
            const technical = signal.technical_analysis || {};
            const riskManagement = signal.risk_management || {};
            
            // Entry range and targets are already formatted as strings by transformMainDataToSignal
            const entryRange = recommendation.entry_range || 'N/A';
            const targets = recommendation.targets || 'N/A';
            
            // Format stop loss
            const stopLoss = recommendation.stop_loss || 'N/A';
            
            // Format win rate
            const winRate = classification.win_rate || 'N/A';
            
            // Format risk/reward
            const riskReward = recommendation.risk_reward_ratio || 'N/A';
            
            // Format position size
            const positionSize = positionSizing.position_size || 'N/A';
            
            // Format confluence score
            const confluenceScore = classification.confluence_score || 'N/A';
            
            // Format reasoning (truncate if too long)
            const reasoning = signal.reasoning || 'No reasoning provided';
            const shortReasoning = reasoning.length > 200 ? reasoning.substring(0, 200) + '...' : reasoning;
        
        return `
            <div class="console-signal-card ${trend} ${action}">
                <div class="card-header">
                    <div class="pair-name">${signal.pair}</div>
                    <div class="signal-status">
                        <span class="status-badge ${trend}">
                            ${trend === 'bullish' ? '🐂 BULLISH' : trend === 'bearish' ? '🐻 BEARISH' : '⏸️ NEUTRAL'}
                        </span>
                        <span class="confidence-badge ${classification.confidence ? classification.confidence.toLowerCase() : 'low'}">
                            ${classification.confidence || 'LOW'}
                        </span>
                    </div>
                </div>
                
                <div class="data-section">
                    <div class="section-title">📊 Classification</div>
                    <div class="data-grid">
                        <div class="data-item">
                            <span class="data-label">Type:</span>
                            <span class="data-value">${classification.type || 'N/A'}</span>
                        </div>
                        <div class="data-item">
                            <span class="data-label">Confidence:</span>
                            <span class="data-value ${classification.confidence ? classification.confidence.toLowerCase() : 'low'}">${classification.confidence || 'LOW'}</span>
                        </div>
                        <div class="data-item">
                            <span class="data-label">Confluence:</span>
                            <span class="data-value info">${confluenceScore}</span>
                        </div>
                        <div class="data-item">
                            <span class="data-label">Win Rate:</span>
                            <span class="data-value ${winRate !== 'N/A' ? 'success' : ''}">${winRate}</span>
                        </div>
                    </div>
                </div>
                
                <div class="data-section">
                    <div class="section-title">🎯 Recommendation</div>
                    <div class="data-grid">
                        <div class="data-item">
                            <span class="data-label">Action:</span>
                            <span class="data-value ${action === 'buy' ? 'success' : action === 'sell' ? 'danger' : 'warning'}">${recommendation.action || 'N/A'}</span>
                        </div>
                        <div class="data-item">
                            <span class="data-label">Entry Range:</span>
                            <span class="data-value">${entryRange}</span>
                        </div>
                        <div class="data-item">
                            <span class="data-label">Targets:</span>
                            <span class="data-value">${targets}</span>
                        </div>
                        <div class="data-item">
                            <span class="data-label">Stop Loss:</span>
                            <span class="data-value danger">${stopLoss}</span>
                        </div>
                    </div>
                </div>
                
                <div class="data-section">
                    <div class="section-title">💰 Position Sizing</div>
                    <div class="data-grid">
                        <div class="data-item">
                            <span class="data-label">Confidence Tier:</span>
                            <span class="data-value">${positionSizing.confidence_tier || 'N/A'}</span>
                        </div>
                        <div class="data-item">
                            <span class="data-label">Position Size:</span>
                            <span class="data-value info">${positionSize}</span>
                        </div>
                        <div class="data-item">
                            <span class="data-label">Portfolio Risk:</span>
                            <span class="data-value">${positionSizing.portfolio_risk || 'N/A'}</span>
                        </div>
                        <div class="data-item">
                            <span class="data-label">Risk/Reward:</span>
                            <span class="data-value ${riskReward !== 'N/A' ? 'success' : ''}">${riskReward}</span>
                        </div>
                    </div>
                </div>
                
                <div class="data-section">
                    <div class="section-title">🔧 Technical Analysis</div>
                    <div class="data-grid">
                        <div class="data-item">
                            <span class="data-label">Primary TF:</span>
                            <span class="data-value">${technical.primary_timeframe || 'N/A'}</span>
                        </div>
                        <div class="data-item">
                            <span class="data-label">Trend:</span>
                            <span class="data-value">${technical.trend || 'N/A'}</span>
                        </div>
                        <div class="data-item">
                            <span class="data-label">Volume:</span>
                            <span class="data-value ${technical.volume_confirmation ? technical.volume_confirmation.toLowerCase() : ''}">${technical.volume_confirmation || 'N/A'}</span>
                        </div>
                        <div class="data-item">
                            <span class="data-label">Pattern:</span>
                            <span class="data-value">${technical.pattern_strength || 'N/A'}</span>
                        </div>
                    </div>
                </div>
                
                <div class="data-section">
                    <div class="section-title">⚠️ Risk Management</div>
                    <div class="data-grid">
                        <div class="data-item">
                            <span class="data-label">Stop Loss Type:</span>
                            <span class="data-value">${riskManagement.stop_loss_type || 'N/A'}</span>
                        </div>
                        <div class="data-item">
                            <span class="data-label">Reward Targets:</span>
                            <span class="data-value">${riskManagement.reward_targets ? riskManagement.reward_targets.length : 'N/A'}</span>
                        </div>
                        <div class="data-item">
                            <span class="data-label">Exit Strategy:</span>
                            <span class="data-value">${riskManagement.exit_strategy || 'N/A'}</span>
                        </div>
                        <div class="data-item">
                            <span class="data-label">Max Drawdown:</span>
                            <span class="data-value danger">${riskManagement.max_drawdown || 'N/A'}</span>
                        </div>
                    </div>
                </div>
                
                <div class="analysis-section">
                    <div class="section-title">🧠 Analysis & Reasoning</div>
                    <div class="analysis-content">${shortReasoning}</div>
                </div>
                
                <div class="action-buttons">
                    <button class="action-btn" onclick="dashboard.openDetailsModal('${signal.pair}', ${JSON.stringify([signal]).replace(/"/g, '&quot;')})">
                        📋 Details
                    </button>
                    <button class="action-btn" onclick="dashboard.openDetailsModalWithGraphs('${signal.pair}', ${JSON.stringify([signal]).replace(/"/g, '&quot;')})">
                        📊 Charts
                    </button>
                </div>
            </div>
        `;
        } catch (error) {
            console.error('❌ Error creating console signal card:', error);
            console.error('Signal data:', signal);
            return `
                <div class="console-signal-card error">
                    <div class="card-header">
                        <div class="pair-name">${signal.pair || 'Unknown'}</div>
                        <div class="signal-status">
                            <span class="status-badge error">⚠️ ERROR</span>
                        </div>
                    </div>
                    <div class="error-content">
                        <p>Error displaying signal data. Please check the console for details.</p>
                        <p><strong>Pair:</strong> ${signal.pair || 'Unknown'}</p>
                        <p><strong>Error:</strong> ${error.message}</p>
                    </div>
                </div>
            `;
        }
    }

    renderSignals() {
        const grid = document.getElementById('signalsGrid');
        if (!grid) return;
        
        if (this.filteredData.length === 0) {
            grid.innerHTML = '<div class="loading">No signals found matching the current filters.</div>';
            return;
        }
        
        const cards = this.filteredData.map(signal => this.createConsoleSignalCard(signal));
        grid.innerHTML = cards.join('');
    }

    // ... rest of the methods remain the same as in the original dashboard
    // (applyFilters, updateStats, showDataStatusModal, etc.)
    
    setLoadingState(loading) {
        this.isLoading = loading;
        const grid = document.getElementById('signalsGrid');
        if (grid) {
            grid.innerHTML = loading ? '<div class="loading">Loading trading signals...</div>' : '';
        }
    }

    populatePairFilter() {
        const filter = document.getElementById('pairFilter');
        if (!filter) return;
        
        filter.innerHTML = '<option value="all">All Pairs</option>';
        
        if (this.pairs && this.pairs.length > 0) {
            this.pairs.forEach(pair => {
                if (pair && pair.symbol) {
                    const option = document.createElement('option');
                    option.value = pair.symbol;
                    option.textContent = pair.symbol;
                    filter.appendChild(option);
                }
            });
        }
    }

    applyFilters() {
        this.filteredData = this.data.filter(signal => {
            const pairMatch = this.currentFilters.pair === 'all' || signal.pair === this.currentFilters.pair;
            const timeframeMatch = this.currentFilters.timeframe === 'all' || signal.timeframe === this.currentFilters.timeframe;
            const trendMatch = this.currentFilters.trend === 'all' || signal.trend === this.currentFilters.trend;
            const actionMatch = this.currentFilters.action === 'all' || signal.action === this.currentFilters.action;
            
            return pairMatch && timeframeMatch && trendMatch && actionMatch;
        });
        
        this.renderSignals();
        this.updateStats();
    }

    updateStats() {
        const totalSignals = this.filteredData.length;
        const bullishSignals = this.filteredData.filter(s => s.trend === 'bullish').length;
        const bearishSignals = this.filteredData.filter(s => s.trend === 'bearish').length;
        const waitSignals = this.filteredData.filter(s => s.action === 'wait').length;
        
        document.getElementById('totalSignals').textContent = totalSignals;
        document.getElementById('bullishSignals').textContent = bullishSignals;
        document.getElementById('bearishSignals').textContent = bearishSignals;
        document.getElementById('waitSignals').textContent = waitSignals;
    }

    refreshData() {
        this.loadData();
    }

    showDataStatusModal() {
        this.populateDataStatusModal();
        document.getElementById('dataStatusModal').style.display = 'block';
    }

    hideDataStatusModal() {
        document.getElementById('dataStatusModal').style.display = 'none';
    }

    populateDataStatusModal() {
        const modalBody = document.getElementById('dataStatusModalBody');
        if (!modalBody) return;
        
        let statusHTML = '<div class="data-status">';
        statusHTML += '<h4>📊 Data Availability Status</h4>';
        
        if (!this.pairs || this.pairs.length === 0) {
            statusHTML += '<div class="pair-status">';
            statusHTML += '<span class="status warning">⚠️ No trading pairs configured</span>';
            statusHTML += '</div>';
        } else {
            this.pairs.forEach(pair => {
                if (!pair || !pair.symbol) {
                    console.warn('⚠️ Invalid pair in status modal:', pair);
                    return;
                }
                
                const hasMainData = this.data.some(s => s.pair === pair.symbol && s.dataType === 'main');
                const timeframeData = this.data.filter(s => s.pair === pair.symbol && s.dataType === 'timeframe');
                
                statusHTML += `
                    <div class="pair-status">
                        <span class="pair-name">${pair.symbol}</span>
                        <span class="status ${hasMainData ? 'success' : 'warning'}">
                            ${hasMainData ? '✅ Main Data' : '⚠️ Timeframe Data Only'}
                        </span>
                        <span class="timeframes">
                            ${timeframeData.map(s => s.timeframe).join(', ') || 'No timeframe data'}
                        </span>
                    </div>
                `;
            });
        }
        
        statusHTML += '</div>';
        modalBody.innerHTML = statusHTML;
    }

    showError(message) {
        const grid = document.getElementById('signalsGrid');
        if (grid) {
            grid.innerHTML = `<div class="error">❌ ${message}</div>`;
        }
    }

    openDetailsModal(pair, signals) {
        try {
            const modal = document.getElementById('detailsModal');
            const modalTitle = document.getElementById('detailsModalTitle');
            const timeframesTab = document.getElementById('timeframesTab');
            const graphsTab = document.getElementById('graphsTab');
            const analysisTab = document.getElementById('analysisTab');
            
            if (!modal || !modalTitle) {
                console.error('❌ Modal elements not found');
                return;
            }
            
            // Update modal title
            modalTitle.textContent = `Trading Details: ${pair}`;
            
            // Show modal
            modal.style.display = 'block';
            
            // Populate timeframe data
            if (timeframesTab) {
                this.populateTimeframesTab(timeframesTab, signals);
            }
            
            // Populate graphs tab
            if (graphsTab) {
                this.populateGraphsTab(graphsTab, pair);
            }
            
            // Populate analysis tab
            if (analysisTab) {
                this.populateAnalysisTab(analysisTab, signals);
            }
            
        } catch (error) {
            console.error('❌ Error opening details modal:', error);
        }
    }

    openDetailsModalWithGraphs(pair, signals) {
        // This method can be used for future graph functionality
        this.openDetailsModal(pair, signals);
    }

    populateTimeframesTab(tabElement, signals) {
        if (!signals || signals.length === 0) {
            tabElement.innerHTML = '<div class="no-data">No timeframe data available</div>';
            return;
        }

        let html = '<div class="timeframe-sections">';
        
        signals.forEach(signal => {
            const timeframe = signal.timeframe || 'Unknown';
            const data = signal.data || {};
            
            html += `
                <div class="timeframe-section">
                    <div class="timeframe-header" data-timeframe="${timeframe}">
                        <h4>⏰ ${timeframe.toUpperCase()}</h4>
                        <span class="toggle-icon">▼</span>
                    </div>
                    <div class="timeframe-content" data-timeframe="${timeframe}">
                        <div class="timeframe-metrics">
                            ${this.renderTimeframeMetrics(data, signal)}
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        tabElement.innerHTML = html;
        
        // Setup collapsible functionality
        this.setupCollapsibleTimeframes();
    }

    renderTimeframeMetrics(data, signal) {
        if (signal.dataType === 'signal') {
            return this.renderSignalMetrics(data);
        } else {
            return this.renderPriceMetrics(data);
        }
    }

    renderSignalMetrics(data) {
        if (!data) return '<div class="no-data">No signal data available</div>';
        
        return `
            <div class="metrics-grid">
                <div class="metric-item">
                    <span class="metric-label">Classification:</span>
                    <span class="metric-value">${data.classification || 'N/A'}</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Recommendation:</span>
                    <span class="metric-value">${data.recommendation || 'N/A'}</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Position Sizing:</span>
                    <span class="metric-value">${data.positionSizing || 'N/A'}</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Technical Analysis:</span>
                    <span class="metric-value">${data.technicalAnalysis || 'N/A'}</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Risk Management:</span>
                    <span class="metric-value">${data.riskManagement || 'N/A'}</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Analysis & Reasoning:</span>
                    <span class="metric-value">${data.analysisAndReasoning || 'N/A'}</span>
                </div>
            </div>
        `;
    }

    renderPriceMetrics(data) {
        if (!data) return '<div class="no-data">No price data available</div>';
        
        return `
            <div class="metrics-grid">
                <div class="metric-item">
                    <span class="metric-label">Support:</span>
                    <span class="metric-value">${data.support || 'N/A'}</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Resistance:</span>
                    <span class="metric-value">${data.resistance || 'N/A'}</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Highest:</span>
                    <span class="metric-value">${data.highest || 'N/A'}</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Lowest:</span>
                    <span class="metric-value">${data.lowest || 'N/A'}</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Amplitude:</span>
                    <span class="metric-value">${data.amplitude || 'N/A'}</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Candles:</span>
                    <span class="metric-value">${data.candles || 'N/A'}</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Variations:</span>
                    <span class="metric-value">${data.variations || 'N/A'}</span>
                </div>
            </div>
        `;
    }

    populateGraphsTab(tabElement, pair) {
        tabElement.innerHTML = `
            <div class="graphs-content">
                <h4>📊 Charts for ${pair}</h4>
                <p>Chart functionality coming soon...</p>
                <div class="chart-placeholder">
                    <div class="chart-icon">📈</div>
                    <p>Interactive charts will be displayed here</p>
                </div>
            </div>
        `;
    }

    populateAnalysisTab(tabElement, signals) {
        if (!signals || signals.length === 0) {
            tabElement.innerHTML = '<div class="no-data">No analysis data available</div>';
            return;
        }

        let html = '<div class="analysis-content">';
        html += '<h4>🔍 Technical Analysis</h4>';
        
        signals.forEach(signal => {
            const timeframe = signal.timeframe || 'Unknown';
            const data = signal.data || {};
            
            html += `
                <div class="analysis-section">
                    <h5>${timeframe.toUpperCase()} Analysis</h5>
                    <div class="analysis-data">
                        ${this.renderAnalysisData(data, signal)}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        tabElement.innerHTML = html;
    }

    renderAnalysisData(data, signal) {
        if (signal.dataType === 'signal') {
            return `
                <div class="analysis-metrics">
                    <p><strong>Trend:</strong> ${signal.trend || 'N/A'}</p>
                    <p><strong>Action:</strong> ${signal.action || 'N/A'}</p>
                    <p><strong>Confidence:</strong> ${data.confidence || 'N/A'}</p>
                    <p><strong>Risk Level:</strong> ${data.riskLevel || 'N/A'}</p>
                </div>
            `;
        } else {
            return `
                <div class="analysis-metrics">
                    <p><strong>Price Trend:</strong> ${this.getPriceTrend(data)}</p>
                    <p><strong>Volatility:</strong> ${this.getVolatilityLevel(data)}</p>
                    <p><strong>Support Level:</strong> ${data.support || 'N/A'}</p>
                    <p><strong>Resistance Level:</strong> ${data.resistance || 'N/A'}</p>
                </div>
            `;
        }
    }

    getPriceTrend(data) {
        if (!data.highest || !data.lowest) return 'N/A';
        const range = parseFloat(data.highest) - parseFloat(data.lowest);
        if (range > 0) return 'Bullish';
        if (range < 0) return 'Bearish';
        return 'Neutral';
    }

    getVolatilityLevel(data) {
        if (!data.amplitude) return 'N/A';
        const amplitude = parseFloat(data.amplitude);
        if (amplitude > 10) return 'High';
        if (amplitude > 5) return 'Medium';
        return 'Low';
    }

    setupCollapsibleTimeframes() {
        const headers = document.querySelectorAll('.timeframe-header');
        
        headers.forEach(header => {
            header.addEventListener('click', (e) => {
                const timeframe = header.dataset.timeframe;
                const content = document.querySelector(`.timeframe-content[data-timeframe="${timeframe}"]`);
                const toggleIcon = header.querySelector('.toggle-icon');
                
                if (content && toggleIcon) {
                    const isCollapsed = content.style.display === 'none';
                    
                    if (isCollapsed) {
                        content.style.display = 'block';
                        toggleIcon.textContent = '▼';
                    } else {
                        content.style.display = 'none';
                        toggleIcon.textContent = '▶';
                    }
                }
            });
        });
    }

    switchDetailsTab(tabName) {
        // Hide all tabs
        const tabs = document.querySelectorAll('.tab-content');
        tabs.forEach(tab => tab.style.display = 'none');
        
        // Remove active class from all tab buttons
        const tabButtons = document.querySelectorAll('.detail-tab-btn');
        tabButtons.forEach(btn => btn.classList.remove('active'));
        
        // Show selected tab
        const selectedTab = document.getElementById(tabName + 'Tab');
        if (selectedTab) {
            selectedTab.style.display = 'block';
        }
        
        // Add active class to clicked button
        const clickedButton = document.querySelector(`[data-tab="${tabName}"]`);
        if (clickedButton) {
            clickedButton.classList.add('active');
        }
    }

    hideDetailsModal() {
        const modal = document.getElementById('detailsModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }


    createComprehensiveSignalFromTimeframes(pairSymbol, timeframeSignals) {
        console.log(`🔧 createComprehensiveSignalFromTimeframes called for ${pairSymbol} with ${timeframeSignals.length} signals`);
        console.log(`🔍 First signal data:`, timeframeSignals[0]);
        
        if (!pairSymbol || !timeframeSignals || timeframeSignals.length === 0) {
            console.warn('⚠️ Cannot create comprehensive signal from empty timeframe signals.');
            return null;
        }

        try {
            // For price-based data (like BTC-USDT), create a signal from price analysis
            if (timeframeSignals[0].dataType === 'price') {
                console.log(`💰 Creating price-based signal for ${pairSymbol}`);
                return this.createPriceBasedSignal(pairSymbol, timeframeSignals);
            }
            
            // For signal-based data, aggregate the information
            console.log(`📊 Creating aggregated signal for ${pairSymbol}`);
            return this.createAggregatedSignal(pairSymbol, timeframeSignals);
        } catch (error) {
            console.error(`❌ Error creating comprehensive signal for ${pairSymbol}:`, error);
            return null;
        }
    }

    createPriceBasedSignal(pairSymbol, timeframeSignals) {
        // Analyze price data across timeframes to determine trend and action
        let overallTrend = 'neutral';
        let action = 'wait';
        let support = 'N/A';
        let resistance = 'N/A';
        let highest = 'N/A';
        let lowest = 'N/A';
        
        // Aggregate price data from all timeframes
        timeframeSignals.forEach(signal => {
            const data = signal.data;
            if (data) {
                if (data.support && support === 'N/A') support = data.support;
                if (data.resistance && resistance === 'N/A') resistance = data.resistance;
                if (data.highest && highest === 'N/A') highest = data.highest;
                if (data.lowest && lowest === 'N/A') lowest = data.lowest;
            }
        });

        // Determine trend based on price movement
        if (highest !== 'N/A' && lowest !== 'N/A') {
            const high = parseFloat(highest);
            const low = parseFloat(lowest);
            if (high > low) overallTrend = 'bullish';
            if (high < low) overallTrend = 'bearish';
        }

        // Create a comprehensive signal object
        return {
            pair: pairSymbol,
            timeframe: 'Multi',
            trend: overallTrend,
            action: action,
            data: {
                support: support,
                resistance: resistance,
                highest: highest,
                lowest: lowest,
                analysis: `Price analysis across ${timeframeSignals.length} timeframes`,
                recommendation: overallTrend === 'bullish' ? 'Consider buying on dips' : 
                              overallTrend === 'bearish' ? 'Consider selling on rallies' : 'Wait for clearer direction'
            },
            dataType: 'price_aggregated'
        };
    }

    createAggregatedSignal(pairSymbol, timeframeSignals) {
        // For signal-based data, aggregate the classification and recommendation
        let trend = 'neutral';
        let action = 'wait';
        let confidence = 'LOW';
        let reasoning = `Analysis based on ${timeframeSignals.length} timeframes`;

        // Determine overall trend and action from multiple timeframes
        timeframeSignals.forEach(signal => {
            if (signal.trend && signal.trend !== 'neutral') {
                trend = signal.trend;
            }
            if (signal.action && signal.action !== 'wait') {
                action = signal.action;
            }
            if (signal.data && signal.data.confidence) {
                const sigConfidence = signal.data.confidence.toLowerCase();
                if (sigConfidence.includes('high')) confidence = 'HIGH';
                else if (sigConfidence.includes('medium') && confidence !== 'HIGH') confidence = 'MEDIUM';
            }
        });

        return {
            pair: pairSymbol,
            timeframe: 'Multi',
            trend: trend,
            action: action,
            data: {
                classification: `${trend.toUpperCase()} signal`,
                confidence: confidence,
                recommendation: `${action.toUpperCase()} recommendation`,
                reasoning: reasoning
            },
            dataType: 'signal_aggregated'
        };
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌐 DOM fully loaded, creating dashboard instance...');
    console.log('🔍 Theme switcher element exists:', !!document.getElementById('themeSwitcher'));
    console.log('🔍 Header actions element exists:', !!document.querySelector('.header-actions'));
    
    // Wait a bit more to ensure all elements are fully rendered
    setTimeout(() => {
        console.log('⏰ Delayed initialization, creating dashboard...');
        window.dashboard = new ConsoleTradingDashboard();
    }, 100);
});