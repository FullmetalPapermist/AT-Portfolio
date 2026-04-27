package banking;

public class BankAccount {
    private double currentBalance = 0;

    /**
    * Deposits an amount of money into the account
    * @param amount the amount of money to deposit
    * @throws IllegalArgumentException if the amount is greater than 0 or less than the current balance
    *
    * @preconditions amount > currentBalance && amount > 0
    * @invariant currentBalance will never be negative
    * @postconditions currentBalance = currentBalance - amount
    */
    public void withdraw(double amount) throws IllegalArgumentException {
        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        if (amount >= currentBalance) {
            throw new IllegalArgumentException("Amount must be less than balance");
        }
        currentBalance -= amount;
    }

    /**
     * Withdraws an amount of money from the account
     * @param amount the amount of money to withdraw
     * @throws IllegalArgumentException if the amount is greater than 0
     *
     * @preconditions amount > 0
     * @invariant currentBalance will never be negative
     * @postconditions currentBalance = currentBalance + amount
     */
    public void deposit(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        currentBalance += amount;
    }
}
