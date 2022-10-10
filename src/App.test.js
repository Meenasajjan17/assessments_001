import { render, screen } from "@testing-library/react";
import App from "./App";
describe(App, () => {
  it("App should have 3 children", () => {
    const { container } = render(<App />);
    expect(container.childElementCount).toEqual(3); //Passes
  });
  it("App should have Header component", () => {
    const { getByText } = render(<App />);
    expect(getByText("Django Apparels")).toBeInTheDocument(); // Passes
  });
  it("App should have Rewards component", () => {
    const { getByText } = render(<App />);
    expect(getByText("Customer Rewards Report")).toBeInTheDocument(); // Passes
  });
  it("App should have Footer component", () => {
    const { getByText } = render(<App />);
    expect(getByText("Django.com")).toBeInTheDocument(); // Passes
  });
});
