        let balance = 10;
        let currentPage = 'lobby';
        let rouletteBetType = null;
        let blackjackGame = {
            deck: [],
            playerHand: [],
            dealerHand: [],
            gameActive: false
        };

        updateBalance();
        setupPlinko();

        function updateBalance() {
            const balanceElements = document.querySelectorAll('#balance, .balance-display');
            balanceElements.forEach(el => el.textContent = `C$${balance}`);
        }

        function resetMoney() {
            balance = 10;
            updateBalance();
        }

        function showGame(page) {
            ['lobby', 'coinflip', 'slots', 'roulette', 'blackjack', 'plinko'].forEach(p => {
                document.getElementById(p).classList.add('hidden');
            });
            
            document.getElementById(page).classList.remove('hidden');
            currentPage = page;
        }

        function coinFlip(choice) {
            const bet = parseInt(document.getElementById('coinBet').value);
            if (bet > balance) {
                document.getElementById('coinMessage').textContent = 'insufficient funds!';
                return;
            }

            const result = Math.random() < 0.5 ? 'heads' : 'tails';
            const coin = document.getElementById('coinResult');
            
            coin.textContent = result === 'heads' ? '🗲' : '⚡';
            
            if (choice === result) {
                balance += bet;
                document.getElementById('coinMessage').textContent = `you won! +C$${bet}`;
                document.getElementById('coinMessage').style.color = '#10b981';
            } else {
                balance -= bet;
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

            const symbols = ['🎰', '🍊', '🍇', '🍒', '🍋', '💎', '⭐'];
            const reels = [document.getElementById('slot1'), document.getElementById('slot2'), document.getElementById('slot3')];
            const results = [];

            reels.forEach((reel, index) => {
                reel.classList.add('slot-reel');
                setTimeout(() => {
                    const result = symbols[Math.floor(Math.random() * symbols.length)];
                    reel.textContent = result;
                    results.push(result);
                    reel.classList.remove('slot-reel');
                    
                    if (index === 2) { 
                        checkSlotWin(results, bet);
                    }
                }, 1000 + index * 200);
            });

            document.getElementById('spinBtn').disabled = true;
            setTimeout(() => {
                document.getElementById('spinBtn').disabled = false;
            }, 2000);
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
                balance += winnings - bet;
                document.getElementById('slotMessage').textContent = `you won C$${winnings}!`;
                document.getElementById('slotMessage').style.color = '#10b981';
            } else {
                balance -= bet;
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

            const number = Math.floor(Math.random() * 37); // 0-36
            const isRed = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(number);
            
            document.getElementById('rouletteResult').textContent = `${number} (${number === 0 ? 'Green' : isRed ? 'Red' : 'Black'})`;

            let won = false;
            let multiplier = 2;

            switch(rouletteBetType) {
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
                balance += bet;
                document.getElementById('rouletteMessage').textContent = `you won C$${bet}!`;
                document.getElementById('rouletteMessage').style.color = '#10b981';
            } else {
                balance -= bet;
                document.getElementById('rouletteMessage').textContent = `you lost C$${bet}!`;
                document.getElementById('rouletteMessage').style.color = '#ef4444';
            }

            updateBalance();
            rouletteBetType = null;
            document.getElementById('currentBet').textContent = 'none';
            document.getElementById('rouletteBtn').disabled = true;
        }

        function createDeck() {
            const suits = ['♠', '♥', '♦', '♣'];
            const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
            const deck = [];

            for (let suit of suits) {
                for (let rank of ranks) {
                    deck.push({ suit, rank });
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
            const color = ['♥', '♦'].includes(card.suit) ? 'text-red-500' : 'text-black';
            return `<div class="bg-white ${color} px-3 py-4 rounded border text-center font-bold">${card.rank}${card.suit}</div>`;
        }

        function startBlackjack() {
            const bet = parseInt(document.getElementById('blackjackBet').value);
            if (bet > balance) return;

            blackjackGame.deck = createDeck();
            blackjackGame.playerHand = [blackjackGame.deck.pop(), blackjackGame.deck.pop()];
            blackjackGame.dealerHand = [blackjackGame.deck.pop(), blackjackGame.deck.pop()];
            blackjackGame.gameActive = true;

            updateBlackjackDisplay();

            document.getElementById('dealBtn').disabled = true;
            document.getElementById('hitBtn').disabled = false;
            document.getElementById('standBtn').disabled = false;

            if (calculateScore(blackjackGame.playerHand) === 21) {
                stand();
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

            switch(result) {
                case 'bust':
                    balance -= bet;
                    message = `bust! you lost C$${bet}`;
                    color = '#ef4444';
                    break;
                case 'dealer_bust':
                    balance += bet;
                    message = `dealer bust! you won C$${bet}`;
                    color = '#10b981';
                    break;
                case 'win':
                    balance += bet;
                    message = `you won C$${bet}!`;
                    color = '#10b981';
                    break;
                case 'lose':
                    balance -= bet;
                    message = `you lost C$${bet}`;
                    color = '#ef4444';
                    break;
                case 'tie':
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

            for (let row = 0; row < 12; row++) {
                for (let col = 0; col <= row; col++) {
                    const peg = document.createElement('div');
                    peg.className = 'plinko-peg';
                    peg.style.left = `${200 - (row * 15) + (col * 30)}px`;
                    peg.style.top = `${50 + row * 35}px`;
                    board.appendChild(peg);
                }
            }

            const multipliers = [0.1, 0.5, 1.0, 2.0, 5.0, 2.0, 1.0, 0.5, 0.1];
            for (let i = 0; i < 9; i++) {
                const slot = document.createElement('div');
                slot.className = 'absolute bg-red-800 text-white font-bold text-center border border-red-600';
                slot.style.left = `${50 + i * 35}px`;
                slot.style.top = '470px';
                slot.style.width = '30px';
                slot.style.height = '25px';
                slot.style.lineHeight = '25px';
                slot.style.fontSize = '10px';
                slot.textContent = `${multipliers[i]}x`;
                board.appendChild(slot);
            }
        }

        function dropPlinko() {
            const bet = parseInt(document.getElementById('plinkoBet').value);
            if (bet > balance) {
                document.getElementById('plinkoMessage').textContent = 'insufficient funds!';
                return;
            }

            const board = document.getElementById('plinkoBoard');
            const ball = document.createElement('div');
            ball.className = 'plinko-ball';
            ball.style.left = '196px';
            ball.style.top = '10px';
            board.appendChild(ball);

            let position = 200;
            let row = 0;
            const multipliers = [0.1, 0.5, 1.0, 2.0, 5.0, 2.0, 1.0, 0.5, 0.1];

            document.getElementById('plinkoBtn').disabled = true;

            function animateBall() {
                if (row < 12) {
                    const direction = Math.random() < 0.5 ? -15 : 15;
                    position = Math.max(50, Math.min(350, position + direction));
                    
                    ball.style.left = `${position}px`;
                    ball.style.top = `${50 + row * 35}px`;
                    
                    row++;
                    setTimeout(animateBall, 100);
                } else {
                    const slotIndex = Math.max(0, Math.min(8, Math.floor((position - 50) / 35)));
                    const multiplier = multipliers[slotIndex];
                    const winnings = Math.floor(bet * multiplier);
                    
                    ball.style.left = `${50 + slotIndex * 35 + 15}px`;
                    ball.style.top = '445px';
                    
                    setTimeout(() => {
                        balance = balance - bet + winnings;
                        
                        if (winnings > bet) {
                            document.getElementById('plinkoMessage').textContent = `you won C${winnings - bet}! (${multiplier}x)`;
                            document.getElementById('plinkoMessage').style.color = '#10b981';
                        } else if (winnings < bet) {
                            document.getElementById('plinkoMessage').textContent = `you lost C${bet - winnings}! (${multiplier}x)`;
                            document.getElementById('plinkoMessage').style.color = '#ef4444';
                        } else {
                            document.getElementById('plinkoMessage').textContent = `break even! (${multiplier}x)`;
                            document.getElementById('plinkoMessage').style.color = '#fbbf24';
                        }
                        
                        updateBalance();
                        document.getElementById('plinkoBtn').disabled = false;
                        
                        setTimeout(() => {
                            board.removeChild(ball);
                        }, 1000);
                    }, 500);
                }
            }

            setTimeout(animateBall, 100);
        }