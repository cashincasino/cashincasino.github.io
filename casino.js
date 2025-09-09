        let currentPage = 'lobby';
        let rouletteBetType = null;
        let diceBetNumber = null;
        let blackjackGame = {
            deck: [],
            playerHand: [],
            dealerHand: [],
            gameActive: false
        };
        let balance = parseInt(localStorage.getItem('balance')) || 10;

        let ownedSkins = JSON.parse(localStorage.getItem('ownedSkins')) || {
            blackjack: ['default'],
            roulette: ['default'],
            plinko: ['default']
        };
        let selectedSkins = JSON.parse(localStorage.getItem('selectedSkins')) || {
            blackjack: 'default',
            roulette: 'default',
            plinko: 'default'
        };

        const skins = {
            blackjack: {
                default: {
                    name: 'default',
                    rarity: 'default',
                    cardBg: 'bg-white',
                    cardText: 'text-black'
                },
                'red-cards': {
                    name: 'red cards',
                    rarity: 'common',
                    cardBg: 'bg-red-500',
                    cardText: 'text-white'
                },
                'blue-cards': {
                    name: 'blue cards',
                    rarity: 'common',
                    cardBg: 'bg-blue-500',
                    cardText: 'text-white'
                },
                'green-cards': {
                    name: 'green cards',
                    rarity: 'common',
                    cardBg: 'bg-green-500',
                    cardText: 'text-white'
                },
                'fire-gradient': {
                    name: 'fire gradient',
                    rarity: 'rare',
                    cardBg: 'bg-gradient-to-r from-red-500 to-orange-500',
                    cardText: 'text-white'
                },
                'ocean-gradient': {
                    name: 'ocean gradient',
                    rarity: 'rare',
                    cardBg: 'bg-gradient-to-r from-blue-500 to-cyan-500',
                    cardText: 'text-white'
                },
                'sunset-gradient': {
                    name: 'sunset gradient',
                    rarity: 'rare',
                    cardBg: 'bg-gradient-to-r from-purple-500 to-pink-500',
                    cardText: 'text-white'
                },
                'galaxy-pattern': {
                    name: 'galaxy pattern',
                    rarity: 'legendary',
                    cardBg: 'bg-black',
                    cardText: 'text-white',
                    pattern: 'galaxy'
                },
                'matrix-pattern': {
                    name: 'matrix pattern',
                    rarity: 'legendary',
                    cardBg: 'bg-black',
                    cardText: 'text-green-400',
                    pattern: 'matrix'
                },
                'neon-circuit': {
                    name: 'neon circuit',
                    rarity: 'legendary',
                    cardBg: 'bg-gray-900',
                    cardText: 'text-cyan-400',
                    pattern: 'circuit'
                }
            },
            roulette: {
                default: {
                    name: 'default',
                    rarity: 'default'
                },
                'rainbow-wheel': {
                    name: 'rainbow wheel',
                    rarity: 'common',
                    type: 'rainbow'
                },
                'gold-wheel': {
                    name: 'gold wheel',
                    rarity: 'common',
                    type: 'gold'
                },
                'silver-wheel': {
                    name: 'silver wheel',
                    rarity: 'common',
                    type: 'silver'
                },
                'fire-wheel': {
                    name: 'fire wheel',
                    rarity: 'rare',
                    type: 'fire-gradient'
                },
                'ice-wheel': {
                    name: 'ice wheel',
                    rarity: 'rare',
                    type: 'ice-gradient'
                },
                'plasma-wheel': {
                    name: 'plasma wheel',
                    rarity: 'rare',
                    type: 'plasma-gradient'
                },
                'cosmic-wheel': {
                    name: 'cosmic wheel',
                    rarity: 'legendary',
                    type: 'cosmic-pattern'
                },
                'tribal-wheel': {
                    name: 'tribal wheel',
                    rarity: 'legendary',
                    type: 'tribal-pattern'
                },
                'digital-wheel': {
                    name: 'digital wheel',
                    rarity: 'legendary',
                    type: 'digital-pattern'
                }
            },
            plinko: {
                default: {
                    name: 'default',
                    rarity: 'default'
                },
                'red-board': {
                    name: 'red board',
                    rarity: 'common',
                    bgColor: '#660000',
                    pegColor: '#ff0000'
                },
                'blue-board': {
                    name: 'blue board',
                    rarity: 'common',
                    bgColor: '#000066',
                    pegColor: '#0000ff'
                },
                'green-board': {
                    name: 'green board',
                    rarity: 'common',
                    bgColor: '#006600',
                    pegColor: '#00ff00'
                },
                'sunset-board': {
                    name: 'sunset board',
                    rarity: 'rare',
                    bgGradient: 'linear-gradient(135deg, #ff6b35, #f7931e, #ffcd3c)'
                },
                'ocean-board': {
                    name: 'ocean board',
                    rarity: 'rare',
                    bgGradient: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)'
                },
                'forest-board': {
                    name: 'forest board',
                    rarity: 'rare',
                    bgGradient: 'linear-gradient(135deg, #134e5e, #71b280, #a8e6cf)'
                },
                'space-board': {
                    name: 'space board',
                    rarity: 'legendary',
                    pattern: 'space'
                },
                'cyberpunk-board': {
                    name: 'cyberpunk board',
                    rarity: 'legendary',
                    pattern: 'cyberpunk'
                },
                'ancient-board': {
                    name: 'ancient board',
                    rarity: 'legendary',
                    pattern: 'ancient'
                }
            }
        };

        function validateInput(input) {
            let value = parseInt(input.value);
            if (isNaN(value) || value < 1) {
                input.value = 1;
            } else if (value > balance) {
                input.value = balance;
            }
        }

        updateBalance();
        setupPlinko();

        function updateBalance() {
            localStorage.setItem('balance', balance);
            const balanceElements = document.querySelectorAll('#balance, .balance-display');
            balanceElements.forEach(el => el.textContent = `C$${balance}`);
        }


        function resetMoney() {
            balance = 10;
            updateBalance();
        }

        function showGame(page) {
            ['lobby', 'coinflip', 'slots', 'roulette', 'blackjack', 'plinko', 'dice', 'skins', 'crates'].forEach(p => {
                document.getElementById(p).classList.add('hidden');
            });

            document.getElementById(page).classList.remove('hidden');
            currentPage = page;
            if (page === 'roulette') {
                applySkin('roulette', selectedSkins.roulette);
            } else if (page === 'plinko') {
                applySkin('plinko', selectedSkins.plinko);
            }
        }


        function coinFlip(choice) {
            const bet = parseInt(document.getElementById('coinBet').value);
            if (bet > balance) {
                document.getElementById('coinMessage').textContent = 'insufficient funds!';
                return;
            }

            balance -= bet;
            updateBalance();

            const result = Math.random() < 0.5 ? 'heads' : 'tails';
            const coin = document.getElementById('coinResult');

            coin.textContent = result === 'heads' ? '🗲' : '⚡';

            if (choice === result) {
                balance += bet * 2;
                document.getElementById('coinMessage').textContent = `you won! +C$${bet}`;
                document.getElementById('coinMessage').style.color = '#10b981';
            } else {
                document.getElementById('coinMessage').textContent = `you lost! -C$${bet}`;
                document.getElementById('coinMessage').style.color = '#ef4444';
            }

            updateBalance();
        }

        function spinSlots() {
            const bet = parseInt(document.getElementById('slotBet').value);
            if (bet > balance) {
                document.getElementById('slotMessage').textContent = 'insufficient funds!';
                return;
            }

            balance -= bet;
            updateBalance();

            const symbols = ['🎰', '🍊', '🍇', '💎', '🍋', '💎', '⭐'];
            const reels = [document.getElementById('slot1'), document.getElementById('slot2'), document.getElementById('slot3')];
            const results = [];

            reels.forEach((reel, index) => {
                reel.classList.add('slot-reel');

                let spinCount = 0;
                const spinInterval = setInterval(() => {
                    reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                    spinCount++;
                    if (spinCount >= 20) {
                        clearInterval(spinInterval);
                        const result = symbols[Math.floor(Math.random() * symbols.length)];
                        reel.textContent = result;
                        results.push(result);
                        reel.classList.remove('slot-reel');

                        if (index === 2) {
                            checkSlotWin(results, bet);
                        }
                    }
                }, 100);
            });

            document.getElementById('spinBtn').disabled = true;
            setTimeout(() => {
                document.getElementById('spinBtn').disabled = false;
            }, 2500);
        }


        function checkSlotWin(results, bet) {
            const [r1, r2, r3] = results;
            let multiplier = 0;

            if (r1 === r2 && r2 === r3) {
                if (r1 === '💎') multiplier = 10;
                else if (r1 === '⭐') multiplier = 5;
                else multiplier = 3;
            } else if (r1 === r2 || r2 === r3 || r1 === r3) {
                multiplier = 1.5;
            }

            if (multiplier > 0) {
                const winnings = Math.floor(bet * multiplier);
                balance += winnings;
                document.getElementById('slotMessage').textContent = `you won C$${winnings}!`;
                document.getElementById('slotMessage').style.color = '#10b981';
            } else {
                document.getElementById('slotMessage').textContent = `you lost C$${bet}!`;
                document.getElementById('slotMessage').style.color = '#ef4444';
            }

            updateBalance();
        }


        function setBet(type) {
            rouletteBetType = type;
            document.getElementById('currentBet').textContent = type;
            document.getElementById('rouletteBtn').disabled = false;
        }

        function spinRoulette() {
            const bet = parseInt(document.getElementById('rouletteBet').value);
            if (bet > balance || !rouletteBetType) return;

            balance -= bet;
            updateBalance();

            const wheel = document.getElementById('rouletteWheel');
            const number = Math.floor(Math.random() * 37);
            const isRed = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(number);

            const degreesPerNumber = 360 / 37;
            const finalRotation = 720 + (number * degreesPerNumber);

            wheel.style.setProperty('--final-rotation', `${finalRotation}deg`);
            wheel.classList.add('spinning');

            setTimeout(() => {
                wheel.classList.remove('spinning');
                document.getElementById('rouletteResult').textContent = `${number} (${number === 0 ? 'Green' : isRed ? 'Red' : 'Black'})`;

                let won = false;

                switch (rouletteBetType) {
                    case 'red':
                        won = isRed;
                        break;
                    case 'black':
                        won = !isRed && number !== 0;
                        break;
                    case 'even':
                        won = number % 2 === 0 && number !== 0;
                        break;
                    case 'odd':
                        won = number % 2 === 1;
                        break;
                    case 'low':
                        won = number >= 1 && number <= 18;
                        break;
                    case 'high':
                        won = number >= 19 && number <= 36;
                        break;
                }

                if (won) {
                    balance += bet * 2;
                    document.getElementById('rouletteMessage').textContent = `you won C$${bet}!`;
                    document.getElementById('rouletteMessage').style.color = '#10b981';
                } else {
                    document.getElementById('rouletteMessage').textContent = `you lost C$${bet}!`;
                    document.getElementById('rouletteMessage').style.color = '#ef4444';
                }

                updateBalance();
                rouletteBetType = null;
                document.getElementById('currentBet').textContent = 'none';
                document.getElementById('rouletteBtn').disabled = true;
            }, 3000);
        }

        function createDeck() {
            const suits = ['♠', '♥', '♦', '♣'];
            const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
            const deck = [];

            for (let suit of suits) {
                for (let rank of ranks) {
                    deck.push({
                        suit,
                        rank
                    });
                }
            }

            return deck.sort(() => Math.random() - 0.5);
        }

        function getCardValue(card) {
            if (card.rank === 'A') return 11;
            if (['K', 'Q', 'J'].includes(card.rank)) return 10;
            return parseInt(card.rank);
        }

        function calculateScore(hand) {
            let score = 0;
            let aces = 0;

            for (let card of hand) {
                if (card.rank === 'A') aces++;
                score += getCardValue(card);
            }

            while (score > 21 && aces > 0) {
                score -= 10;
                aces--;
            }

            return score;
        }

        function displayCard(card, isHidden = false) {
            if (isHidden) {
                return '<div class="bg-purple-900 text-white px-3 py-4 rounded border border-purple-700 text-center font-bold">?</div>';
            }

            const selectedSkin = skins.blackjack[selectedSkins.blackjack];
            const color = ['♥', '♦'].includes(card.suit) ? 'text-red-500' : selectedSkin.cardText;
            let cardClass = selectedSkin.cardBg;

            if (selectedSkin.pattern) {
                if (selectedSkin.pattern === 'galaxy') {
                    cardClass += ' galaxy-pattern';
                } else if (selectedSkin.pattern === 'matrix') {
                    cardClass += ' matrix-pattern';
                }
            }

            return `<div class="${cardClass} ${color} px-3 py-4 rounded border text-center font-bold">${card.rank}${card.suit}</div>`;
        }

        function startBlackjack() {
            const bet = parseInt(document.getElementById('blackjackBet').value);
            if (bet > balance) return;

            balance -= bet;
            updateBalance();

            blackjackGame.deck = createDeck();
            blackjackGame.playerHand = [blackjackGame.deck.pop(), blackjackGame.deck.pop()];
            blackjackGame.dealerHand = [blackjackGame.deck.pop(), blackjackGame.deck.pop()];
            blackjackGame.gameActive = true;

            updateBlackjackDisplay();

            document.getElementById('dealBtn').disabled = true;
            document.getElementById('hitBtn').disabled = false;
            document.getElementById('standBtn').disabled = false;

            if (calculateScore(blackjackGame.playerHand) === 21) {
                if (calculateScore(blackjackGame.dealerHand) === 21) {
                    blackjackGame.gameActive = false;
                    updateBlackjackDisplay();
                    endBlackjackGame('blackjack_tie');
                } else {
                    blackjackGame.gameActive = false;
                    updateBlackjackDisplay();
                    endBlackjackGame('blackjack');
                }
            }
        }


        function updateBlackjackDisplay() {
            const playerCards = document.getElementById('playerCards');
            const dealerCards = document.getElementById('dealerCards');

            playerCards.innerHTML = blackjackGame.playerHand.map(card => displayCard(card)).join('');
            dealerCards.innerHTML = displayCard(blackjackGame.dealerHand[0]) +
                (blackjackGame.gameActive ? displayCard(null, true) : displayCard(blackjackGame.dealerHand[1]));

            document.getElementById('playerScore').textContent = calculateScore(blackjackGame.playerHand);
            document.getElementById('dealerScore').textContent = blackjackGame.gameActive ?
                getCardValue(blackjackGame.dealerHand[0]) : calculateScore(blackjackGame.dealerHand);
        }

        function hit() {
            if (!blackjackGame.gameActive) return;

            blackjackGame.playerHand.push(blackjackGame.deck.pop());
            updateBlackjackDisplay();

            if (calculateScore(blackjackGame.playerHand) > 21) {
                endBlackjackGame('bust');
            }
        }

        function stand() {
            if (!blackjackGame.gameActive) return;

            blackjackGame.gameActive = false;
            updateBlackjackDisplay();
            while (calculateScore(blackjackGame.dealerHand) < 17) {
                blackjackGame.dealerHand.push(blackjackGame.deck.pop());
                updateBlackjackDisplay();
            }

            const playerScore = calculateScore(blackjackGame.playerHand);
            const dealerScore = calculateScore(blackjackGame.dealerHand);

            if (dealerScore > 21) {
                endBlackjackGame('dealer_bust');
            } else if (playerScore > dealerScore) {
                endBlackjackGame('win');
            } else if (playerScore < dealerScore) {
                endBlackjackGame('lose');
            } else {
                endBlackjackGame('tie');
            }
        }

        function endBlackjackGame(result) {
            const bet = parseInt(document.getElementById('blackjackBet').value);
            let message = '';
            let color = '';

            switch (result) {
                case 'blackjack':
                    balance += Math.floor(bet * 2.5);
                    message = `blackjack! you won C$${Math.floor(bet * 1.5)}`;
                    color = '#10b981';
                    break;
                case 'blackjack_tie':
                    balance += bet;
                    message = 'both blackjack - tie!';
                    color = '#fbbf24';
                    break;
                case 'bust':
                    message = `bust! you lost C$${bet}`;
                    color = '#ef4444';
                    break;
                case 'dealer_bust':
                    balance += bet * 2;
                    message = `dealer bust! you won C$${bet}`;
                    color = '#10b981';
                    break;
                case 'win':
                    balance += bet * 2;
                    message = `you won C$${bet}!`;
                    color = '#10b981';
                    break;
                case 'lose':
                    message = `you lost C$${bet}`;
                    color = '#ef4444';
                    break;
                case 'tie':
                    balance += bet;
                    message = 'tie!';
                    color = '#fbbf24';
                    break;
            }

            document.getElementById('blackjackMessage').textContent = message;
            document.getElementById('blackjackMessage').style.color = color;

            document.getElementById('dealBtn').disabled = false;
            document.getElementById('hitBtn').disabled = true;
            document.getElementById('standBtn').disabled = true;

            updateBalance();
        }

        function setupPlinko() {
            const board = document.getElementById('plinkoBoard');
            board.innerHTML = '';

            for (let row = 0; row < 14; row++) {
                for (let col = 0; col <= row; col++) {
                    const peg = document.createElement('div');
                    peg.className = 'plinko-peg';
                    peg.style.left = `${250 - (row * 15) + (col * 30)}px`;
                    peg.style.top = `${50 + row * 35}px`;
                    board.appendChild(peg);
                }
            }

            const multipliers = [100.0, 50.0, 10.0, 5.0, 2.0, 1.0, 0.5, 1.0, 2.0, 5.0, 10.0, 50.0, 100.0];
            for (let i = 0; i < 13; i++) {
                const slot = document.createElement('div');
                slot.className = 'plinko-slot';
                slot.style.left = `${35 + i * 35}px`;
                slot.style.top = '545px';
                slot.style.width = '30px';
                slot.style.height = '40px';
                slot.textContent = `${multipliers[i]}x`;
                slot.dataset.multiplier = multipliers[i];
                slot.dataset.index = i;

                if (multipliers[i] === 100.0) {
                    slot.style.background = '#ffd700';
                    slot.style.color = '#000000';
                    slot.style.border = '2px solid #ffed4a';
                } else if (multipliers[i] === 50.0) {
                    slot.style.background = '#f59e0b';
                    slot.style.color = '#000000';
                    slot.style.border = '2px solid #fbbf24';
                }

                board.appendChild(slot);
            }
        }

        function dropPlinko() {
            const bet = parseInt(document.getElementById('plinkoBet').value);
            if (bet > balance) {
                document.getElementById('plinkoMessage').textContent = 'insufficient funds!';
                return;
            }
            balance -= bet;
            updateBalance();

            const board = document.getElementById('plinkoBoard');
            const ball = document.createElement('div');
            ball.className = 'plinko-ball';
            ball.style.left = `${250 - 6}px`;
            ball.style.top = '10px';
            board.appendChild(ball);

            let position = 250;
            let row = 0;

            function animateBall() {
                if (row < 14) {
                    const direction = Math.random() < 0.5 ? -15 : 15;
                    position = Math.max(40, Math.min(460, position + direction));

                    ball.style.left = `${position}px`;
                    ball.style.top = `${50 + row * 35}px`;

                    row++;
                    setTimeout(animateBall, 100);
                } else {
                    const slotIndex = Math.max(0, Math.min(12, Math.round((position - 57.5) / 35)));
                    const slotElement = document.querySelector(`[data-index="${slotIndex}"]`);
                    const multiplier = parseFloat(slotElement.dataset.multiplier);

                    ball.style.left = `${42.5 + slotIndex * 35 + 9}px`;
                    ball.style.top = '560px';

                    setTimeout(() => {
                        const winnings = Math.floor(bet * multiplier);
                        balance += winnings;

                        if (winnings > bet) {
                            document.getElementById('plinkoMessage').textContent = `you won C$${winnings - bet}! (${multiplier}x)`;
                            document.getElementById('plinkoMessage').style.color = '#10b981';
                        } else if (winnings < bet) {
                            document.getElementById('plinkoMessage').textContent = `you lost C$${bet - winnings}! (${multiplier}x)`;
                            document.getElementById('plinkoMessage').style.color = '#ef4444';
                        } else {
                            document.getElementById('plinkoMessage').textContent = `break even! (${multiplier}x)`;
                            document.getElementById('plinkoMessage').style.color = '#fbbf24';
                        }

                        updateBalance();

                        setTimeout(() => {
                            if (board.contains(ball)) {
                                board.removeChild(ball);
                            }
                        }, 1500);
                    }, 300);
                }
            }

            setTimeout(animateBall, 100);
        }

        function setBetNumber(number) {
            diceBetNumber = number;
            document.getElementById('currentDiceBet').textContent = number;
            document.getElementById('rollBtn').disabled = false;

            document.querySelectorAll('.dice-bet-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            event.target.classList.add('selected');
        }

        function rollDice() {
            const bet = parseInt(document.getElementById('diceBet').value);
            if (bet > balance || !diceBetNumber) return;

            balance -= bet;
            updateBalance();

            const diceElement = document.getElementById('diceResult');
            const rollBtn = document.getElementById('rollBtn');

            rollBtn.disabled = true;
            diceElement.classList.add('dice-rolling');

            let rollCount = 0;
            const rollInterval = setInterval(() => {
                const randomNum = Math.floor(Math.random() * 6) + 1;
                const diceEmojis = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
                diceElement.textContent = diceEmojis[randomNum];
                rollCount++;

                if (rollCount >= 20) {
                    clearInterval(rollInterval);

                    const finalRoll = Math.floor(Math.random() * 6) + 1;
                    const diceEmojis = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
                    diceElement.textContent = diceEmojis[finalRoll];
                    diceElement.classList.remove('dice-rolling');

                    if (finalRoll === diceBetNumber) {
                        const winnings = bet * 6;
                        balance += winnings;
                        document.getElementById('diceMessage').textContent = `you won c$${winnings - bet}! (6x multiplier)`;
                        document.getElementById('diceMessage').style.color = '#10b981';
                    } else {
                        document.getElementById('diceMessage').textContent = `you lost c$${bet}! rolled ${finalRoll}`;
                        document.getElementById('diceMessage').style.color = '#ef4444';
                    }

                    updateBalance();

                    diceBetNumber = null;
                    document.getElementById('currentDiceBet').textContent = 'none';
                    document.querySelectorAll('.dice-bet-btn').forEach(btn => {
                        btn.classList.remove('selected');
                    });

                    setTimeout(() => {
                        rollBtn.disabled = false;
                    }, 1000);
                }
            }, 100);
        }

        function showSkins() {
            showGame('skins');
        }

        function showCrates() {
            showGame('crates');
        }

        function showSkinManager(game) {
            const skinList = document.getElementById(`${game}SkinList`);
            skinList.innerHTML = '';

            ownedSkins[game].forEach(skinId => {
                const skin = skins[game][skinId];
                const isSelected = selectedSkins[game] === skinId;

                const skinElement = document.createElement('div');
                skinElement.className = `skin-item p-3 border rounded-lg cursor-pointer ${isSelected ? 'border-yellow-400 bg-yellow-900' : 'border-gray-600 bg-gray-800'}`;
                skinElement.innerHTML = `
            <div class="flex justify-between items-center">
                <span>${skin.name}</span>
                <span class="text-xs ${getRarityColor(skin.rarity)}">${skin.rarity}</span>
            </div>
        `;

                skinElement.onclick = () => selectSkin(game, skinId);
                skinList.appendChild(skinElement);
            });

            document.querySelectorAll('.skin-manager').forEach(el => el.classList.add('hidden'));
            document.getElementById(`${game}Skins`).classList.remove('hidden');
        }

        function selectSkin(game, skinId) {
            selectedSkins[game] = skinId;
            localStorage.setItem('selectedSkins', JSON.stringify(selectedSkins));
            showSkinManager(game);
            applySkin(game, skinId);
        }

        function applySkin(game, skinId) {
            const skin = skins[game][skinId];

            if (game === 'blackjack') {

            } else if (game === 'roulette') {
                applyRouletteSkin(skin);
            } else if (game === 'plinko') {
                applyPlinkoSkin(skin);
            }
        }

        function applyRouletteSkin(skin) {
            const wheel = document.getElementById('rouletteWheel');
            if (!wheel) return;

            if (skin.type === 'rainbow') {
                wheel.style.background = 'conic-gradient(from 0deg, red, orange, yellow, green, blue, indigo, violet, red)';
            } else if (skin.type === 'gold') {
                wheel.style.background = 'conic-gradient(from 0deg, #ffd700, #ffed4a, #ffd700, #ffed4a, #ffd700, #ffed4a, #ffd700)';
            } else if (skin.type === 'silver') {
                wheel.style.background = 'conic-gradient(from 0deg, #c0c0c0, #e5e5e5, #c0c0c0, #e5e5e5, #c0c0c0, #e5e5e5, #c0c0c0)';
            } else if (skin.type === 'fire-gradient') {
                wheel.style.background = 'conic-gradient(from 0deg, #ff0000, #ff4500, #ff6600, #ff8800, #ffaa00, #ff8800, #ff6600, #ff4500, #ff0000)';
            } else if (skin.type === 'ice-gradient') {
                wheel.style.background = 'conic-gradient(from 0deg, #87ceeb, #b0e0e6, #e0ffff, #f0f8ff, #e0ffff, #b0e0e6, #87ceeb)';
            } else if (skin.type === 'plasma-gradient') {
                wheel.style.background = 'conic-gradient(from 0deg, #ff006e, #8338ec, #3a86ff, #06ffa5, #ffbe0b, #ff006e)';
            } else if (skin.type === 'cosmic-pattern') {
                wheel.style.background = 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.8), transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.8), transparent 50%), radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.8), transparent 50%), #000';
                wheel.style.backgroundSize = '50px 50px';
            } else if (skin.type === 'tribal-pattern') {
                wheel.style.background = 'repeating-conic-gradient(from 0deg, #8B4513 0deg 30deg, #D2691E 30deg 60deg, #F4A460 60deg 90deg)';
            } else if (skin.type === 'digital-pattern') {
                wheel.style.background = 'conic-gradient(from 0deg, #00ff00, #008000, #00ff41, #008020, #00ff00)';
                wheel.style.backgroundImage = 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.1) 2px, rgba(0, 255, 0, 0.1) 4px)';
            }
        }


        function applyPlinkoSkin(skin) {
            const board = document.getElementById('plinkoBoard');
            if (!board) return;

            if (skin.bgColor) {
                board.style.background = skin.bgColor;
                board.style.backgroundImage = 'none';
            } else if (skin.bgGradient) {
                board.style.background = 'none'
                board.style.backgroundImage = skin.bgGradient;
            } else if (skin.pattern === 'space') {
                board.style.background = '#0a0a2e';
                board.style.backgroundImage = 'radial-gradient(2px 2px at 20px 30px, white, transparent), radial-gradient(2px 2px at 40px 70px, white, transparent), radial-gradient(1px 1px at 90px 40px, white, transparent)';
            } else if (skin.pattern === 'cyberpunk') {
                board.style.background = 'linear-gradient(45deg, #0f0f23, #1a0033, #330066)';
                board.style.backgroundImage = 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0, 255, 255, 0.1) 10px, rgba(0, 255, 255, 0.1) 12px)';
            } else if (skin.pattern === 'ancient') {
                board.style.background = 'linear-gradient(135deg, #8B4513, #CD853F, #DEB887)';
                board.style.backgroundImage = 'repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg 15deg, rgba(139, 69, 19, 0.2) 15deg 30deg)';
            } else {
                board.style.background = '#000000';
                board.style.backgroundImage = 'none';
            }

            const pegs = document.querySelectorAll('.plinko-peg');
            if (skin.pegColor) {
                pegs.forEach(peg => {
                    peg.style.backgroundColor = skin.pegColor;
                });
            } else {
                pegs.forEach(peg => {
                    peg.style.backgroundColor = '#ffffff';
                });
            }
        }

        function getRarityColor(rarity) {
            switch (rarity) {
                case 'common':
                    return 'text-gray-400';
                case 'rare':
                    return 'text-blue-400';
                case 'legendary':
                    return 'text-purple-400';
                default:
                    return 'text-white';
            }
        }

        function openCrate(crateType) {
            let cost, possibleSkins;

            switch (crateType) {
                case 'common':
                    cost = 1000;
                    possibleSkins = Object.keys(skins.blackjack).filter(key => skins.blackjack[key].rarity === 'common')
                        .concat(Object.keys(skins.roulette).filter(key => skins.roulette[key].rarity === 'common'))
                        .concat(Object.keys(skins.plinko).filter(key => skins.plinko[key].rarity === 'common'));
                    break;
                case 'rare':
                    cost = 5000;
                    possibleSkins = Object.keys(skins.blackjack).filter(key => skins.blackjack[key].rarity === 'rare')
                        .concat(Object.keys(skins.roulette).filter(key => skins.roulette[key].rarity === 'rare'))
                        .concat(Object.keys(skins.plinko).filter(key => skins.plinko[key].rarity === 'rare'));
                    break;
                case 'legendary':
                    cost = 10000;
                    possibleSkins = Object.keys(skins.blackjack).filter(key => skins.blackjack[key].rarity === 'legendary')
                        .concat(Object.keys(skins.roulette).filter(key => skins.roulette[key].rarity === 'legendary'))
                        .concat(Object.keys(skins.plinko).filter(key => skins.plinko[key].rarity === 'legendary'));
                    break;
            }

            if (balance < cost) {
                document.getElementById('crateMessage').textContent = 'insufficient funds!';
                document.getElementById('crateMessage').style.color = '#ef4444';
                return;
            }

            balance -= cost;
            updateBalance();

            const randomSkin = possibleSkins[Math.floor(Math.random() * possibleSkins.length)];

            let gameType;
            if (Object.keys(skins.blackjack).includes(randomSkin)) gameType = 'blackjack';
            else if (Object.keys(skins.roulette).includes(randomSkin)) gameType = 'roulette';
            else if (Object.keys(skins.plinko).includes(randomSkin)) gameType = 'plinko';

            if (!ownedSkins[gameType].includes(randomSkin)) {
                ownedSkins[gameType].push(randomSkin);
                localStorage.setItem('ownedSkins', JSON.stringify(ownedSkins));
            }

            const skin = skins[gameType][randomSkin];
            document.getElementById('crateMessage').innerHTML = `you got: <span class="${getRarityColor(skin.rarity)}">${skin.name}</span> (${gameType})`;
            document.getElementById('crateMessage').style.color = '#10b981';
        }
