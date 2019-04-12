export class Validator {

  public static isValidDateRange (from: string, to: string) {

    const date1 = from.trim();
    const date2 = to.trim();

    if (date1 === '' || date2 === '') {
       return true;
    }
    const day1 = Number(date1.split('/')[0]);
    const month1 = Number(date1.split('/')[1]);
    const year1 = Number(date1.split('/')[2]);

    const day2 = Number(date2.split('/')[0]);
    const month2 = Number(date2.split('/')[1]);
    const year2 = Number(date2.split('/')[2]);

    const dt1 = new Date(year1, month1, day1);
    const dt2 = new Date(year2, month2, day2);

    return dt2 >= dt1;

  }
}
