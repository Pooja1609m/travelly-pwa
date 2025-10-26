// ------------------------------
// Console log to check JS is working
// ------------------------------
console.log("Dashboard JS Loaded");

// ------------------------------
// Chart.js for Monthly Bookings
// ------------------------------
const ctx = document.getElementById('bookingChart').getContext('2d');
const bookingChart = new Chart(ctx, {
    type: 'bar',  // Bar chart
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],  // Months
        datasets: [{
            label: 'Bookings',
            data: [5, 10, 8, 12, 15, 20],  // Sample booking data
            backgroundColor: '#00b4d8'
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: false }
        }
    }
});

// ------------------------------
// Booking Search / Filter Function
// ------------------------------
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('keyup', function() {
    const filter = searchInput.value.toUpperCase();
    const table = document.querySelector('.bookings table');
    const tr = table.getElementsByTagName('tr');

    // Loop through table rows (skip header row)
    for (let i = 1; i < tr.length; i++) {
        const td = tr[i].getElementsByTagName('td')[1]; // Destination column
        if (td) {
            const txtValue = td.textContent || td.innerText;
            tr[i].style.display = txtValue.toUpperCase().indexOf(filter) > -1 ? '' : 'none';
        }
    }
});
