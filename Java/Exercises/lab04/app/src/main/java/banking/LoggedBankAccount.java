package banking;

import java.util.ArrayList;
import java.util.List;

public class LoggedBankAccount extends BankAccount {
    private List<String> log = new ArrayList<String>();

    enum Action {
        WITHDRAW, DEPOSIT
    }

    private void addLog(Action action, double amount) {
        log.add(action + " " + amount);
    }

    /**
    * Deposits an amount of money into the account
    * @param amount the amount of money to deposit
    * @throws IllegalArgumentException if the amount is greater than 0 or less than the current balance
    *
    * @preconditions amount > currentBalance && amount > 0
    * @invariant currentBalance will never be negative
    * @postconditions currentBalance = currentBalance - amount, the action will be added to the log
    */
    @Override
    public void withdraw(double amount) throws IllegalArgumentException {
        super.withdraw(amount);
        addLog(Action.WITHDRAW, amount);

    }

    /**
    * Withdraws an amount of money from the account
    * @param amount the amount of money to withdraw
    * @throws IllegalArgumentException if the amount is greater than 0
    *
    * @preconditions amount > 0
    * @invariant currentBalance will never be negative
    * @postconditions currentBalance = currentBalance + amount, the action will be added to the log
    */
    public void deposit(double amount) {
        super.deposit(amount);
        addLog(Action.DEPOSIT, amount);
    }
}
