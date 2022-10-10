import { render, waitFor } from "@testing-library/react";
import Transactions from "./Transactions";

describe(Transactions, () => {
  it("Transactions should not render if no data supplied", () => {
    const { container } = render(<Transactions transactions={null} />);
    expect(container.childElementCount).toEqual(0);
  });
  it("Transactions should not render if empty array supplied", () => {
    const { container } = render(<Transactions transactions={[]} />);
    expect(container.childElementCount).toEqual(0);
  });
});
