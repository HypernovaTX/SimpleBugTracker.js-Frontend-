export class Misc {
    static convertRawTimeToDate(rawTime: any): string {
        if (rawTime === null) return 'NULL';
        const a = new Date(rawTime * 1000);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug' ,'Sep' ,'Oct' ,'Nov' ,'Dec'];
        const year = a.getFullYear();
        const month = months[a.getMonth()];
        const date = a.getDate();

        return `${month} ${date}, ${year}`;
    }

    /** Make sure the API request from the database does not return as blank
    * @param {string} checkData - Must be an object as tring (try JSON.stringfy)
    * @returns {boolean}
    */
   static isValidItem(checkData: string): boolean {
       const check = JSON.parse(checkData);
       if (check.tid === null
       || check.tid === ''
       || check.title === '') {
           return false;
       }
       return true;
   }
}