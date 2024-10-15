function getLastSevenDaysFormatted() {
    const formattedDates = [];
    const today = new Date(); // Get today's date

    // Loop to get the last seven days
    for (let i = 0; i < 7; i++) {
        const date = new Date(today); // Create a new date object for today
        date.setDate(today.getDate() - i); // Subtract i days from today

        // Format the date as MON-DD
        const options = { month: 'short', day: '2-digit' };
        const formattedDate = date.toLocaleDateString('en-US', options).replace(',', ''); // Remove the comma
        formattedDates.push(formattedDate);
    }

    return formattedDates.reverse(); // Reverse to show from oldest to newest
}

// Example usage
const lastSevenDays = getLastSevenDaysFormatted();