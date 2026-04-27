package blackout.ComponentTests;

import org.junit.jupiter.api.Test;

import unsw.blackout.File;
import unsw.blackout.Satellite.StandardSatellite;
import unsw.response.models.FileInfoResponse;
import unsw.utils.Angle;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class FileTest {
    @Test
    public void testFileCreation() {
        String[][] testFiles = {
                {
                        "Test", "The quick brown fox jumped over the lazy dog"
                }, {
                        "MyFile", "How are you? I'm ok."
                }, {
                        "temp", ""
                }
        };
        for (String[] fileData : testFiles) {
            String fileName = fileData[0];
            String fileContent = fileData[1];
            assertDoesNotThrow(() -> {
                File myFile = new File(fileName, fileContent);
                myFile.fileComplete();
                assertInstanceOf(File.class, myFile);
                assertEquals(myFile.getfileName(), fileName);
                assertEquals(myFile.getFileContent(), fileContent);
            });
        }
    }

    @Test
    public void testNullChecking() {
        assertThrows(IllegalArgumentException.class, () -> {
            new File(null, null);
        });
        assertThrows(IllegalArgumentException.class, () -> {
            new File("hi", null);
        });
        assertThrows(IllegalArgumentException.class, () -> {
            new File(null, "Hello");
        });
    }

    @Test
    public void testEmptyName() {
        assertThrows(IllegalArgumentException.class, () -> {
            new File("", "");
        });
    }

    @Test
    public void testGetSize() {
        File file = new File("new", "");
        assertEquals(0, file.getSize());
        File file2 = new File("new", "null");
        assertEquals(4, file2.getSize());
    }

    @Test
    public void testIsComplete() {
        File file = new File("new", "1");
        assertEquals(false, file.isFileComplete());
        file.fileComplete();
        assertEquals(true, file.isFileComplete());
    }

    @Test
    public void testGetResponse() {
        String filename = "Hello World";
        String content = "My first file!";
        File newFile = new File(filename, content);
        // newFile.fileComplete();
        FileInfoResponse expected = new FileInfoResponse(filename, "", content.length(), false);
        assertEquals(expected, newFile.getResponse());
        assertEquals(false, newFile.isFileComplete());
    }

    @Test
    public void testNotUploading() {
        StandardSatellite satellite = new StandardSatellite("he", 0, new Angle());
        File file = new File("null", "h");
        file.setSender(satellite);
        assertTrue(satellite.canUpload());
        satellite.setIsUploading(true);
        assertTrue(!satellite.canUpload());
        file.notUploading();
        assertTrue(satellite.canUpload());
    }
}
