import { render, waitFor } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import Rewards from "./Rewards";
import { Simulate } from "react-dom/test-utils";

describe(Rewards, () => {
  it("Rewards component should have 4 children", () => {
    const { container } = render(<Rewards />);
    expect(container.childElementCount).toEqual(4);
  });
  it("Rewards component should get Customers data have rendered Customer Select with default option as ---Select Customer---", async () => {
    const { queryByTestId } = render(<Rewards />);
    await waitFor(() => {
      const selectBox = queryByTestId("select_cx");
      //console.log(selectBox);
      expect(selectBox).toBeInTheDocument();
    });
  });
  it("Rewards component should have Customer Select with 11 options (10 from API, 1 default)", async () => {
    const { getAllByRole } = render(<Rewards />);
    await waitFor(() => {
      const datalength = getAllByRole("option").length;
      expect(datalength).toBe(11);
    });
  });
  it("Rewards component should have Customer Select with default option as ---Select Customer--- ", async () => {
    const { queryByTestId } = render(<Rewards />);
    //
    await waitFor(() => {
      const selectBox = queryByTestId("select_cx");
      //console.log(selectBox);
      expect(selectBox).toHaveValue("---Select Customer---");
    });
  });
  it("Rewards component should have RewardsSummary component", async () => {
    const { queryByTestId } = render(<Rewards />);
    await waitFor(() => {
      expect(queryByTestId("rewardsSummary_header")).toBeInTheDocument(); // Passes
    });
  });
  it("Rewards component should not have Transactions initially", async () => {
    const { queryByTestId } = render(<Rewards />);
    await waitFor(() => {
      const headerTx = queryByTestId("transaction_header");
      expect(headerTx).toBeNull(); // Passes
    });
  });
  it("Rewards Component should allow user to change Customer dropdown & verify the value", async () => {
    const { queryByTestId, findByTestId } = render(<Rewards />);

    //Wait for Rewards Data to be populated
    await waitFor(() => {
      expect(queryByTestId("rewardsSummary_header")).toBeInTheDocument(); // Passes
    });

    //Simulate Customer Select Customer Id: c--05, Customer Name: Ellije, Durpin
    fireEvent.change(await findByTestId("select_cx"), {
      target: { value: "c-005" },
    });
    expect(await findByTestId("select_cx")).toHaveValue("c-005");
    expect(await findByTestId("select_cx")).toHaveTextContent("Ellije, Durpin");
  });
  it("Rewards Component should populate Transactions on the event of click Show Transaction", async () => {
    const { queryByTestId, findByTestId, findAllByTestId, queryAllByTestId } =
      render(<Rewards />);

    //Wait for Rewards Data to be populated
    await waitFor(() => {
      expect(queryByTestId("rewardsSummary_header")).toBeInTheDocument(); // Passes
    });

    await waitFor(() => {
      const buttons = queryAllByTestId("show_transaction_button");
      Simulate.click(buttons[0]);
    });

    expect(await findByTestId("rewardsSummary_header")).toBeInTheDocument(); // Passes
    expect(await findByTestId("transaction_header")).toBeInTheDocument(); // Passes
  });
});
