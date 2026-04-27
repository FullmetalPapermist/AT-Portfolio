package unsw.enrolment;

public class Enrolment {
    private CourseOffering offering;
    private Grade grade;
    private Student student;

    public Enrolment(CourseOffering offering, Student student) {
        this.offering = offering;
        this.student = student;
    }

    public Student getStudent() {
        return student;
    }

    public CourseOffering getOffering() {
        return offering;
    }

    public boolean hasPassedCourse() {
        if (grade == null) {
            return false;
        }

        return grade.hasPassed();
    }

    public Course getCourse() {
        return offering.getCourse();
    }

    public String getTerm() {
        return offering.getTerm();
    }

    public Grade getGrade() {
        return grade;
    }

    public void setGrade(Grade grade) {
        this.grade = grade;
    }

    public boolean isCorrectGrade(Grade grade) {
        return offering.equals(grade.getOffering());
    }

    public boolean isCorrectOffering(CourseOffering offering) {
        return this.offering.equals(offering);
    }

    public boolean isCorrectCourse(Course course) {
        return course.equals(this.getCourse());
    }

    public boolean hasPassed() {
        if (grade == null) {
            return false;
        }
        return grade.hasPassed();
    }
}
