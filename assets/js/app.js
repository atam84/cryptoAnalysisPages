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
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.updateVersionDisplay();
        await this.loadData();
        this.updateStats();
        this.renderSignals();
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
            }
        });
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
                        if (timeframeSignals && timeframeSignals.length > 0) {
                            // Only take the first timeframe signal to avoid duplicates
                            const firstSignal = timeframeSignals[0];
                            allSignals.push(firstSignal);
                            loadedPairs.add(pair.symbol);
                            console.log(`✅ Created timeframe signal card for ${pair.symbol}`);
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
            modalTitle.textContent = `📊 ${pair} - Trading Details`;
            
            // Populate timeframes tab
            if (timeframesTab) {
                console.log(`🔍 Opening modal for ${pair}, populating timeframes tab...`);
                timeframesTab.innerHTML = '<div class="loading">Loading timeframe data...</div>';
                
                // Load and display actual timeframe data files
                this.loadTimeframeDataForModal(pair, timeframesTab);
            }
            
            // Populate graphs tab
            if (graphsTab) {
                let graphsHTML = '<div class="graphs-data">';
                graphsHTML += '<h4>📊 Chart Analysis</h4>';
                
                // Try to load chart images
                const chartTimeframes = ['1h', '8h', '1d'];
                chartTimeframes.forEach(tf => {
                    const chartUrl = `./assets/pairs/${pair}/graph-${pair}-${tf}.png`;
                    graphsHTML += `
                        <div class="chart-item">
                            <h5>${tf} Chart</h5>
                            <div class="chart-container">
                                <img src="${chartUrl}" alt="${pair} ${tf} chart" 
                                     onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
                                     class="chart-image">
                                <div class="chart-placeholder" style="display: none;">
                                    <p>📊 Chart not available for ${tf} timeframe</p>
                                </div>
                            </div>
                        </div>
                    `;
                });
                
                graphsHTML += '</div>';
                graphsTab.innerHTML = graphsHTML;
            }
            
            // Populate analysis tab
            if (analysisTab) {
                let analysisHTML = '<div class="analysis-data">';
                analysisHTML += '<h4>🧠 Detailed Analysis</h4>';
                
                if (signals && signals.length > 0) {
                    const signal = signals[0]; // Use first signal for analysis
                    analysisHTML += `
                        <div class="analysis-content">
                            <div class="analysis-section">
                                <h5>📊 Classification</h5>
                                <p><strong>Type:</strong> ${signal.classification?.type || 'N/A'}</p>
                                <p><strong>Confidence:</strong> ${signal.classification?.confidence || 'N/A'}</p>
                                <p><strong>Confluence Score:</strong> ${signal.classification?.confluence_score || 'N/A'}/10</p>
                                <p><strong>Win Rate:</strong> ${signal.classification?.win_rate || 'N/A'}%</p>
                            </div>
                            
                            <div class="analysis-section">
                                <h5>🎯 Recommendation</h5>
                                <p><strong>Action:</strong> ${signal.recommendation?.action || 'N/A'}</p>
                                <p><strong>Entry Range:</strong> ${signal.recommendation?.entry_range || 'N/A'}</p>
                                <p><strong>Targets:</strong> ${signal.recommendation?.targets || 'N/A'}</p>
                                <p><strong>Stop Loss:</strong> ${signal.recommendation?.stop_loss || 'N/A'}</p>
                            </div>
                            
                            <div class="analysis-section">
                                <h5>🧠 Reasoning</h5>
                                <p>${signal.reasoning || 'No reasoning provided'}</p>
                            </div>
                        </div>
                    `;
                } else {
                    analysisHTML += '<p>No analysis data available</p>';
                }
                
                analysisHTML += '</div>';
                analysisTab.innerHTML = analysisHTML;
            }
            
            // Show modal
            modal.style.display = 'block';
            
            // Switch to timeframes tab by default
            this.switchDetailsTab('timeframes');
            
        } catch (error) {
            console.error('❌ Error opening details modal:', error);
        }
    }

    openDetailsModalWithGraphs(pair, signals) {
        // Open the same modal but switch to graphs tab
        this.openDetailsModal(pair, signals);
        
        // Switch to graphs tab after a short delay to ensure modal is loaded
        setTimeout(() => {
            this.switchDetailsTab('graphs');
        }, 100);
    }

    hideDetailsModal() {
        const modal = document.getElementById('detailsModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    async loadTimeframeDataForModal(pair, timeframesTab) {
        try {
            console.log(`🔍 Loading timeframe data for ${pair}...`);
            const timeframes = ['1h', '8h', '1d'];
            let timeframesHTML = '<div class="timeframe-data">';
            timeframesHTML += '<h4>⏰ Timeframe Analysis</h4>';
            
            // Try to load main data first
            const mainDataUrl = `./assets/pairs/${pair}/data-${pair}.json`;
            console.log(`📊 Attempting to load main data: ${mainDataUrl}`);
            const mainResponse = await fetch(mainDataUrl + '?v=' + Date.now());
            
            if (mainResponse.ok) {
                const mainData = await mainResponse.json();
                console.log(`✅ Main data loaded for ${pair}:`, mainData);
                timeframesHTML += `
                    <div class="timeframe-item main-timeframe">
                        <h5>📊 Main Data</h5>
                        <div class="timeframe-metrics">
                            ${this.createTimeframeMetrics(mainData)}
                        </div>
                    </div>
                `;
            } else {
                console.log(`⚠️ Main data not available for ${pair}`);
            }
            
            // Load timeframe-specific data
            for (const timeframe of timeframes) {
                try {
                    const url = `./assets/pairs/${pair}/data-${pair}-${timeframe}.json`;
                    console.log(`⏰ Loading ${timeframe} data: ${url}`);
                    const response = await fetch(url + '?v=' + Date.now());
                    
                    if (response.ok) {
                        const data = await response.json();
                        console.log(`✅ ${timeframe} data loaded for ${pair}:`, data);
                        timeframesHTML += `
                            <div class="timeframe-item">
                                <h5>⏰ ${timeframe} Timeframe</h5>
                                <div class="timeframe-metrics">
                                    ${this.createTimeframeMetrics(data, timeframe)}
                                </div>
                            </div>
                        `;
                    } else {
                        console.log(`⚠️ ${timeframe} data not available for ${pair}`);
                        timeframesHTML += `
                            <div class="timeframe-item unavailable">
                                <h5>⏰ ${timeframe} Timeframe</h5>
                                <div class="timeframe-status">
                                    <span class="status warning">⚠️ Data not available</span>
                                </div>
                            </div>
                        `;
                    }
                } catch (error) {
                    console.log(`❌ Error loading ${timeframe} data for ${pair}:`, error);
                    timeframesHTML += `
                        <div class="timeframe-item unavailable">
                            <h5>⏰ ${timeframe} Timeframe</h5>
                            <div class="timeframe-status">
                                <span class="status warning">⚠️ Error loading data</span>
                            </div>
                        </div>
                    `;
                }
            }
            
            timeframesHTML += '</div>';
            timeframesTab.innerHTML = timeframesHTML;
            console.log(`✅ Timeframe modal populated for ${pair}`);
            
        } catch (error) {
            console.error('❌ Error loading timeframe data for modal:', error);
            timeframesTab.innerHTML = '<div class="error">Error loading timeframe data. Please try again.</div>';
        }
    }

    createTimeframeMetrics(data, timeframe = null) {
        try {
            console.log(`🔍 Creating metrics for ${timeframe || 'main'} data:`, data);
            const signalData = data.signal || data;
            if (!signalData) {
                console.log(`⚠️ No signal data found in ${timeframe || 'main'} data`);
                return '<p>No signal data available</p>';
            }
            
            let metricsHTML = '';
            
            // Classification metrics
            if (signalData.classification) {
                metricsHTML += `
                    <div class="metric-section">
                        <h6>📊 Classification</h6>
                        <div class="metric-row">
                            <span class="metric-label">Type:</span>
                            <span class="metric-value">${signalData.classification.type || 'N/A'}</span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-label">Confidence:</span>
                            <span class="metric-value">${signalData.classification.confidence || 'N/A'}</span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-label">Confluence Score:</span>
                            <span class="metric-value">${signalData.classification.confluence_score || 'N/A'}</span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-label">Win Rate:</span>
                            <span class="metric-value">${signalData.classification.expected_win_rate || signalData.classification.win_rate || 'N/A'}</span>
                        </div>
                    </div>
                `;
            }
            
            // Recommendation metrics
            if (signalData.recommendation) {
                metricsHTML += `
                    <div class="metric-section">
                        <h6>🎯 Recommendation</h6>
                        <div class="metric-row">
                            <span class="metric-label">Action:</span>
                            <span class="metric-value ${signalData.recommendation.action ? signalData.recommendation.action.toLowerCase() : ''}">${signalData.recommendation.action || 'N/A'}</span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-label">Entry Range:</span>
                            <span class="metric-value">${this.formatEntryRange(signalData.recommendation.entry_range)}</span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-label">Stop Loss:</span>
                            <span class="metric-value">${this.formatStopLoss(signalData.recommendation.stop_loss)}</span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-label">Take Profit:</span>
                            <span class="metric-value">${this.formatTakeProfit(signalData.recommendation.take_profit)}</span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-label">Risk/Reward:</span>
                            <span class="metric-value">${signalData.recommendation.risk_reward_ratio || 'N/A'}</span>
                        </div>
                    </div>
                `;
            }
            
            // Technical analysis metrics
            if (signalData.technical_analysis) {
                metricsHTML += `
                    <div class="metric-section">
                        <h6>🔧 Technical Analysis</h6>
                        <div class="metric-row">
                            <span class="metric-label">Primary TF:</span>
                            <span class="metric-value">${signalData.technical_analysis.primary_timeframe || 'N/A'}</span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-label">Trend:</span>
                            <span class="metric-value">${signalData.technical_analysis.trend_direction || 'N/A'}</span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-label">Volume:</span>
                            <span class="metric-value">${signalData.technical_analysis.volume_confirmation || 'N/A'}</span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-label">Pattern Strength:</span>
                            <span class="metric-value">${signalData.technical_analysis.pattern_strength || 'N/A'}</span>
                        </div>
                    </div>
                `;
            }
            
            // Add position sizing if available
            if (signalData.position_sizing) {
                metricsHTML += `
                    <div class="metric-section">
                        <h6>💰 Position Sizing</h6>
                        <div class="metric-row">
                            <span class="metric-label">Confidence Tier:</span>
                            <span class="metric-value">${signalData.position_sizing.confidence_tier || 'N/A'}</span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-label">Position Size:</span>
                            <span class="metric-value">${signalData.position_sizing.suggested_position_size || signalData.position_sizing.position_size || 'N/A'}</span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-label">Portfolio Risk:</span>
                            <span class="metric-value">${signalData.position_sizing.max_portfolio_risk || signalData.position_sizing.portfolio_risk || 'N/A'}</span>
                        </div>
                    </div>
                `;
            }
            
            // Add risk management if available
            if (signalData.risk_management) {
                metricsHTML += `
                    <div class="metric-section">
                        <h6>⚠️ Risk Management</h6>
                        <div class="metric-row">
                            <span class="metric-label">Stop Loss Type:</span>
                            <span class="metric-value">${signalData.risk_management.stop_loss_type || 'N/A'}</span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-label">Exit Strategy:</span>
                            <span class="metric-value">${signalData.risk_management.exit_strategy || 'N/A'}</span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-label">Max Drawdown:</span>
                            <span class="metric-value">${signalData.risk_management.max_drawdown || 'N/A'}</span>
                        </div>
                    </div>
                `;
            }
            
            // Add reasoning if available
            if (signalData.reasoning) {
                metricsHTML += `
                    <div class="metric-section">
                        <h6>🧠 Analysis & Reasoning</h6>
                        <div class="reasoning-content">
                            <p>${signalData.reasoning}</p>
                        </div>
                    </div>
                `;
            }
            
            console.log(`✅ Metrics created successfully for ${timeframe || 'main'}`);
            return metricsHTML;
            
        } catch (error) {
            console.error('❌ Error creating timeframe metrics:', error);
            return '<p>Error processing data</p>';
        }
    }

    formatEntryRange(entryRange) {
        if (!entryRange) return 'N/A';
        if (Array.isArray(entryRange)) {
            return `${entryRange[0]} - ${entryRange[1]}`;
        } else if (typeof entryRange === 'object') {
            return `${entryRange.min || 'N/A'} - ${entryRange.max || 'N/A'}`;
        }
        return entryRange;
    }

    formatStopLoss(stopLoss) {
        if (!stopLoss) return 'N/A';
        if (typeof stopLoss === 'object') {
            return stopLoss.price || stopLoss.percentage || 'N/A';
        }
        return stopLoss;
    }

    formatTakeProfit(takeProfit) {
        if (!takeProfit) return 'N/A';
        if (Array.isArray(takeProfit)) {
            return takeProfit.join(' - ');
        }
        return takeProfit;
    }

    switchDetailsTab(tabName) {
        try {
            // Hide all tab contents
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => {
                content.style.display = 'none';
            });
            
            // Remove active class from all tab buttons
            const tabButtons = document.querySelectorAll('.detail-tab-btn');
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Show selected tab content
            const selectedTab = document.getElementById(tabName + 'Tab');
            if (selectedTab) {
                selectedTab.style.display = 'block';
            }
            
            // Add active class to selected tab button
            const selectedButton = document.querySelector(`[data-tab="${tabName}"]`);
            if (selectedButton) {
                selectedButton.classList.add('active');
            }
            
        } catch (error) {
            console.error('❌ Error switching tabs:', error);
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new ConsoleTradingDashboard();
});
