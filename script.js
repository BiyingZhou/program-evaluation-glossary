document.addEventListener('DOMContentLoaded', () => {
    const terms = [
        "program evaluation", "Program", "Purpose", "Audience", 
        "Framework", "Approach", "Evaluation Questions", "Data", 
        "Positive Change", "CES (Canadian Evaluation Society)", "RFP (Request for Proposals)"
    ];

    const definitions = [
        "Evaluation is", "A set of related activities", "The reason for which something", 
        "The intended group of people", "A structured plan or set of", 
        "The method or strategy used to", "Specific questions that guide the", 
        "Information collected for analysis", "Improvements or beneficial", 
        "A professional association that", "A document issued to solicit"
    ];

    const termsList = document.getElementById('termsList');
    const definitionsList = document.getElementById('definitionsList');

    terms.forEach((term, index) => {
        const li = document.createElement('li');
        li.textContent = term;
        li.dataset.index = index;
        li.addEventListener('click', () => selectItem(li, 'term'));
        termsList.appendChild(li);
    });

    definitions.forEach((definition, index) => {
        const li = document.createElement('li');
        li.textContent = definition;
        li.dataset.index = index;
        li.addEventListener('click', () => selectItem(li, 'definition'));
        definitionsList.appendChild(li);
    });

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
            matchItems(selectedTerm, selectedDefinition);
        }
    }

    function matchItems(term, definition) {
        const termIndex = term.dataset.index;
        const definitionIndex = definition.dataset.index;

        term.dataset.match = definitionIndex;
        definition.dataset.match = termIndex;

        term.classList.remove('selected');
        definition.classList.remove('selected');

        selectedTerm = null;
        selectedDefinition = null;
    }

    document.getElementById('checkAnswers').addEventListener('click', () => {
        let correct = 0;
        termsList.childNodes.forEach(term => {
            const termIndex = term.dataset.index;
            const matchedIndex = term.dataset.match;

            if (termIndex === matchedIndex) {
                correct++;
            }
        });

        const result = document.getElementById('result');
        result.textContent = `You got ${correct} out of ${terms.length} correct!`;
    });
});
