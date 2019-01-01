export class Converter {

    public static convertDateToJoinDateString(date: Date) {
        let data = '';
        let monthString = '';
        const yearString = date.getFullYear();
        const month = date.getMonth();

        if (month === 1) {
            monthString = 'Jan';
        } else if (month === 2) {
            monthString = 'Feb';
        } else if (month === 3) {
            monthString = 'Mar';
        } else if (month === 4) {
            monthString = 'Apr';
        } else if (month === 5) {
            monthString = 'May';
        } else if (month === 6) {
            monthString = 'June';
        } else if (month === 7) {
            monthString = 'July';
        } else if (month === 8) {
            monthString = 'Aug';
        } else if (month === 9) {
            monthString = 'Sept';
        } else if (month === 10) {
            monthString = 'Oct';
        } else if (month === 11) {
            monthString = 'Nov';
        } else if (month === 12) {
            monthString = 'Dec';
        }

        data =  monthString + ' ' + yearString;
        return data;
    }

    public static ConvertCurrentDateToString(): string {
        const currentDate = new Date();
        return currentDate.getDate() + '/' + currentDate.getMonth() + '/' + currentDate.getFullYear();
    }
}
