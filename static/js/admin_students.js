// =========================================== SIDEBAR ===========================================
// SIDEBAR DROPDOWN
const allDropdown = document.querySelectorAll('#sidebar .side-dropdown');
const sidebar = document.getElementById('sidebar');

allDropdown.forEach(item=> {
	const a = item.parentElement.querySelector('a:first-child');
	a.addEventListener('click', function (e) {
		e.preventDefault();

		if(!this.classList.contains('active')) {
			allDropdown.forEach(i=> {
				const aLink = i.parentElement.querySelector('a:first-child');

				aLink.classList.remove('active');
				i.classList.remove('show');
			})
		}

		this.classList.toggle('active');
		item.classList.toggle('show');
	})
})

// SIDEBAR COLLAPSE
const toggleSidebar = document.querySelector('nav .toggle-sidebar');
const allSideDivider = document.querySelectorAll('#sidebar .divider');

if(sidebar.classList.contains('hide')) {
	allSideDivider.forEach(item=> {
		item.textContent = '-'
	})
	allDropdown.forEach(item=> {
		const a = item.parentElement.querySelector('a:first-child');
		a.classList.remove('active');
		item.classList.remove('show');
	})
} else {
	allSideDivider.forEach(item=> {
		item.textContent = item.dataset.text;
	})
}

toggleSidebar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');

	if(sidebar.classList.contains('hide')) {
		allSideDivider.forEach(item=> {
			item.textContent = '-'
		})

		allDropdown.forEach(item=> {
			const a = item.parentElement.querySelector('a:first-child');
			a.classList.remove('active');
			item.classList.remove('show');
		})
	} else {
		allSideDivider.forEach(item=> {
			item.textContent = item.dataset.text;
		})
	}
})

sidebar.addEventListener('mouseleave', function () {
	if(this.classList.contains('hide')) {
		allDropdown.forEach(item=> {
			const a = item.parentElement.querySelector('a:first-child');
			a.classList.remove('active');
			item.classList.remove('show');
		})
		allSideDivider.forEach(item=> {
			item.textContent = '-'
		})
	}
})

sidebar.addEventListener('mouseenter', function () {
	if(this.classList.contains('hide')) {
		allDropdown.forEach(item=> {
			const a = item.parentElement.querySelector('a:first-child');
			a.classList.remove('active');
			item.classList.remove('show');
		})
		allSideDivider.forEach(item=> {
			item.textContent = item.dataset.text;
		})
	}
})

function searchEnrolledStudents() {
    const botsearchInput = document.getElementById('botsearchInput').value;
    window.location.href = `/admin_students?page=1&search=${encodeURIComponent(botsearchInput)}`;
}







// ============================== TABLE FUNCTIONALITY =================================

// FETCH FOR SEARCH AND DISPLAY
async function fetchAllRegisteredStudents(page = 1) {
    try {
        const response = await fetch(`/search_registered_students?page=${page}`);
        const data = await response.json();

        displayRegisteredStudents(data.students);
        updatePagination(data.total, data.page, data.per_page);
    } catch (error) {
        console.error("Error fetching students:", error);
        alert("An error occurred while fetching students. Please try again.");
    }
}

// SEARCH
async function searchRegisteredStudents(page = 1) {
    const query = document.getElementById('registeredSearchInput').value.trim();

    try {
        const response = await fetch(`/search_registered_students?query=${encodeURIComponent(query)}&page=${page}`);
        const data = await response.json();

        displayRegisteredStudents(data.students);
        updatePagination(data.total, data.page, data.per_page);
    } catch (error) {
        console.error("Error fetching search results:", error);
        alert("An error occurred while searching. Please try again.");
    }
}


// PAGINATION
let currentPage = 1;  
const perPage = 10;  

function updatePagination(total, page, perPage) {
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = '';  

    const totalPages = Math.ceil(total / perPage);
    const startEntry = (page - 1) * perPage + 1;
    const endEntry = Math.min(page * perPage, total);

    
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination';
    paginationContainer.style.display = 'flex';
    paginationContainer.style.justifyContent = 'center';
    paginationContainer.style.alignItems = 'center';
    paginationContainer.style.gap = '20px';
    paginationContainer.style.padding = '20px 0';
    paginationContainer.style.width = '100%';
    paginationContainer.style.textAlign = 'center';

    // PREVIOUS BUTTON
    if (page > 1) {
        const prevButton = document.createElement('a');
        prevButton.href = `#`; 
        prevButton.textContent = 'Prev';
        prevButton.style.display = 'flex';
        prevButton.style.justifyContent = 'center';
        prevButton.style.alignItems = 'center';
        prevButton.style.padding = '10px 20px';
        prevButton.style.backgroundColor = '#603A7E';
        prevButton.style.color = 'white';
        prevButton.style.textDecoration = 'none';
        prevButton.style.borderRadius = '5px';
        prevButton.style.fontWeight = 'bold';
        prevButton.style.cursor = 'pointer';
        prevButton.style.transition = 'background-color 0.3s ease';

        prevButton.addEventListener('click', (e) => {
            e.preventDefault(); 
            currentPage = page - 1;
            fetchAllRegisteredStudents(currentPage);
        });

        paginationContainer.appendChild(prevButton);
    } else {
        const prevButtonDisabled = document.createElement('span');
        prevButtonDisabled.textContent = 'Prev';
        prevButtonDisabled.style.display = 'flex';
        prevButtonDisabled.style.justifyContent = 'center';
        prevButtonDisabled.style.alignItems = 'center';
        prevButtonDisabled.style.padding = '10px 20px';
        prevButtonDisabled.style.backgroundColor = '#e0e0e0';
        prevButtonDisabled.style.color = '#ccc';
        prevButtonDisabled.style.borderRadius = '5px';
        prevButtonDisabled.style.fontWeight = 'bold';

        paginationContainer.appendChild(prevButtonDisabled);
    }

    // PAGE INDICATOR
    const pageIndicator = document.createElement('span');
    pageIndicator.textContent = `Showing ${startEntry} to ${endEntry} of ${total} entries`;
    pageIndicator.style.fontSize = '16px';
    pageIndicator.style.color = '#603A7E';
    pageIndicator.style.fontWeight = 'bold';

    paginationContainer.appendChild(pageIndicator);

    // NEXT BUTTON
    if (page < totalPages) {
        const nextButton = document.createElement('a');
        nextButton.href = `#`; 
        nextButton.textContent = 'Next';
        nextButton.style.display = 'flex';
        nextButton.style.justifyContent = 'center';
        nextButton.style.alignItems = 'center';
        nextButton.style.padding = '10px 20px';
        nextButton.style.backgroundColor = '#603A7E';
        nextButton.style.color = 'white';
        nextButton.style.textDecoration = 'none';
        nextButton.style.borderRadius = '5px';
        nextButton.style.fontWeight = 'bold';
        nextButton.style.cursor = 'pointer';
        nextButton.style.transition = 'background-color 0.3s ease';

        nextButton.addEventListener('click', (e) => {
            e.preventDefault();  
            currentPage = page + 1;
            fetchAllRegisteredStudents(currentPage);
        });

        paginationContainer.appendChild(nextButton);
    } else {
        const nextButtonDisabled = document.createElement('span');
        nextButtonDisabled.textContent = 'Next';
        nextButtonDisabled.style.display = 'flex';
        nextButtonDisabled.style.justifyContent = 'center';
        nextButtonDisabled.style.alignItems = 'center';
        nextButtonDisabled.style.padding = '10px 20px';
        nextButtonDisabled.style.backgroundColor = '#e0e0e0';
        nextButtonDisabled.style.color = '#ccc';
        nextButtonDisabled.style.borderRadius = '5px';
        nextButtonDisabled.style.fontWeight = 'bold';

        paginationContainer.appendChild(nextButtonDisabled);
    }
    paginationDiv.appendChild(paginationContainer);
}

// DISPLAY 
function displayRegisteredStudents(students) {
    const tbody = document.getElementById('registeredStudentsTableBody');
    tbody.innerHTML = '';  

    if (students.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.setAttribute('colspan', '7');  
        cell.textContent = 'No students found.'; 
        cell.style.textAlign = 'center';  
        cell.style.padding = '20px';  
        cell.style.fontStyle = 'italic'; 
        row.appendChild(cell);
        tbody.appendChild(row);
    } else {
        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.idno}</td>
                <td>
                   <img src="${student.profile_picture || '/static/default-profile.png'}" 
					alt="${student.firstname} ${student.lastname}" 
					style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;">
                </td>
                <td>${student.firstname} ${student.middlename ? student.middlename + ' ' : ''}${student.lastname}</td>
                <td>${student.course}</td>
                <td>${student.year_level}</td>
                <td>${student.email_address}</td>
                <td>${student.username}</td>
            `;
            tbody.appendChild(row);
        });
    }
}


// Call this function when the page loads
window.onload = fetchAllRegisteredStudents;

