document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const fileName = urlParams.get('file');

    if (!fileName) {
        alert('No file specified!');
        return;
    }

    fetch('Parts.xlsx')
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const parts = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            const partInfo = parts.find(part => part[0] + '.xlsx' === fileName);
            const partTitle = partInfo ? partInfo[1] : 'Program Evaluation';

            document.getElementById('pageTitle').textContent = partTitle;
        })
        .catch(error => console.error('Error fetching the Parts.xlsx file:', error));

    fetch(fileName)
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            const isPracticePage = document.getElementById('practiceSection');
            if (isPracticePage) {
                populateGlossary(json);
            } else {
                populateTable(json);
            }
        })
        .catch(error => console.error('Error fetching the Excel file:', error));

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function populateTable(data) {
        const tableBody = document.querySelector('#dataTable tbody');
        tableBody.innerHTML = '';
    
        data.forEach(row => {
            const tr = document.createElement('tr');
            const linkCell = row[4] 
                ? `<a href="${row[4]}" target="_blank" class="long-link">link</a>` 
                : '-';
            tr.innerHTML = `
                <td>${row[1] || '-'}</td>
                <td>${row[2] || '-'}</td>
                <td>${row[3] || '-'}</td>
                <td>${linkCell}</td>
                <td>${row[5] || '-'}</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    function populateGlossary(data) {
        const terms = data.map((row, index) => ({ text: row[1], index }));
        const definitions = data.map((row, index) => ({ text: row[2], index }));
    
        const currentTermElement = document.getElementById('currentTerm');
        const optionsListElement = document.getElementById('optionsList');
    
        currentTermElement.innerHTML = '';
        optionsListElement.innerHTML = '';
    
        // Select a term to practice
        const practiceIndex = Math.floor(Math.random() * terms.length);
    
        // Set the selected term
        const selectedTerm = terms[practiceIndex].text;
        currentTermElement.textContent = selectedTerm;
    
        // Combine the definition of the selected term and three other random definitions
        const correctDefinition = definitions[practiceIndex];
        const otherDefinitions = definitions.filter((def, index) => index !== practiceIndex);
        shuffleArray(otherDefinitions);
    
        const options = [
            correctDefinition,
            ...otherDefinitions.slice(0, 3)
        ];
    
        // Shuffle the options list
        shuffleArray(options);
    
        // Display the options
        options.forEach((option, index) => {
            const optionElement = document.createElement('li');
            optionElement.className = 'option';
            optionElement.id = `option${index + 1}`;
            optionElement.textContent = option.text;
            console.log(option.index)
            console.log(data[option.index])
            optionElement.addEventListener('click', () => handleOptionClick(option.index === practiceIndex, optionElement,  data[option.index]));
            optionsListElement.appendChild(optionElement);
        });
    }
    
    // Event handler for option click
    function handleOptionClick(isCorrect, optionElement, row) {
        if (isCorrect) {
            optionElement.style.backgroundColor = '#d4edda';
            optionElement.style.borderColor = '#c3e6cb';
        } else {
            optionElement.style.backgroundColor = '#f8d7da';
            optionElement.style.borderColor = '#f5c6cb';
        }

        document.getElementById('completeTable').style.display = 'block';
        const tableBody = document.querySelector('#dataTable tbody');
        
        // Check if the row with the same key (row[1]) already exists
        const existingRows = Array.from(tableBody.querySelectorAll('tr'));
        const rowExists = existingRows.some(tr => tr.dataset.key === row[1]);

        if (!rowExists) {
            const tr = document.createElement('tr');
            tr.dataset.key = row[1]; // Use row[1] as a unique key for the row

            const colorClass = isCorrect ? 'correct-text' : 'incorrect-text';
            const linkCell = row[4] 
                ? `<a href="${row[4]}" target="_blank" class="long-link">link</a>` 
                : '-';
            tr.innerHTML = `
                <td class="${colorClass}">${row[1] || '-'}</td>
                <td>${row[2] || '-'}</td>
                <td>${row[3] || '-'}</td>
                <td>${linkCell}</td>
                <td>${row[5] || '-'}</td>
            `;
            tableBody.appendChild(tr);
        }
    }

    
    if (document.getElementById('showTable')) {
        document.getElementById('showTable').addEventListener('click', () => {
            const fileName = urlParams.get('file');
            window.location.href = `table.html?file=${fileName}`;
        });
    }

    if (document.getElementById('nextPractice')) {
        document.getElementById('nextPractice').addEventListener('click', () => {
            location.reload();
        });
    }

    if (document.getElementById('startPractice')) {
        document.getElementById('startPractice').addEventListener('click', () => {
            const fileName = urlParams.get('file');
            window.location.href = `practice.html?file=${fileName}`;

        });
    }

    const returnHomeButtons = document.querySelectorAll('#returnHome, #returnHome2');
    returnHomeButtons.forEach(button => {
        button.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    });
});
