module.exports = (timestamp) => 
{
    const dateObj = new Date(timestamp);

    const month = dateObj.getMonth();
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();

    let hour;
    
    // check for 24-hr time
    if (dateObj.getHours > 12)
        hour = Math.floor(dateObj.getHours() / 2);
    else
        hour = dateObj.getHours();

    // if hour is 0 (12:00am), change it to 12
    if (hour === 0)
        hour = 12;

    const minutes = dateObj.getMinutes();

    // set `am` or `pm`
    let periodOfDay;

    if (dateObj.getHours() >= 12)
        periodOfDay = 'pm';
    else
        periodOfDay = 'am';

    const formattedTimeStamp = `${month}/${day}/${year} @ ${hour}:${minutes} ${periodOfDay}`;

    return formattedTimeStamp;
};