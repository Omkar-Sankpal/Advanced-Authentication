export const formatDate = (datestring) => {
    const date = new Date(datestring);
    if(isNaN(date.getTime())) {
        return "Invalid Date";
    }

    return date.toLocaleDateString("en-US",{
        year: "numeric",
        month: 'short',
        day:"numeric",
        hour:"2-digit",
        minute:"2-digit",
        hour12: true,
    });
};