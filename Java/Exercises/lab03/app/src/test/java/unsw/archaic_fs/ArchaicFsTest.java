package unsw.archaic_fs;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import unsw.archaic_fs.exceptions.UNSWFileAlreadyExistsException;
import unsw.archaic_fs.exceptions.UNSWFileNotFoundException;
import unsw.archaic_fs.exceptions.UNSWNoSuchFileException;

import java.io.IOException;
import java.util.EnumSet;

public class ArchaicFsTest {
    @Test
    public void testInvalidInode() {
        ArchaicFileSystem fs = new ArchaicFileSystem();
        assertEquals(fs.lookupInode(2), null);
        assertEquals(fs.lookupInode(-1), null);
    }

    @Test
    public void testCdInvalidDirectory() {
        ArchaicFileSystem fs = new ArchaicFileSystem();

        // Try to change directory to an invalid one
        assertThrows(UNSWNoSuchFileException.class, () -> {
            fs.cd("/usr/bin/cool-stuff");
        });
    }

    @Test
    public void testCdValidDirectory() {
        ArchaicFileSystem fs = new ArchaicFileSystem();

        assertDoesNotThrow(() -> {
            fs.mkdir("/usr/bin/cool-stuff", true, false);
            fs.cd("/usr/bin/cool-stuff");
        });
    }

    @Test
    public void testCdAroundPaths() {
        ArchaicFileSystem fs = new ArchaicFileSystem();

        assertDoesNotThrow(() -> {
            fs.mkdir("/usr/bin/cool-stuff", true, false);
            fs.cd("/usr/bin/cool-stuff");
            assertEquals("/usr/bin/cool-stuff", fs.cwd());
            fs.cd("..");
            assertEquals("/usr/bin", fs.cwd());
            fs.cd("../bin/..");
            assertEquals("/usr", fs.cwd());
        });
    }

    @Test
    public void testCreateFile() {
        ArchaicFileSystem fs = new ArchaicFileSystem();

        assertDoesNotThrow(() -> {
            fs.writeToFile("test.txt", "My Content", EnumSet.of(FileWriteOptions.CREATE, FileWriteOptions.TRUNCATE));
            assertEquals("My Content", fs.readFromFile("test.txt"));
            fs.writeToFile("test.txt", "New Content", EnumSet.of(FileWriteOptions.TRUNCATE));
            assertEquals("New Content", fs.readFromFile("test.txt"));
        });
    }

    @Test
    void testCdIntoFile() {
        ArchaicFileSystem fs = new ArchaicFileSystem();
        assertDoesNotThrow(() -> {
            fs.writeToFile("test.txt", "My Content", EnumSet.of(FileWriteOptions.CREATE, FileWriteOptions.APPEND));
        });
        assertThrows(IOException.class, () -> {
            fs.cd("test.txt");
        });
    }

    @Test
    public void testFileAlreadyExists() {
        ArchaicFileSystem fs = new ArchaicFileSystem();

        assertDoesNotThrow(() -> {
            fs.mkdir("/usr/bin/cool-stuff", true, false);
        });
        assertThrows(UNSWFileAlreadyExistsException.class, () -> {
            fs.mkdir("/usr/bin/cool-stuff", true, false);
        });
    }

    @Test
    public void testReadFromFileNotFound() {
        ArchaicFileSystem fs = new ArchaicFileSystem();

        assertThrows(UNSWFileNotFoundException.class, () -> {
            fs.readFromFile("/usr/bin/cool-stuff");
        });
    }

    @Test
    public void testCdRoot() {
        ArchaicFileSystem fs = new ArchaicFileSystem();

        assertDoesNotThrow(() -> {
            fs.cd("");
        });
        assertEquals(fs.cwd(), "");
    }

    @Test
    public void testInvalidWriteOptions() {
        ArchaicFileSystem fs = new ArchaicFileSystem();

        assertThrows(IllegalArgumentException.class, () -> {
            fs.writeToFile("test.txt", "My Content", EnumSet.of(FileWriteOptions.APPEND, FileWriteOptions.TRUNCATE));
        });
        assertThrows(IllegalArgumentException.class, () -> {
            fs.writeToFile("test.txt", "My Content", EnumSet.of(FileWriteOptions.CREATE));
        });
    }

    @Test
    public void testCreateFileAlreadyExists() {
        ArchaicFileSystem fs = new ArchaicFileSystem();
        assertDoesNotThrow(() -> {
            fs.writeToFile("test.txt", "My Content",
                    EnumSet.of(FileWriteOptions.CREATE_IF_NOT_EXISTS, FileWriteOptions.APPEND));
        });
        assertThrows(UNSWFileAlreadyExistsException.class, () -> {
            fs.writeToFile("test.txt", "My Content", EnumSet.of(FileWriteOptions.APPEND, FileWriteOptions.CREATE));
        });
        assertDoesNotThrow(() -> {
            fs.writeToFile("test.txt", "My Content",
                    EnumSet.of(FileWriteOptions.CREATE_IF_NOT_EXISTS, FileWriteOptions.APPEND));
        });
    }

    @Test
    public void testWriteFileDoesNotExist() {
        ArchaicFileSystem fs = new ArchaicFileSystem();
        assertThrows(UNSWFileNotFoundException.class, () -> {
            fs.writeToFile("test.txt", "My Content", EnumSet.of(FileWriteOptions.APPEND));
        });
    }

    // Now write some more!
    // Some ideas to spark inspiration;
    // - File Writing/Reading with various options (appending for example)
    // - Cd'ing .. on the root most directory (shouldn't error should just remain on
    // root directory)
    // - many others...
}
