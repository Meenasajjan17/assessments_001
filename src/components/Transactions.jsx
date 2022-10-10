import React from "react";

const Transactions = ({ transactions }) => {
  if (!transactions || transactions.length === 0) return null;
  return (
    <>
      <div>
        <h5
          data-testid='transaction_header'
          className='text-center user-select-none'
        >
          Transactions
        </h5>
      </div>
      <div
        className='border-top'
        style={{
          maxHeight: "300px",
          overflowY: "auto",
          maxWidth: "525px",
        }}
      >
        <table style={{ width: 500 }} className='table table-striped'>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Reward Points</th>
            </tr>
          </thead>
          <tbody className='table-group-divider'>
            {transactions.map((row, index) => {
              return (
                <tr key={`t-row-${index}`}>
                  <td
                    key={`t-cell1-${index}_${row.customerId}`}
                    align='left'
                    style={{ paddingLeft: "10px" }}
                  >
                    {row.customerName}
                  </td>
                  <td key={`t-cell3-${index}_${row.customerId}`} align='right'>
                    {row.transactionDate &&
                      new Date(row.transactionDate).toLocaleDateString("en-US")}
                  </td>
                  <td
                    key={`t-cell4-${index}_${row.customerId}`}
                    align='right'
                    style={{ paddingRight: "10px" }}
                  >
                    {row.transactionAmount.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                  <td
                    key={`t-cell5-${index}_${row.customerId}`}
                    align='right'
                    style={{ paddingRight: "10px" }}
                  >
                    {row.rewardPoints.toLocaleString("en-US")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Transactions;
