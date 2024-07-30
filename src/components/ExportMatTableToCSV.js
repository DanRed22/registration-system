const ExportMatTableToCSV = (tableId, filename) => {
    const table = document.querySelector(tableId);
    if (!table) {
        console.error('Table not found');
        return;
    }

    let csv = [];
    const rows = table.querySelectorAll('tr');

    for (const row of rows) {
        const cols = row.querySelectorAll('td, th');
        const rowData = [];
        for (const col of cols) {
            // Replace commas with spaces to avoid CSV format issues
            rowData.push(col.innerText.replace(/,/g, ' '));
        }
        csv.push(rowData.join(','));
    }

    // Create CSV string
    const csvString = csv.join('\n');
    
    // Create a Blob from the CSV string
    const blob = new Blob([csvString], { type: 'text/csv' });
    
    // Create a link element to trigger the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    
    // Append link to the body, trigger the click and then remove the link
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export default ExportMatTableToCSV;