import React from "react";
import { render, screen, fireEvent,waitFor  } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Login from "../components/Login.js";
import apiClient from "../services/apiClient.js";

//  Mock the API response for login
jest.mock("../services/apiClient.js");

describe("Login Component", () => {
  const mockSetIsAuthenticated = jest.fn();


  beforeEach(() => {
    render(
      <Router>
        <Login setIsAuthenticated={mockSetIsAuthenticated} />
      </Router>
    );
  });

  it("renders login form correctly", () => {
    //  Check if the form is rendered
    expect(screen.getByLabelText(/email/i, { selector: 'input' })).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i, { selector: 'input' })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("allows user to input email and password", () => {
    const emailInput = screen.getByLabelText(/email/i, { selector: 'input' });
    const passwordInput = screen.getByLabelText(/password/i, { selector: 'input' });

    //  Simulate user input
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  it("toggles password visibility", () => {
    const passwordInput = screen.getByLabelText(/password/i, { selector: 'input' });
    const toggleButton = screen.getByRole('button', { name: /show password/i });

    //  Password should initially be hidden
    expect(passwordInput.type).toBe("password");

    //  Click the toggle button to show the password
    fireEvent.click(toggleButton);

    //  Password should now be visible
    expect(passwordInput.type).toBe("text");

    
  });

  it("submits the form with valid input and calls the login API", async () => {
    //  Mock a successful API response
    apiClient.post.mockResolvedValue({
      data: { token: "fakeToken", userId: "123" },
    });

    const emailInput = screen.getByLabelText(/email/i, { selector: 'input' });
    const passwordInput = screen.getByLabelText(/password/i, { selector: 'input' });
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    //  Simulate user input and form submission
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    //  Check if the login API was called
    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith("/api/users/login", {
        email: "test@example.com",
        password: "password123",
      });
    });

    //  Check if the setIsAuthenticated function was called
    await waitFor(() => {
      expect(mockSetIsAuthenticated).toHaveBeenCalledWith(true);
    });
  }); 

  it("displays an error message on failed login attempt", async () => {
    //  Mock an unsuccessful API response
    apiClient.post.mockRejectedValue({
      response: {
        data: { message: "Invalid email or password." },
      },
    });

    const emailInput = screen.getByLabelText(/email/i, { selector: 'input' });
    const passwordInput = screen.getByLabelText(/password/i, { selector: 'input' });
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    //  Simulate user input and form submission
    fireEvent.change(emailInput, { target: { value: "wrong@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(submitButton);

    //  Check if the error message is displayed
    expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument();
  });
});
