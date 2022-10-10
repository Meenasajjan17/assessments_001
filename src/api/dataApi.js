import {
  customerInfo as custData,
  transactionInfo as transactData,
} from "./demoDb";

//Class Object: To stage API Calls to overcome unavailability of APIs.
class api {
  //Class Empty Constructor: Initialize Data
  constructor() {
    this.customerInfo = [];
    this.transactionInfo = [];
    this.initialize();
  }

  //Instance Method: Initialize Data
  initialize = () => {
    //Initialize customer info
    Object.assign(this.customerInfo, custData);

    //Enrich Transactions with Rewards & DataPeriod information
    var data = transactData.map((obj) => ({
      ...obj,
      rewardPoints: this.calculateRewards(obj.transactionAmount),
      dataPeriod: this.getMonthInfo(obj.transactionDate),
      customerName: this.customerInfo.find((x) => x.id === obj.customerId)
        ?.name,
    }));

    //Initialize Enriched Transactions
    Object.assign(this.transactionInfo, data);
    this.customerInfo.sort((a, b) => (a.name > b.name ? 1 : -1));
    this.transactionInfo.sort((a, b) =>
      a.customerName + a.dataPeriod > b.customerName + b.dataPeriod ? 1 : -1
    );
  };

  //Instance Method: Generate Data Period Month - Year format
  getMonthInfo = (strDate) => {
    var date = new Date(strDate);
    const month = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(
      -2
    )}`;
    return month;
  };

  //Instance Method: Calulate Reward/Logic
  calculateRewards = (transactionAmount) => {
    //Rounding to base valuedecimals are not needed per specification
    var amount = Math.floor(transactionAmount);
    //If Amount is between 50 & 100 => get Amount above $50 = $Y => Y rewards points
    if (amount >= 50 && amount <= 100) {
      return amount - 50;
    } else if (amount > 100) {
      /*Else 
            If Amount is > 100 => get Amount above 100 = Amount - 100 => $Y => 2 * Y rewards points 
            Plus
            Get Amount above $50 = $50 => 50 * 1 rewards points = 50
            Note: Avoid double counting 
    */
      return 2 * (amount - 100) + 50;
    }
    return 0;
  };

  //Static Method<Promise> : Get All Transactions
  static getTransactions = () =>
    new Promise((resolve, reject) => {
      //Access Instance Field from Static Method
      var data = new api().transactionInfo;

      //Reject Promise if no transactions
      if (!data) {
        return setTimeout(
          () => reject(new Error("Transactions not found")),
          250
        );
      }
      //Resolve Promise with transaction dataset
      setTimeout(() => resolve(Object.values(data)), 500);
    });

  //Static Method<Promise> : Get Specfic Transaction
  static getTransaction = (id) =>
    new Promise((resolve, reject) => {
      //Access Instance Field from Static Method
      var data = new api().transactionInfo;

      //Reject Promise if no transactions
      if (!data) {
        return setTimeout(
          () => reject(new Error("Transaction not found")),
          250
        );
      }
      const transaction = data.find((x) => x.transactionId === id);
      //Reject Promise if no transaction
      if (!transaction) {
        return setTimeout(
          () => reject(new Error("Transaction not found")),
          250
        );
      }
      //Resolve Promise with transaction data
      setTimeout(() => resolve(Object.values(transaction)), 500);
    });

  //Static Method<Promise> : Get Transactions by Month for a Customer
  static getMonthlyTransactionsByCustomer = (customerId, dataPeriod) =>
    new Promise((resolve, reject) => {
      //Access Instance Field from Static Method
      var data = new api().transactionInfo;

      //Reject Promise if no transactions
      if (!data) {
        return setTimeout(
          () => reject(new Error("Transactions not found")),
          250
        );
      }
      const transactions = data.filter(
        (x) => x.customerId === customerId && x.dataPeriod === dataPeriod
      );
      //Reject Promise if no transactions for the customer
      if (!transactions || transactions.length === 0) {
        return setTimeout(
          () => reject(new Error("Transactions not found")),
          250
        );
      }
      //Sort Transaction by Date
      transactions.sort((a, b) =>
        new Date(a.transactionDate) > new Date(b.transactionDate) ? 1 : -1
      );

      //Resolve Promise with transaction dataset
      setTimeout(() => resolve(Object.values(transactions)), 500);
    });

  //Static Method<Promise> : Get All Customers
  static getCustomers = () =>
    new Promise((resolve, reject) => {
      //Access Instance Field from Static Method
      var data = new api().customerInfo;

      //Reject Promise if no customer data
      if (!data) {
        return setTimeout(() => reject(new Error("Customers not found")), 250);
      }

      //Resolve Promise with customer dataset
      setTimeout(() => resolve(Object.values(data)), 250);
    });

  //Static Method<Promise> : Get Specfic Customer
  static getCustomer = (id) =>
    new Promise((resolve, reject) => {
      //Access Instance Field from Static Method
      var data = new api().customerInfo;

      //Reject Promise if no customer data
      if (!data) {
        return setTimeout(() => reject(new Error("Customer not found")), 250);
      }

      //Reject Promise if no customer found
      const customer = data.find((x) => x.id === id);
      if (!customer) {
        return setTimeout(() => reject(new Error("Customer not found")), 250);
      }
      //Resolve Promise with customer data
      setTimeout(() => resolve(Object.values(customer)), 250);
    });

  //Static Method<Promise> : Get Total Reward Points by Month
  static getTotalRewardsByMonth = () =>
    new Promise((resolve, reject) => {
      //Access Instance Field from Static Method
      var data = new api().transactionInfo;

      if (!data) {
        return setTimeout(() => reject(new Error("Rewards not found")), 500);
      }

      //Optimize object
      const dataOptimized = data.map((obj) => ({
        dataPeriod: obj.dataPeriod,
        rewardPoints: obj.rewardPoints,
      }));

      //Reduce & Accumulate Rewards Points by Month
      const finalResult = [
        ...dataOptimized
          .reduce((r, o) => {
            const key = o.dataPeriod;

            const item =
              r.get(key) || Object.assign({}, o, { rewardPoints: 0 });

            item.rewardPoints += o.rewardPoints;

            return r.set(key, item);
          }, new Map())
          .values(),
      ];

      //Resolve Promise with transaction summary
      setTimeout(() => resolve(Object.values(finalResult)), 500);
    });

  //Static Method<Promise> : Get Total Reward Points by Month by Customer
  static getTotalRewardsByMonthByCustomer = () =>
    new Promise((resolve, reject) => {
      //Instance of Api Class
      var apiObj = new api();

      //Access Instance Field from Static Method
      var customers = apiObj.customerInfo;

      //Reject Promise if no customers
      if (!customers) {
        return setTimeout(() => reject(new Error("Customer not found")), 500);
      }

      //Access Instance Field from Static Method
      var data = apiObj.transactionInfo;

      //Reject Promise if no transactions
      if (!data) {
        return setTimeout(() => reject(new Error("Rewards not found")), 500);
      }

      //Optimize & Enrich Data
      const dataOptimized = data.map((obj) => ({
        dataPeriod: obj.dataPeriod,
        customerId: obj.customerId,
        customerName: obj.customerName,
        rewardPoints: obj.rewardPoints,
      }));

      //Reduce & Accumulate Rewards Points by Month
      const finalResult = [
        ...dataOptimized
          .reduce((r, o) => {
            const key = o.dataPeriod + "-" + o.customerId;

            const item =
              r.get(key) || Object.assign({}, o, { rewardPoints: 0 });

            item.rewardPoints += o.rewardPoints;

            return r.set(key, item);
          }, new Map())
          .values(),
      ];

      //console.log(finalResult);
      //Resolve Promise with transaction dataset
      setTimeout(() => resolve(Object.values(finalResult)), 500);
    });

  //Static Method<Promise> : Get Total Reward Points by Month for specific customer
  static getTotalRewardsByMonthForCustomer = (customerid) =>
    new Promise((resolve, reject) => {
      //Instance of Api Class
      var apiObj = new api();

      //Access Instance Field from Static Method
      var customers = apiObj.customerInfo;

      //Reject Promise if no customers
      if (!customers) {
        return setTimeout(() => reject(new Error("Customer not found")), 500);
      }

      //Filter for Specific Customer using Id (parameter)
      var customer = customers.find((x) => x.id === customerid);

      //Reject Promise if no customer
      if (!customer) {
        return setTimeout(() => reject(new Error("Customer not found")), 500);
      }

      //console.log("test: ", customer);

      //Acccess Instance Field from Static Method
      var data = apiObj.transactionInfo;

      //Reject Promise if no transactions
      if (!data) {
        return setTimeout(() => reject(new Error("Rewards not found")), 500);
      }

      //Filter Transactions for Specific Customer using Id (parameter) & Optimize
      const dataOptimized = data
        .filter((x) => x.customerId === customerid)
        .map((obj) => ({
          dataPeriod: obj.dataPeriod,
          customerId: obj.customerId,
          customerName: obj.customerName,
          rewardPoints: obj.rewardPoints,
        }));

      //Reject Promise if no data
      if (!dataOptimized || dataOptimized.length === 0) {
        return setTimeout(() => reject(new Error("Rewards not found")), 500);
      }

      //Reduce & Accumulate Rewards Points by Month
      const finalResult = [
        ...dataOptimized
          .reduce((r, o) => {
            const key = o.dataPeriod + "-" + o.customerId;

            const item =
              r.get(key) || Object.assign({}, o, { rewardPoints: 0 });

            item.rewardPoints += o.rewardPoints;

            return r.set(key, item);
          }, new Map())
          .values(),
      ];

      //console.log(finalResult)
      //Resolve Promise with transaction dataset
      setTimeout(() => resolve(Object.values(finalResult)), 500);
    });
}

export default api;
