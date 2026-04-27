package unsw.enrolment;

import java.util.ArrayList;
import java.util.List;

public class Student {
    private String zid;
    private ArrayList<Enrolment> enrolments = new ArrayList<Enrolment>();
    private String name;
    private int program;
    private String[] streams;

    public Student(String zid, String name, int program, String[] streams) {
        this.zid = zid;
        this.name = name;
        this.program = program;
        this.streams = streams;
    }

    public String getZid() {
        return zid;
    }

    public String getName() {
        return name;
    }

    public int getProgram() {
        return program;
    }

    public int getStreamNum() {
        return streams.length;
    }

    public boolean isEnrolled(CourseOffering offering) {
        return enrolments.stream().filter(e -> e.isCorrectOffering(offering)).findAny().orElse(null) != null;
    }

    public void setGrade(Grade grade) {
        Enrolment enrolment = enrolments.stream().filter(e -> e.isCorrectGrade(grade)).findAny().orElse(null);
        if (enrolment == null) {
            return;
        }
        enrolment.setGrade(grade);
    }

    public void addEnrolment(Enrolment enrolment) {
        enrolments.add(enrolment);
    }

    public List<Enrolment> getEnrolments() {
        return enrolments;
    }

    public boolean hasPassedCourse(Course course) {
        Enrolment enrolment = enrolments.stream().filter(e -> e.isCorrectCourse(course)).findAny().orElse(null);
        if (enrolment == null) {
            return false;
        }
        return enrolment.hasPassed();
    }
}
