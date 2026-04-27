package unsw.enrolment;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import unsw.enrolment.exceptions.InvalidEnrolmentException;

public class CourseOffering {
    private Course course;
    private String term;
    private List<Enrolment> enrolments = new ArrayList<Enrolment>();

    public CourseOffering(Course course, String term) {
        this.course = course;
        this.term = term;
        this.course.addOffering(this);
    }

    public Course getCourse() {
        return course;
    }

    public String getCourseCode() {
        return course.getCourseCode();
    }

    public List<Course> getCoursePrereqs() {
        return course.getPrereqs();
    }

    public String getTerm() {
        return term;
    }

    public Enrolment addEnrolment(Student student) throws InvalidEnrolmentException {
        if (course.checkValidEnrolment(student)) {
            Enrolment enrolment = new Enrolment(this, student);
            enrolments.add(enrolment);
            student.addEnrolment(enrolment);
            return enrolment;
        } else {
            throw new InvalidEnrolmentException("student has not satisfied the prerequisites");
        }
    }

    public List<Student> studentsEnrolledInCourse() {
        List<Student> students = enrolments.stream().map(Enrolment::getStudent).collect(Collectors.toList());
        // Comparator<Student> comparator = new Comparator<Student>() {
        //     private int gt(int i1, int i2) {
        //         if (i1 > i2) {
        //             return 1;
        //         }
        //         return -1;
        //     }

        //     public int compare(Student s1, Student s2) {
        //         int i1 = 0;
        //         int i2 = 0;
        //         if (s1.getProgram() != s2.getProgram()) {
        //             i1 = s1.getProgram();
        //             i2 = s2.getProgram();
        //         } else if (s1.getStreamNum() != s2.getStreamNum()) {
        //             i1 = s1.getStreamNum();
        //             i2 = s2.getStreamNum();
        //         } else if (!s1.getName().equals(s2.getName())) {
        //             return s1.getName().compareTo(s2.getName());
        //         } else {
        //             return s1.getZid().compareTo(s2.getZid());
        //         }
        //         return gt(i1, i2);
        //     }
        // };
        // students.sort(comparator);
        return students.stream().sorted(Comparator.comparingInt(Student::getProgram)
                .thenComparingInt(Student::getStreamNum).thenComparing(Student::getName).thenComparing(Student::getZid))
                .collect(Collectors.toList());
    }

}
