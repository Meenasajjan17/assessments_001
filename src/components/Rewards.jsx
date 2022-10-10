import React from "react";
import { useEffect, useState, useMemo } from "react";
import api from "../api/dataApi";
import InfoBox from "./InfoBox";
import RewardsSummary from "./RewardsSummary";
import { Spinner } from "./Spinner";
import Transactions from "./Transactions";
const Rewards = () => {
  const [customers, setcustomers] = useState(null);
  const [rewardsSummary, setRewardsSummary] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [isLoading, setIsloading] = useState(true);
  const [isError, setIsError] = useState(false);

  //Get Customers & Rewards Data from API when the component is loaded for first tine (empty dependency array)
  useEffect(() => {
    const fetchcustomers = async () => {
      const customerdata = await api.getCustomers();
      return customerdata;
    };
    const fetchRewards = async () => {
      const rewardsData = await api.getTotalRewardsByMonthByCustomer();
      return rewardsData;
    };

    fetchcustomers()
      .then((data) => {
        setcustomers(data);
        //console.log(data);
      })
      .catch((err) => {
        setIsError(true);
        console.error(err);
      });

    fetchRewards()
      .then((data) => {
        const adj = data.map((obj) => ({
          ...obj,
          visible: true,
        }));
        setRewardsSummary(adj);
        //console.log(data);
      })
      .catch((err) => {
        setIsError(true);
        console.error(err);
      })
      .finally(setIsloading(false));
  }, []);

  //Handle Customer Selection Dropdown Change
  const onOptionChangeHandler = (custId) => {
    //console.log(custId);
    const adj = rewardsSummary.map((obj) => ({
      ...obj,
      visible:
        obj.customerId === custId || custId === "---Select Customer---"
          ? true
          : false,
    }));
    setRewardsSummary(adj);
    setTransactions(null);
  };

  //Aggregate Rewards Points
  const aggregareRewards = () => {
    if (!rewardsSummary) return 0;
    return rewardsSummary
      .filter((x) => x.visible)
      .reduce((acc, obj) => {
        return acc + obj.rewardPoints;
      }, 0);
  };

  //Aggregate Transaction Amount & Rewards Points
  const aggregateTransactions = () => {
    if (!transactions) return [0, 0];
    const rewards = transactions.reduce((acc, obj) => {
      return acc + obj.rewardPoints;
    }, 0);

    const amount = transactions.reduce((acc, obj) => {
      return acc + obj.transactionAmount;
    }, 0);

    return [rewards, amount];
  };

  //Memoized function for expensive Rewards Points aggegation
  // eslint-disable-next-line
  const totalRewards = useMemo(() => aggregareRewards(), [rewardsSummary]);

  //Memoized function for expensive Transaction Amount & Rewards Points aggegation
  // eslint-disable-next-line
  const transactionSummary = useMemo(
    () => aggregateTransactions(),
    [transactions]
  );

  //Handle Show Transaction Link Event
  const showTransactions = async (customerId, dataPeriod) => {
    setIsloading(true);
    setIsError(false);
    try {
      const data = await api.getMonthlyTransactionsByCustomer(
        customerId,
        dataPeriod
      );
      setTransactions(data);
    } catch (error) {
      setIsError(true);
      setTransactions(null);
    } finally {
      setIsloading(false);
    }
  };
  return (
    <>
      {/* Child 1 */}
      <div className='row mb-3'>
        <div className='col-12'>
          <div className='d-flex justify-content-center'>
            <div>
              <h4 className='text-center user-select-none text-primary'>
                Customer Rewards Report
              </h4>
            </div>
            <div className='ms-2' style={{ width: "50px" }}>
              {isLoading && <Spinner />}
            </div>
          </div>
        </div>
      </div>
      {/* Child 2 */}
      <div className='row mb-2'>
        <div className='col-6'>
          {customers && (
            <div
              style={{
                maxWidth: "600px",
                display: "flex",
                alignItems: "baseline",
              }}
            >
              <h6 className='user-select-none' style={{ paddingRight: "10px" }}>
                Customer Filter
              </h6>
              <select
                className='form-select'
                onChange={(e) => onOptionChangeHandler(e.target.value)}
                style={{ maxWidth: "200px" }}
                data-testid='select_cx'
              >
                <option>---Select Customer---</option>
                {customers.map((cust, index) => {
                  return (
                    <option
                      key={index}
                      value={cust.id}
                      data-testid='select-option'
                    >
                      {cust.name}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>
      </div>
      {isError === true && (
        <div className='row mt-3'>
          <div className='col-4'>
            <InfoBox title={"Error"} info={"Something went wrong..."} />
          </div>
        </div>
      )}
      {/* Child 3 */}
      <div className='row mt-3'>
        <div className='col-6'>
          <RewardsSummary
            rewardsSummary={rewardsSummary}
            showTransactions={showTransactions}
          />
        </div>
        <div className='col-6'>
          <Transactions transactions={transactions} />
        </div>
      </div>
      {/* Child 4 */}
      <div className='row mt-3'>
        <div className='col-6'>
          <div className='d-flex justify-content-between'>
            <h6 className='user-select-none'>
              {`Total Rewards Points: ${totalRewards.toLocaleString("en-US")}`}
            </h6>
          </div>
        </div>
        <div className='col-6'>
          {transactions && (
            <div className='d-flex'>
              <div className='user-select-none ps-1 pe-4'>
                <h6>
                  {`Total Amount Spent: 
                  ${transactionSummary[1].toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}`}
                </h6>
              </div>
              <div className='user-select-none ml-auto'>
                <h6>
                  {`Total Rewards Accumulated: 
                  ${transactionSummary[0].toLocaleString("en-US")}
                  `}
                </h6>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Rewards;
