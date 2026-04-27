package unsw.enrolment;

import java.io.IOException;

import unsw.enrolment.exceptions.InvalidEnrolmentException;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;

import org.junit.jupiter.api.Test;

public class EnrolmentTest {
    private List<Student> parseStudentsCSV(String path) {
        String fileContents;

        try {
            fileContents = new String(EnrolmentTest.class.getResourceAsStream(path).readAllBytes());
        } catch (IOException e) {
            return null;
        }

        CSVParser csvParser = null;

        try {
            csvParser = CSVParser.parse(fileContents, CSVFormat.RFC4180);
        } catch (IOException e) {
            return null;
        }

        List<Student> students = new ArrayList<Student>();

        csvParser.forEach(record -> {
            if (record.getRecordNumber() == 1)
                return;
            students.add(new Student(record.get(0), record.get(1), Integer.parseInt(record.get(2)),
                    record.get(3).split(" ")));
        });

        return students;
    }

    @Test
    public void testIntegration() {
        // Create courses
        Course cs1511 = new Course("COMP1511", "Programming Fundamentals");
        Course cs1531 = new Course("COMP1531", "Software Engineering Fundamentals");
        cs1531.addPrereq(cs1511);
        Course cs2521 = new Course("COMP2521", "Data Structures and Algorithms");
        cs2521.addPrereq(cs1511);

        CourseOffering cs1511Offering = new CourseOffering(cs1511, "19T1");
        CourseOffering cs1531Offering = new CourseOffering(cs1531, "19T1");
        CourseOffering cs2521Offering = new CourseOffering(cs2521, "19T2");

        // Create a student
        Student student1 = new Student("z5555555", "Jon Snow", 3707, new String[] {
                "SENGAH"
        });

        // Enrol the student in COMP1511 for T1 (this should succeed)
        assertDoesNotThrow(() -> {
            cs1511Offering.addEnrolment(student1);
        });
        assertTrue(student1.isEnrolled(cs1511Offering));

        // Enrol the student in COMP1531 for T1 (this should fail as they
        // have not met the prereq)
        assertThrows(InvalidEnrolmentException.class, () -> {
            cs1531Offering.addEnrolment(student1);
        });

        // Give the student a passing grade for COMP1511
        Grade student1comp1511grade = new Grade(cs1511Offering, 98, "HD");
        student1.setGrade(student1comp1511grade);

        // Enrol the student in 2521 & 1531 (this should succeed as they have met
        // the prereqs)
        assertDoesNotThrow(() -> {
            cs2521Offering.addEnrolment(student1);
            cs1531Offering.addEnrolment(student1);
        });

        assertTrue(student1.isEnrolled(cs2521Offering));
        assertTrue(student1.isEnrolled(cs1531Offering));
    }

    @Test
    void testStreamNum() {
        String[] streams = {
                "Hello", "COMP1A"
        };
        String[] streams2 = {
                "Hello", "COMP1A", "yolo"
        };

        Student student = new Student("z5555555", "null", 3708, streams);
        Student student2 = new Student("z5555555", "null", 3708, streams2);
        assertEquals(2, student.getStreamNum());
        assertEquals(3, student2.getStreamNum());

    }

    @Test
    public void testComparator() {
        List<Student> students = parseStudentsCSV("/smallStudent.csv");
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
        // students.stream().sorted(Comparator.comparingInt(Student::getProgram).thenComparingInt(Student::getStreamNum)
        //         .thenComparing(Student::getName).thenComparing(Student::getZid));

        List<Student> sortedStudents = students.stream().sorted(Comparator.comparingInt(Student::getProgram)
                .thenComparingInt(Student::getStreamNum).thenComparing(Student::getName).thenComparing(Student::getZid))
                .collect(Collectors.toList());
        List<String> actual = sortedStudents.stream().map(Student::getZid).collect(Collectors.toList());
        List<String> expected = parseStudentsCSV("/solution.csv").stream().map(Student::getZid)
                .collect(Collectors.toList());
        assertEquals(expected, actual);

        // Replace this with your failing unit test
        // assertTrue(false);
    }

    @Test
    public void testStudentsEnrolledInCourse() {
        List<Student> students = parseStudentsCSV("/smallStudent.csv");
        Course cs1511 = new Course("COMP1511", "Programming Fundamentals");
        CourseOffering cs1511Offering = new CourseOffering(cs1511, "19T1");
        for (Student student : students) {
            try {
                cs1511Offering.addEnrolment(student);
            } catch (Exception InvalidEnrolmentException) {
                return;
            }
        }
        List<String> actual = cs1511Offering.studentsEnrolledInCourse().stream().map(Student::getZid)
                .collect(Collectors.toList());
        List<String> expected = parseStudentsCSV("/solution.csv").stream().map(Student::getZid)
                .collect(Collectors.toList());
        assertEquals(expected, actual);
    }
}
