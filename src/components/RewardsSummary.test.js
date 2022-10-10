import { render, waitFor } from "@testing-library/react";
import RewardsSummary from "./RewardsSummary";

describe(RewardsSummary, () => {
  it("RewardsSummary should not render if no data (null) supplied", () => {
    const { container } = render(
      <RewardsSummary rewardsSummary={null} showTransactions={console.log} />
    );
    expect(container.childElementCount).toEqual(0);
  });
  it("RewardsSummary should not render if empty array supplied", () => {
    const { container } = render(
      <RewardsSummary rewardsSummary={[]} showTransactions={console.log} />
    );
    expect(container.childElementCount).toEqual(0);
  });
});
