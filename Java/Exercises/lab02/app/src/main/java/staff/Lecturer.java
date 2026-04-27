package staff;

import java.time.LocalDate;

public class Lecturer extends StaffMember {
    private String school;
    private Character academicLevel;

    public Lecturer(String name, LocalDate hireDate) {
        super(name, hireDate);
    }

    /**
     * Returns the lecturer's school
     * @return The lecturer's school
     */
    public String getSchool() {
        return school;
    }

    /**
     * Sets the lecturer's school
     * @param school The lecturer's new school
     * @throws IllegalArgumentException if the school is empty
     */
    public void setSchool(String school) {
        if (school.length() == 0) {
            throw new IllegalArgumentException("School cannot be empty");
        }
        this.school = school;
    }

    /**
     * Gets the academic level of the lecturer
     * @return The lecturer's academic level
     */
    public Character getAcademicLevel() {
        return academicLevel;
    }

    /**
    * Sets the academic level of the lecturer
    * @param academicLevel The academic level of the lecturer
    * @throws IllegalArgumentException if academic level is not 'A', 'B' or 'C'
    */
    public void setAcademicLevel(Character academicLevel) {
        if (academicLevel != 'A' && academicLevel != 'B' && academicLevel != 'C') {
            throw new IllegalArgumentException("Invalid academic status");
        }
        this.academicLevel = academicLevel;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (!super.equals(obj))
            return false;
        if (getClass() != obj.getClass())
            return false;
        Lecturer other = (Lecturer) obj;
        if (!school.equals(other.school))
            return false;
        if (!academicLevel.equals(other.academicLevel))
            return false;
        return true;
    }

    @Override
    public String toString() {
        return super.toString() + ", School: " + school + ", Academic Level: " + academicLevel;
    }

}
