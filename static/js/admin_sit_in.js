
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


// SEARCH RESERVED STUDENTS - Triggers when the search button is clicked
function searchReservedStudents() {
    const query = document.getElementById('searchInput').value.trim();

    if (query.length > 0) {
        fetch(`/search_reserved_students?query=${query}`)
            .then(response => response.json())
            .then(data => {
                if (data.students.length > 0) {
                    const student = data.students[0]; 

                    // Automatically open the modal for the first student result
                    openSitInModal(student);
                    document.getElementById('openModalBtn').style.display = 'none';  // Hide the button

                } else {
                    alert("No reserved students found.");
                    document.getElementById('openModalBtn').style.display = 'none';  // Hide the button if no results
                }
            })
            .catch(error => {
                console.error('Error fetching reserved students:', error);
            });
    } else {
        // Hide the button if search input is empty
        document.getElementById('openModalBtn').style.display = 'none';  
    }
}

// SEARCH BUTTON
document.getElementById('searchBtn').addEventListener('click', searchReservedStudents);
// FUNCTION TO OPEN MODAL AND POPULATE A STUDENT DATA 
function openSitInModal(student) {
    document.getElementById('idNumber').value = student.idno;
    document.getElementById('studentName').value = student.student_name;
    document.getElementById('purpose').value = student.purpose;
    document.getElementById('lab').value = student.lab;
    document.getElementById('remainingSessions').value = student.remaining_sessions;

    // SHOW MODAL
    document.getElementById('sitInModal').style.display = 'flex';
}

// CLOSE MODAL
document.getElementById('closeModal').onclick = function() {
    document.getElementById('sitInModal').style.display = 'none';
};

// ACCEPT BUTTON
document.getElementById('acceptBtn').onclick = function() {
    const idNumber = document.getElementById('idNumber').value;
    fetch(`/accept_reservation`, {
        method: 'POST',
        body: new URLSearchParams({ idNumber: idNumber })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error accepting reservation:', error);
    });

    // CLOSE MODAL AFTER ACCEPTING
    document.getElementById('sitInModal').style.display = 'none';
};

// REJECT BUTTON
document.getElementById('rejectBtn').onclick = function() {
    const idNumber = document.getElementById('idNumber').value;
    fetch(`/reject_reservation`, {
        method: 'POST',
        body: new URLSearchParams({ idNumber: idNumber })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error rejecting reservation:', error);
    });

    // CLOSE MODAL
    document.getElementById('sitInModal').style.display = 'none';
};
