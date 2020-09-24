export class MISC {
    static convertRawTimeToDate(rawTime: any) {
        if (rawTime === null) return 'NULL';
        const a = new Date(rawTime * 1000);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug' ,'Sep' ,'Oct' ,'Nov' ,'Dec'];
        const year = a.getFullYear();
        const month = months[a.getMonth()];
        const date = a.getDate();

        return `${month} ${date}, ${year}`;
    }
}