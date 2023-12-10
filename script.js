async function start() {
    const button = document.querySelector('#start');
    button.addEventListener('click', async () => {
        const numberOfQuestions = document.querySelector('#numQuestions').value;
        document.querySelector('.choise').remove();
        try {
            const data = await getDBFromOpentdb(numberOfQuestions);
            transition(data, 'none');
        } catch (error) {
            console.log('Error:', error);
        }
    });
}

async function getDBFromOpentdb(numberOfQuestions) {
    try {
        const response = await fetch(`https://opentdb.com/api.php?amount=${numberOfQuestions}&category=18&type=multiple`);
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.log('Error:', error);
        throw error; 
    }
}

function filterQuestion(data, filter) {
    let filteredQuestions = data.results;

    if (filter !== 'none') {
        filteredQuestions = data.results.filter(quest => quest.difficulty === filter);
    }

    return filteredQuestions;
}

async function transition(data, filter) {
    const container = document.body;
    container.insertAdjacentHTML('beforeend', '<div id = "filterDiv"><p>Veuillez choisir votre difficulté :</p><select id="filter"><option value="none">All</option><option value="easy">🥉</option><option value="medium">🥈</option><option value="hard">🥇</option></select><button id="filterButton">Filtrer</button></div>');

    const filterButton = document.querySelector('#filterButton');
    filterButton.addEventListener('click', () => {
        const filter = document.querySelector('#filter').value;
        const filteredQuestions = filterQuestion(data, filter);
        displayQuestion(filteredQuestions);
    });

    const filteredQuestions = filterQuestion(data, filter);
    displayQuestion(filteredQuestions);
}

function displayQuestion(questions) {
    let container = document.getElementById("questions");
    console.log(container);
    if (container !== null) {
        container.remove();
    }
    container = document.createElement('div');
    container.id = "questions";
    document.body.appendChild(container);

    for (let quest of questions) {
        const questionContainer = document.createElement('div');
        questionContainer.className = 'question-container';

        const difficultyEmoji = document.createElement('div');
        difficultyEmoji.className = 'difficulty-emoji';
        difficultyEmoji.textContent = getDifficultyEmoji(quest.difficulty);
        questionContainer.appendChild(difficultyEmoji);

        const p = document.createElement('p');
        p.textContent = quest.question;
        questionContainer.appendChild(p);

        container.appendChild(questionContainer);

        p.addEventListener('click', () => {
            const answer = p.getElementsByClassName('answer')[0];
            if (answer) {
                p.removeChild(answer);
            } else {
                const p2 = document.createElement('p');
                p2.textContent = quest.correct_answer;
                p2.className = 'answer';
                p.appendChild(p2);
            }
        });
    }
}

function getDifficultyEmoji(difficulty) {
    switch (difficulty) {
        case 'easy':
            return '🥉';
        case 'medium':
            return '🥈';
        case 'hard':
            return '🥇';
        default:
            return '';
    }
}


start();
