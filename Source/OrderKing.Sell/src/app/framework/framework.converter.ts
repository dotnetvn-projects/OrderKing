export class Converter {

    public static convertDateToJoinDateString(date: Date) {
        let data = '';
        let monthString = '';
        const yearString = date.getFullYear();
        const month = date.getMonth();

        if (month === 0) {
            monthString = 'Jan';
        } else if (month === 1) {
            monthString = 'Feb';
        } else if (month === 2) {
            monthString = 'Mar';
        } else if (month === 3) {
            monthString = 'Apr';
        } else if (month === 4) {
            monthString = 'May';
        } else if (month === 5) {
            monthString = 'June';
        } else if (month === 6) {
            monthString = 'July';
        } else if (month === 7) {
            monthString = 'Aug';
        } else if (month === 8) {
            monthString = 'Sept';
        } else if (month === 9) {
            monthString = 'Oct';
        } else if (month === 10) {
            monthString = 'Nov';
        } else if (month === 11) {
            monthString = 'Dec';
        }

        data =  monthString + ' ' + yearString;
        return data;
    }

    public static ConvertCurrentDateToString(): string {
        const currentDate = new Date();
        return currentDate.getDate() + '/' +  (currentDate.getMonth() + 1) + '/' + currentDate.getFullYear();
    }
}
