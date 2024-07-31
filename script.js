document.addEventListener('DOMContentLoaded', () => {
    fetch('Part1.xlsx')
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            populateGlossary(json);
        })
        .catch(error => console.error('Error fetching the Excel file:', error));

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function populateGlossary(data) {
        const terms = data.map((row, index) => ({ text: row[1], index }));
        const definitions = data.map((row, index) => ({ text: row[2], index }));

        shuffleArray(terms);
        shuffleArray(definitions);

        const termsList = document.getElementById('termsList');
        const definitionsList = document.getElementById('definitionsList');

        termsList.innerHTML = '';
        definitionsList.innerHTML = '';

        terms.forEach(term => {
            const li = document.createElement('li');
            li.textContent = term.text;
            li.dataset.index = term.index;
            li.addEventListener('click', () => selectItem(li, 'term'));
            termsList.appendChild(li);
        });

        definitions.forEach(definition => {
            const li = document.createElement('li');
            li.textContent = definition.text;
            li.dataset.index = definition.index;
            li.addEventListener('click', () => selectItem(li, 'definition'));
            definitionsList.appendChild(li);
        });
    }

    let selectedTerm = null;
    let selectedDefinition = null;

    function selectItem(element, type) {
        if (type === 'term') {
            if (selectedTerm) selectedTerm.classList.remove('selected');
            selectedTerm = element;
        } else {
            if (selectedDefinition) selectedDefinition.classList.remove('selected');
            selectedDefinition = element;
        }
        element.classList.add('selected');

        if (selectedTerm && selectedDefinition) {
            checkMatch(selectedTerm, selectedDefinition);
        }
    }

    function checkMatch(term, definition) {
        const termIndex = term.dataset.index;
        const definitionIndex = definition.dataset.index;

        if (termIndex === definitionIndex) {
            term.classList.add('correct');
            definition.classList.add('correct');
        } else {
            term.classList.add('incorrect');
            definition.classList.add('incorrect');
        }

        setTimeout(() => {
            term.classList.remove('selected');
            definition.classList.remove('selected');
            if (termIndex === definitionIndex) {
                term.classList.remove('incorrect');
                definition.classList.remove('incorrect');
            } else {
                term.classList.remove('correct');
                definition.classList.remove('correct');
            }
            selectedTerm = null;
            selectedDefinition = null;
        }, 1000);
    }
});
