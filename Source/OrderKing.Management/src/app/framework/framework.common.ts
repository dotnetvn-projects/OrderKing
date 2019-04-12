export class Common {

  // get diff days from 2 dates string
  public static getDiffDays(date1: string, date2: string) {

    const day1 = Number(date1.split('/')[0]);
    const month1 = Number(date1.split('/')[1]);
    const year1 = Number(date1.split('/')[2]);

    const day2 = Number(date2.split('/')[0]);
    const month2 = Number(date2.split('/')[1]);
    const year2 = Number(date2.split('/')[2]);

    const dt1 = new Date(year1, month1, day1);
    const dt2 = new Date(year2, month2, day2);

    const subtractDate = (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
                         Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()));
    let diffDays = Math.floor(subtractDate / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
       diffDays = 1;
    }

    return diffDays;
  }
}
