package staff;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalDate;

public class StaffTest {
    public static void printStaffDetails(StaffMember staff) {
        System.out.println(staff.toString());
    }

    public static StaffMember cloneStaffMember(StaffMember staff) {
        StaffMember clone = new StaffMember(staff.getName(), staff.getHireDate());
        clone.setEndDate(staff.getEndDate());
        clone.setSalary(staff.getSalary());
        return clone;
    }

    public static Lecturer cloneLecturer(Lecturer lecturer) {
        Lecturer clone = new Lecturer(lecturer.getName(), lecturer.getHireDate());
        clone.setEndDate(lecturer.getEndDate());
        clone.setSalary(lecturer.getSalary());
        clone.setAcademicLevel(lecturer.getAcademicLevel());
        clone.setSchool(lecturer.getSchool());
        return clone;
    }

    public static void testReflexive(Object obj) {
        assertEquals(obj.equals(obj), true);
    }

    public static void testNull(Object obj) {
        assertEquals(obj.equals(null), false);
    }

    public static void testSymmetric(Object a, Object b) {
        assertEquals(a.equals(b), true);
        assertEquals(b.equals(a), true);
    }

    public static void testTransitive(Object a, Object b, Object c) {
        assertEquals(a.equals(b), true);
        assertEquals(b.equals(c), true);
        assertEquals(a.equals(c), true);
    }

    public static void testFalse(Object a, Object b) {
        assertEquals(a.equals(b), false);
    }

    public static void main(String[] args) {
        StaffMember staffA = new StaffMember("Joshua", LocalDate.of(2022, 12, 15));
        staffA.setSalary(100.0);
        staffA.setEndDate(LocalDate.of(2027, 2, 28));

        Lecturer lecturerA = new Lecturer("John", LocalDate.of(2022, 12, 15));
        lecturerA.setSalary(150.0);
        lecturerA.setAcademicLevel('B');
        lecturerA.setSchool("CSE");
        lecturerA.setEndDate(LocalDate.of(2028, 1, 1));
        printStaffDetails(staffA);
        printStaffDetails(lecturerA);

        StaffMember staffB = StaffTest.cloneStaffMember(staffA);
        StaffMember staffC = StaffTest.cloneStaffMember(staffA);

        StaffMember staffD = StaffTest.cloneStaffMember(staffA);
        staffD.setName("Josh");

        StaffMember staffE = new StaffMember("Joshua", LocalDate.of(2021, 12, 15));
        staffE.setSalary(100.0);
        staffE.setEndDate(LocalDate.of(2027, 2, 28));

        StaffMember staffF = StaffTest.cloneStaffMember(staffA);
        staffF.setSalary(100.1);

        StaffMember staffG = StaffTest.cloneStaffMember(staffA);
        staffG.setEndDate(LocalDate.of(2027, 3, 28));

        StaffTest.testNull(staffA);
        StaffTest.testReflexive(staffA);
        StaffTest.testSymmetric(staffA, staffB);
        StaffTest.testTransitive(staffA, staffB, staffC);
        StaffTest.testFalse(staffA, staffD);
        StaffTest.testFalse(staffA, staffE);
        StaffTest.testFalse(staffA, staffF);
        StaffTest.testFalse(staffA, staffG);

        Lecturer lecturerB = StaffTest.cloneLecturer(lecturerA);
        Lecturer lecturerC = StaffTest.cloneLecturer(lecturerA);
        Lecturer lecturerD = StaffTest.cloneLecturer(lecturerA);
        Lecturer lecturerE = StaffTest.cloneLecturer(lecturerA);
        lecturerD.setSchool("Engineering");
        lecturerE.setAcademicLevel('A');

        assertEquals(lecturerA.equals(lecturerA), true);

        StaffTest.testNull(lecturerA);
        StaffTest.testReflexive(lecturerA);
        StaffTest.testSymmetric(lecturerA, lecturerB);
        StaffTest.testTransitive(lecturerA, lecturerB, lecturerC);
        StaffTest.testFalse(lecturerA, lecturerD);
        StaffTest.testFalse(lecturerA, lecturerE);
    }
}
