import moment from "moment";

class Order {
    constructor(id,items,totalAmount,date) {
        this.id = id;
        this.items = items;
        this.totalAmount = totalAmount;
        this.date = date
    }

    get readableDate() {
        // return this.date.toLocaleDateString('en-EN', {
        //     year: 'numeric',
        //     month: 'long',
        //     day: "numeric",
        //     hour: '2-digit',
        //     minute : '2-digit' This is not working properly on Android time is not showig
        // })
        return moment(this.date).format('MMMM Do YYYY, h:mm')
    }
}

export default Order;