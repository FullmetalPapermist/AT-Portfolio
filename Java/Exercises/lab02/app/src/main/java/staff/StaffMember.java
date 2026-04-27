package staff;

import java.time.LocalDate;

/**
 * A staff member
 * @author Robert Clifton-Everest
 *
 */
public class StaffMember {
    private String name;
    private Double salary;
    private LocalDate hireDate;
    private LocalDate endDate;

    /**
     * Returns the staff's name
     * @return The full name of the staff
     */
    public String getName() {
        return name;
    }

    /**
     * Sets the staff's name
     * @param name The staff's new name
     * @throws IllegalArgumentException if the staff has no name
     */
    public void setName(String name) {
        if (name.length() == 0) {
            throw new IllegalArgumentException("Staff must have a name");
        }
        this.name = name;
    }

    /**
     * Returns the staff's salary
     * @return The staff's salary as a double
     */
    public Double getSalary() {
        return salary;
    }

    /**
     * Sets a staff's salary
     * @param salary The staff's new salary
     * @throws IllegalArgumentException if the staff's salary is negative
     */
    public void setSalary(Double salary) {
        if (salary < 0.0) {
            throw new IllegalArgumentException("Salary cannot be negative");
        }
        this.salary = salary;
    }

    /**
     * Gets the hire date of a staff
     * @return The staff's hire date
     */
    public LocalDate getHireDate() {
        return hireDate;
    }

    /**
     * Gets the staff's end date
     * @return The staff's end date of hire
     */
    public LocalDate getEndDate() {
        return endDate;
    }

    /**
     * Sets the staff's end date
     * @param endDate The staff's end date
     */
    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    /**
     * Constructs a staff member with a given name and hire date
     * @param name The staff's full name
     * @param hireDate The staff's date of hire
     */
    public StaffMember(String name, LocalDate hireDate) {
        this.setName(name);
        this.hireDate = hireDate;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null || getClass() != obj.getClass()) {
            return false;
        }
        StaffMember other = (StaffMember) obj;
        if (!name.equals(other.name)) {
            return false;
        }
        if (Double.compare(salary, other.salary) != 0) {
            return false;
        }
        if (!hireDate.equals(other.hireDate)) {
            return false;
        }
        if (!endDate.equals(other.endDate)) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "StaffMember: " + name + ", Salary: " + salary + ", Hired on " + hireDate + ", End Date: " + endDate;
    }
}
