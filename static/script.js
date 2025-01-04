Chart.defaults.font.family = 'Arial, sans-serif';
Chart.defaults.color = '#333';

let charts = {
    studentsByYear: null,
    averageBySpecialty: null,
    genderDistribution: null,
    specialtyEvolution: null
};

const chartColors = {
    blue: '#1a237e',
    lightBlue: '#3949ab',
    darkBlue: 'rgba(94, 53, 177, 0.2)',
    purple: '#5e35b1',
    deepPurple: '#4527a0',
    specialties: [
        '#1a237e', '#3949ab', '#5e35b1', '#4527a0',
        '#283593', '#3f51b5', '#5c6bc0'
    ]
};

function FetchData(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject(new Error(`HTTP error! status: ${xhr.status}`));
            }
        };
        xhr.onerror = () => {
            reject(new Error('Network error'));
        };
        xhr.send();
    });
}

async function initializeCharts() {
    await Promise.all([
        createStudentsByYearChart(),
        createAverageBySpecialtyChart(),
        createGenderDistributionChart(),
        createSpecialtyEvolutionChart()
    ]);
}

async function createStudentsByYearChart() {
    const data = await FetchData('http://localhost:5000/api/students-by-year');
    const ctx = document.getElementById('studentsByYearChart').getContext('2d');
    
    if (charts.studentsByYear) {
        charts.studentsByYear.destroy();
    }

    charts.studentsByYear = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => item.ANNEE),
            datasets: [{
                label: 'Nombre d\'étudiants',
                data: data.map(item => item.count),
                backgroundColor: chartColors.blue,
                borderColor: chartColors.blue,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
            }
        }
    });
}

async function createAverageBySpecialtyChart() {
    const data = await FetchData('http://localhost:5000/api/average-by-specialty');
    const ctx = document.getElementById('averageBySpecialtyChart').getContext('2d');
    
    if (charts.averageBySpecialty) {
        charts.averageBySpecialty.destroy();
    }

    charts.averageBySpecialty = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(item => item.SPECIALITE),
            datasets: [{
                label: 'Moyenne générale',
                data: data.map(item => item.moyenne),
                borderColor: chartColors.purple,
                backgroundColor: chartColors.darkBlue,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 20
                }
            }
        }
    });
}

async function createGenderDistributionChart() {
    const data = await FetchData('http://localhost:5000/api/gender-distribution');
    const ctx = document.getElementById('genderDistributionChart').getContext('2d');
    
    if (charts.genderDistribution) {
        charts.genderDistribution.destroy();
    }

    charts.genderDistribution = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.map(item => item.SEXE === 'H' ? 'Hommes' : 'Femmes'),
            datasets: [{
                data: data.map(item => item.count),
                backgroundColor: [chartColors.blue, chartColors.purple],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
            }
        }
    });
}

async function createSpecialtyEvolutionChart() {
    const data = await FetchData('http://localhost:5000/api/specialty-evolution');

    const specialties = [...new Set(data.map(item => item.SPECIALITE))];
    const years = [...new Set(data.map(item => item.ANNEE))];
    
    const datasets = specialties.map((specialty, index) => {
        const specialtyData = years.map(year => {
            const entry = data.find(item => item.SPECIALITE === specialty && item.ANNEE === year);
            return entry ? entry.count : 0;
        });
        
        return {
            label: specialty,
            data: specialtyData,
            borderColor: chartColors.specialties[index % chartColors.specialties.length],
            backgroundColor: chartColors.specialties[index % chartColors.specialties.length],
            tension: 0.4
        };
    });

    const ctx = document.getElementById('specialtyEvolutionChart').getContext('2d');
    
    if (charts.specialtyEvolution) {
        charts.specialtyEvolution.destroy();
    }

    charts.specialtyEvolution = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
            }
        }
    });
}

document.getElementById('refreshBtn').addEventListener('click', initializeCharts);
document.addEventListener('DOMContentLoaded', initializeCharts);