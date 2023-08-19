    const addButton = document.getElementById('addButton');
    const statusFilter = document.getElementById('statusFilter');
    const companyFilter = document.getElementById('companyFilter');
    const tableBody = document.getElementById('tableBody');
    let data = JSON.parse(localStorage.getItem('tableData')) || [];

    function updateTable(filteredData = data) {
      tableBody.innerHTML = '';
      filteredData.forEach((item, index) => {
        const row = document.createElement('tr');

        const selectCell = document.createElement('td');
        const selectCheckbox = document.createElement('div');
        selectCheckbox.classList.add('select-checkbox');
        selectCheckbox.addEventListener('click', () => {
          selectCheckbox.classList.toggle('checked');
        });
        selectCell.appendChild(selectCheckbox);

        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;

        const companyCell = document.createElement('td');
        companyCell.textContent = item.company;

        const statusCell = document.createElement('td');
        statusCell.textContent = item.status;

        const lastUpdatedCell = document.createElement('td');
        lastUpdatedCell.textContent = item.lastUpdated;

        const notesCell = document.createElement('td');
        notesCell.textContent = item.notes;

        const deleteCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-btn');
        deleteButton.addEventListener('click', () => {
          data.splice(data.indexOf(item), 1);
          updateTable();
          saveData();
          populateCompanyFilter();
        });
        deleteCell.appendChild(deleteButton);

        row.appendChild(selectCell);
        row.appendChild(nameCell);
        row.appendChild(companyCell);
        row.appendChild(statusCell);
        row.appendChild(lastUpdatedCell);
        row.appendChild(notesCell);
        row.appendChild(deleteCell);

        tableBody.appendChild(row);
      });
    }

    function saveData() {
      localStorage.setItem('tableData', JSON.stringify(data));
    }

    addButton.addEventListener('click', () => {
      const name = prompt('Enter Name:');
      const company = prompt('Enter Company:');
      const status = prompt('Enter Status (active/inactive):');
      const lastUpdated = new Date().toLocaleString();
      const notes = prompt('Enter Notes:');

      if (name && company && status && notes) {
        data.push({
          name,
          company,
          status,
          lastUpdated,
          notes
        });
        updateTable();
        saveData();
        populateCompanyFilter();
      }
    });

    statusFilter.addEventListener('change', () => {
      const selectedStatus = Array.from(statusFilter.selectedOptions).map(option => option.value);
      const filteredData = data.filter(item => selectedStatus.includes(item.status));
      updateTable(filteredData);
    });

    companyFilter.addEventListener('change', () => {
      const selectedCompanyValues = Array.from(companyFilter.selectedOptions).map(option => option.value);
      let filteredData = data;

      if (!selectedCompanyValues.includes('select-all')) {
        filteredData = data.filter(item => selectedCompanyValues.includes(item.company));
      }

      updateTable(filteredData);
    });

    updateTable();
    populateCompanyFilter();

    function populateCompanyFilter() {
      const companies = data.map(item => item.company);
      const uniqueCompanies = [...new Set(companies)];
      companyFilter.innerHTML = '<option value="select-all">Select All</option>';
      uniqueCompanies.forEach(company => {
        companyFilter.innerHTML += `<option value="${company}">${company}</option>`;
      });
    }