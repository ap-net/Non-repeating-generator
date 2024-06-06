document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generate-button');
    const addUserButton = document.getElementById('add-user-button');
    const deleteUserButton = document.getElementById('delete-user-button');
    const userInput = document.getElementById('user-input');
    const userList = document.getElementById('user-list');
    const addUserButton = document.getElementById('add-user-button');
    const deleteUserButton = document.getElementById('delete-user-button');
    const userInput = document.getElementById('user-input');
    const userList = document.getElementById('user-list');
    const pairsContainer = document.getElementById('pairs-container');
    const weekCounter = document.getElementById('week-counter');
    const manageUsersButton = document.getElementById('manage-users-button');
    const manageUsersContainer = document.querySelector('.manage-users-container');
   
    manageUsersButton.addEventListener('click', function() {
        if (manageUsersContainer.classList.contains('open')) {
            manageUsersContainer.style.height = '0';
        } else {
            manageUsersContainer.style.height = manageUsersContainer.scrollHeight + 'px';
        }
        manageUsersContainer.classList.toggle('open');
    });

    manageUsersContainer.addEventListener('transitionend', function() {
        if (!manageUsersContainer.classList.contains('open')) {
            manageUsersContainer.style.height = '0';
        } else {
            manageUsersContainer.style.height = 'auto';
        }
    });

    if (!generateButton || !pairsContainer || !addUserButton || !deleteUserButton || !userInput || !userList) {
        console.error('Required elements are missing in the DOM.');
        return;
    }

    function resetLocalStorage() {
        localStorage.removeItem('week');
        localStorage.removeItem('pairsHistory');
        localStorage.removeItem('people');
        console.log('Local storage reset.');
    }

    console.log('Elements found. Initializing...');
    const defaultPeople = [
        'Carolina', 'Nitzan', 'Yishay', 'Vera', 'Gedi', 'Dana', 'Beatriz', 'Angelo',
        'Alicja', 'Enzo', 'Dorota', 'Yulia', 'Adrian', 'Aneta'
    ];

    let people = JSON.parse(localStorage.getItem('people')) || defaultPeople;

    function updateUserList() {
        userList.innerHTML = '';
        people.forEach(person => {
            const userElement = document.createElement('div');
            userElement.textContent = person;
            userList.appendChild(userElement);
        });
    }

    updateUserList();

    let week = parseInt(localStorage.getItem('week'));
    if (isNaN(week)) {
        week = 1;
    }
    console.log('Initial week:', week);

    const pairsHistory = JSON.parse(localStorage.getItem('pairsHistory')) || [];
    console.log('Initial pairs history:', pairsHistory);

    addUserButton.addEventListener('click', () => {
        const newUser = userInput.value.trim();
        if (newUser && !people.includes(newUser)) {
            people.push(newUser);
            localStorage.setItem('people', JSON.stringify(people));
            updateUserList();
            userInput.value = '';
        }
    });

    deleteUserButton.addEventListener('click', () => {
        const userToDelete = userInput.value.trim();
        const index = people.indexOf(userToDelete);
        if (index !== -1) {
            people.splice(index, 1);
            localStorage.setItem('people', JSON.stringify(people));
            updateUserList();
            userInput.value = '';
        }
    });

    generateButton.addEventListener('click', () => {
        console.log('Generate button clicked.');
        generatePairs();
    });

    function generatePairs() {
        console.log('Generating pairs...');
        pairsContainer.innerHTML = '';

        if (week > (people.length - 1)) {
            alert('All pairs have been used. Restarting from the beginning.');
            week = 1;
            pairsHistory.length = 0; 
        }

        const pairs = getRoundRobinPairs(people, week);
        week = week % (people.length - 1) + 1;

        if (!pairs || pairs.length === 0) {
            console.error('No pairs generated.');
            return;
        }

        console.log('Generated pairs:', pairs);

        pairs.forEach((pair, index) => {
            console.log(`Pair: ${pair.join(', ')}`);
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

        localStorage.setItem('week', week);
        pairsHistory.push(pairs);
        localStorage.setItem('pairsHistory', JSON.stringify(pairsHistory));
        console.log('Updated week:', week);
        console.log('Updated pairs history:', pairsHistory);

        weekCounter.textContent = `Week: ${week}`;
    }

    function getRoundRobinPairs(arr, week) {
        console.log('Generating round-robin pairs with week:', week);
        const n = arr.length;
        const pairs = [];
        const rotatedArr = arr.slice();

        console.log('Original array:', arr);
        console.log('Rotated array before rotation:', rotatedArr);

        for (let i = 0; i < week - 1; i++) {
            rotatedArr.push(rotatedArr.splice(1, 1)[0]);
        }

        console.log('Rotated array after rotation:', rotatedArr);

        for (let i = 0; i < Math.floor(n / 2); i++) {
            pairs.push([rotatedArr[i], rotatedArr[n - 1 - i]]);
        }

        if (n % 2 !== 0) {
            const lastPair = pairs.pop();
            pairs.push([lastPair[0], lastPair[1], rotatedArr[Math.floor(n / 2)]]);
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
    weekCounter.textContent = `Week: ${week}`;
});