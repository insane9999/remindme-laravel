import dayjs from 'dayjs';

class Utils {
    static formatDate(timestamp: number): string {
        return dayjs(timestamp * 1000).format("M/D/YYYY h:mm A");
    }
}

export default Utils;