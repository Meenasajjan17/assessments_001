import React from "react";

const RewardsSummary = ({ rewardsSummary, showTransactions }) => {
  if (!rewardsSummary || rewardsSummary.length === 0) return null;
  return (
    <>
      <div>
        <h5
          data-testid='rewardsSummary_header'
          className='user-select-none text-center'
        >
          Rewards Accumulated
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
              <th>Customer Name</th>
              <th>Period</th>
              <th>Reward Points</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className='table-group-divider'>
            {rewardsSummary
              .filter((x) => x.visible)
              .map((row, index) => {
                return (
                  <tr key={`t-row-${index}`}>
                    <td
                      key={`t-cell1-${index}_${row.customerId}`}
                      align='left'
                      style={{ paddingLeft: "10px" }}
                    >
                      {row.customerName}
                    </td>
                    <td
                      key={`t-cell2-${index}_${row.customerId}`}
                      align='center'
                    >
                      {row.dataPeriod}
                    </td>
                    <td
                      key={`t-cell3-${index}_${row.customerId}`}
                      align='right'
                      style={{ paddingRight: "10px" }}
                    >
                      {row.rewardPoints.toLocaleString("en-US")}
                    </td>
                    <td key={`t-cell4-${index}_${row.customerId}`}>
                      <button
                        key={`t-cell-button${index}_${row.customerId}`}
                        type='button'
                        className='btn btn-sm btn-link'
                        onClick={(e) =>
                          showTransactions(row.customerId, row.dataPeriod)
                        }
                        data-testid='show_transaction_button'
                      >
                        Show Transactions
                      </button>
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

export default RewardsSummary;
