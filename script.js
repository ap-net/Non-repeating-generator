document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generate-button');
    const pairsContainer = document.getElementById('pairs-container');
    const roundCounter = document.getElementById('round-counter');

    if (!generateButton || !pairsContainer) {
        console.error('Required elements are missing in the DOM.');
        return;
    }

    function resetLocalStorage() {
        localStorage.removeItem('round');
        localStorage.removeItem('pairsHistory');
        console.log('Local storage reset.');
    }

    // resetLocalStorage();

    console.log('Elements found. Initializing...');
    const people = [
        'Carolina', 'Nitzan', 'Yishay', 'Vera', 'Gedi', 'Dana', 'Beatriz', 'Angelo',
        'Alicja', 'Enzo', 'Dorota', 'Yulia', 'Adrian', 'Aneta'
    ];

    let round = parseInt(localStorage.getItem('round'));
    if (isNaN(round)) {
        round = 1;
    }
    console.log('Initial round:', round);

    const pairsHistory = JSON.parse(localStorage.getItem('pairsHistory')) || [];
    console.log('Initial pairs history:', pairsHistory);

    generateButton.addEventListener('click', () => {
        console.log('Generate button clicked.');
        generatePairs();
    });

    function generatePairs() {
        console.log('Generating pairs...');
        pairsContainer.innerHTML = '';

        const pairs = getRoundRobinPairs(people, round);
        round = round % (people.length - 1) + 1;

        if (!pairs || pairs.length === 0) {
            console.error('No pairs generated.');
            return;
        }

        console.log('Generated pairs:', pairs);

        pairs.forEach((pair, index) => {
            console.log(`Pair: ${pair[0]} and ${pair[1]}`);
            const teamElement = document.createElement('div');
            teamElement.className = `pair team-${index + 1}`;

            const titleElement = document.createElement('div');
            titleElement.className = 'team-title';
            titleElement.textContent = `Team ${index + 1}`;

            const countElement = document.createElement('div');
            countElement.className = 'team-count';
            countElement.textContent = pair.length;

            teamElement.appendChild(titleElement);
            pair.forEach(member => {
                const memberElement = document.createElement('div');
                memberElement.className = 'team-member';
                memberElement.textContent = member;
                teamElement.appendChild(memberElement);
            });

            teamElement.appendChild(countElement);
            pairsContainer.appendChild(teamElement);
        });

        localStorage.setItem('round', round);
        pairsHistory.push(pairs);
        localStorage.setItem('pairsHistory', JSON.stringify(pairsHistory));
        console.log('Updated round:', round);
        console.log('Updated pairs history:', pairsHistory);

        roundCounter.textContent = `Round: ${round}`;
    }

    function getRoundRobinPairs(arr, round) {
        console.log('Generating round-robin pairs with round:', round);
        const n = arr.length;
        const pairs = [];
        const rotatedArr = arr.slice();

        console.log('Original array:', arr);
        console.log('Rotated array before rotation:', rotatedArr);

        const rotate = rotatedArr.splice(1, round);
        rotatedArr.push(...rotate);

        console.log('Rotated array after rotation:', rotatedArr);

        for (let i = 0; i < n / 2; i++) {
            pairs.push([rotatedArr[i], rotatedArr[n - 1 - i]]);
        }

        console.log('Generated pairs:', pairs);

        return pairs;
    }

    function displayPreviousPairs() {
        console.log('Displaying previous pairs...');
        const lastPairs = pairsHistory[pairsHistory.length - 1];

        if (!lastPairs) {
            console.log('No previous pairs to display.');
            return;
        }

        lastPairs.forEach((pair, index) => {
            const teamElement = document.createElement('div');
            teamElement.className = `pair team-${index + 1}`;

            const titleElement = document.createElement('div');
            titleElement.className = 'team-title';
            titleElement.textContent = `Team ${index + 1}`;

            const countElement = document.createElement('div');
            countElement.className = 'team-count';
            countElement.textContent = pair.length;

            teamElement.appendChild(titleElement);
            pair.forEach(member => {
                const memberElement = document.createElement('div');
                memberElement.className = 'team-member';
                memberElement.textContent = member;
                teamElement.appendChild(memberElement);
            });

            teamElement.appendChild(countElement);
            pairsContainer.appendChild(teamElement);
        });
    }

    displayPreviousPairs();
    roundCounter.textContent = `Round: ${round}`;
});
