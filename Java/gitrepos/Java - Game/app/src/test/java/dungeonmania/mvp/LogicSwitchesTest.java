package dungeonmania.mvp;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import dungeonmania.DungeonManiaController;
import dungeonmania.response.models.DungeonResponse;
import dungeonmania.util.Direction;
import dungeonmania.util.Position;

public class LogicSwitchesTest {
    // Light Bulb Tests
    @Test
    @DisplayName("Test light bulb activated by a cardinally adjacent switch")
    public void switchToLightBulb() {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_logicSwitchesTest_switchToLightBulb",
                "c_logicSwitchesTest_switchToLightBulb");

        // move boulder onto switch by moving player right
        res = dmc.tick(Direction.RIGHT);

        // assert light bulb switched on
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_on").size());
    }

    @Test
    @DisplayName("Test light bulb activated by current from a switch propagated through wires ")
    public void wireToLightBulb() {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_logicSwitchesTest_switchToLightBulb",
                "c_logicSwitchesTest_switchToLightBulb");

        // move boulder onto switch by moving player right, causing current to go through wire
        res = dmc.tick(Direction.RIGHT);

        // assert light bulb switched on
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_on").size());
    }

    // Switch Door Tests
    @Test
    @DisplayName("Test cannot walk through a closed switch door")
    public void closedSwitchDoor() {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_logicSwitchesTest_closedSwitchDoor",
                "c_logicSwitchesTest_closedSwitchDoor");
        Position pos = TestUtils.getEntities(res, "player").get(0).getPosition();

        // try to walk through door and fail
        res = dmc.tick(Direction.RIGHT);
        assertEquals(pos, TestUtils.getEntities(res, "player").get(0).getPosition());
    }

    @Test
    @DisplayName("Test switch door activated by a cardinally adjacent switch")
    public void switchToSwitchDoor() {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_logicSwitchesTest_switchToSwitchDoor",
                "c_logicSwitchesTest_switchToSwitchDoor");

        // move boulder onto switch by moving player right
        res = dmc.tick(Direction.RIGHT);

        // move player to switch door
        res = dmc.tick(Direction.UP);
        res = dmc.tick(Direction.RIGHT);
        res = dmc.tick(Direction.RIGHT);

        // try to walk through switch door
        Position pos = TestUtils.getEntities(res, "player").get(0).getPosition();
        res = dmc.tick(Direction.DOWN);

        // assert player is able to walk through door
        assertNotEquals(pos, TestUtils.getEntities(res, "player").get(0).getPosition());
    }

    @Test
    @DisplayName("Test switch door activated by current from a switch propagated through wires")
    public void wireToSwitchDoor() {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_logicSwitchesTest_wireToSwitchDoor",
                "c_logicSwitchesTest_wireToSwitchDoor");

        // move boulder onto switch by moving player right
        res = dmc.tick(Direction.RIGHT);

        // move player to switch door
        res = dmc.tick(Direction.UP);
        res = dmc.tick(Direction.RIGHT);
        res = dmc.tick(Direction.RIGHT);
        res = dmc.tick(Direction.RIGHT);

        // try to walk through switch door
        Position pos = TestUtils.getEntities(res, "player").get(0).getPosition();
        res = dmc.tick(Direction.DOWN);

        // assert player is able to walk through door
        assertNotEquals(pos, TestUtils.getEntities(res, "player").get(0).getPosition());
    }

    // Bomb Tests
    @Test
    @DisplayName("Test Bomb activated by a cardinally adjacent switch")
    public void switchToBomb() {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_logicSwitchesTest_switchToBomb", "c_logicSwitchesTest_switchToBomb");

        // move boulder onto switch by moving player right
        res = dmc.tick(Direction.RIGHT);

        // Check Bomb exploded
        assertEquals(0, TestUtils.getEntities(res, "bomb").size());
        assertEquals(0, TestUtils.getEntities(res, "switch").size());
        assertEquals(0, TestUtils.getEntities(res, "wall").size());
        assertEquals(1, TestUtils.getEntities(res, "player").size());
    }

    @Test
    @DisplayName("Test Bomb activated by current propagated through wires")
    public void wireToBomb() {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_logicSwitchesTest_wireToBomb", "c_logicSwitchesTest_wireToBomb");

        // move boulder onto switch by moving player right
        res = dmc.tick(Direction.RIGHT);

        // Check Bomb exploded
        assertEquals(0, TestUtils.getEntities(res, "bomb").size());
        assertEquals(0, TestUtils.getEntities(res, "boulder").size());
        assertEquals(0, TestUtils.getEntities(res, "switch").size());
        assertEquals(0, TestUtils.getEntities(res, "wall").size());
        assertEquals(0, TestUtils.getEntities(res, "treasure").size());
        assertEquals(1, TestUtils.getEntities(res, "player").size());
    }

    // Or Rule Tests
    @Test
    @DisplayName("Test or entity activated by one cardinally adjacent conductor")
    public void orOneAdjacent() {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_logicSwitchesTest_orOneAdjacent", "c_logicSwitchesTest_orOneAdjacent");

        // move boulder onto switch by moving player right
        res = dmc.tick(Direction.RIGHT);

        // assert light bulb switched on
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_on").size());
    }

    @Test
    @DisplayName("Test or entity activated by two cardinally adjacent conductors")
    public void orTwoAdjacent() {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_logicSwitchesTest_orTwoAdjacent", "c_logicSwitchesTest_orTwoAdjacent");

        // move boulder onto switch by moving player right
        res = dmc.tick(Direction.RIGHT);

        // assert light bulb switched on
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_on").size());
    }

    // And Rule Tests
    @Test
    @DisplayName("Test and entity not activated by one cardinally adjacent conductor")
    public void andOneAdjacent() {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_logicSwitchesTest_andOneAdjacent", "c_logicSwitchesTest_andOneAdjacent");

        // move boulder onto switch by moving player right
        res = dmc.tick(Direction.RIGHT);

        // assert light bulb switched off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());
    }

    @Test
    @DisplayName("Test and entity only activated when both cardinally adjacent conductors are active")
    public void andTwoAdjacent() {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_logicSwitchesTest_andTwoAdjacent", "c_logicSwitchesTest_andTwoAdjacent");

        // move boulder onto switch by moving player right
        res = dmc.tick(Direction.RIGHT);

        // assert light bulb switched off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());

        // move player to next boulder
        res = dmc.tick(Direction.LEFT);
        res = dmc.tick(Direction.UP);

        // move boulder onto second switch by moving player right
        res = dmc.tick(Direction.RIGHT);

        // assert light bulb switch on
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_on").size());
    }

    @Test
    @DisplayName("Test and entity only activated when all three cardinally adjacent conductors are active")
    public void andThreeAdjacent() {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_logicSwitchesTest_andThreeAdjacent", "c_logicSwitchesTest_andTwoAdjacent");

        // move boulder onto switch by moving player right
        res = dmc.tick(Direction.RIGHT);

        // assert light bulb switched off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());

        // move player to next boulder
        res = dmc.tick(Direction.LEFT);
        res = dmc.tick(Direction.UP);

        // move boulder onto second switch by moving player right
        res = dmc.tick(Direction.RIGHT);

        // assert light bulb switch on
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_on").size());
    }

    // Xor Rule Tests
    @Test
    @DisplayName("Test xor entity activated by one cardinally adjacent conductor")
    public void xorOneAdjacent() {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_logicSwitchesTest_xorOneAdjacent", "c_logicSwitchesTest_xorOneAdjacent");

        // move boulder onto switch by moving player right
        res = dmc.tick(Direction.RIGHT);

        // assert light bulb switched on
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_on").size());
    }

    @Test
    @DisplayName("Test xor entity only activated when one of two cardinally adjacent conductors is active")
    public void xorTwoAdjacent() {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_logicSwitchesTest_xorTwoAdjacent", "c_logicSwitchesTest_xorTwoAdjacent");

        // move boulder onto switch by moving player right
        res = dmc.tick(Direction.RIGHT);

        // assert light bulb switched on
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_on").size());

        // move player to next boulder
        res = dmc.tick(Direction.LEFT);
        res = dmc.tick(Direction.UP);

        // move boulder onto second switch by moving player right
        res = dmc.tick(Direction.RIGHT);

        // assert light bulb switch off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());
    }

    // CoAnd Rule Tests
    @Test
    @DisplayName("Test and entity not activated by one cardinally adjacent conductor")
    public void coandOneAdjacent() {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_logicSwitchesTest_coandOneAdjacent",
                "c_logicSwitchesTest_coandOneAdjacent");

        // move boulder onto switch by moving player right
        res = dmc.tick(Direction.RIGHT);

        // assert light bulb switched off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());
    }

    @Test
    @DisplayName("Test coand entity activated by two adjacent conductors which become active on the same tick")
    public void coandTwoAdjacentSameTick() {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_logicSwitchesTest_coandTwoAdjacentSameTick",
                "c_logicSwitchesTest_coandTwoAdjacentSameTick");

        // move boulder onto switch by moving player right
        res = dmc.tick(Direction.RIGHT);

        // assert light bulb switched on
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_on").size());
    }

    @Test
    @DisplayName("Test coand entity not activated by two adjacent conductors which become active on different ticks")
    public void coandTwoAdjacentDifferentTicks() {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_logicSwitchesTest_coandTwoAdjacentDifferentTicks",
                "c_logicSwitchesTest_coandTwoAdjacentDifferentTicks");

        // move boulder onto switch by moving player right
        res = dmc.tick(Direction.RIGHT);

        // assert light bulb switched off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());

        // move player to next boulder
        res = dmc.tick(Direction.LEFT);
        res = dmc.tick(Direction.DOWN);

        // move boulder onto second switch by moving player right
        res = dmc.tick(Direction.RIGHT);

        // assert light bulb still off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());
    }

    @Test
    @DisplayName("Test coand entity not activated by three adjacent conductors which become active on different ticks")
    public void coandThreeAdjacentDifferentTicks() {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_logicSwitchesTest_coandThreeAdjacentDifferentTicks",
                "c_logicSwitchesTest_coandThreeAdjacentDifferentTicks");

        // move boulder onto switch by moving player right
        res = dmc.tick(Direction.RIGHT);

        // assert light bulb switched off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());

        // move player to next boulder
        res = dmc.tick(Direction.UP);

        // move boulder onto second switch by moving player right
        res = dmc.tick(Direction.RIGHT);

        // assert light bulb switch off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());

        // move player to next boulder
        res = dmc.tick(Direction.UP);

        // move boulder onto third switch by moving player right
        res = dmc.tick(Direction.RIGHT);

        // assert light bulb switch off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());
    }

    // Test switches turning on and then off
    @Test
    @DisplayName("Test light bulb deactivated after a switch turns off")
    public void switchOnAndOffOne() {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_logicSwitchesTest_switchOnAndOffOne",
                "c_logicSwitchesTest_switchOnAndOffOne");

        // move boulder onto switch by moving player right, causing current to go through wire
        res = dmc.tick(Direction.RIGHT);

        // assert light bulb switched on
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_on").size());

        // move boulder off of switch
        res = dmc.tick(Direction.UP);
        res = dmc.tick(Direction.RIGHT);
        res = dmc.tick(Direction.DOWN);

        // assert light bulb switched off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());
    }

    @Test
    @DisplayName("Test light bulb deactivates after a switch turns off")
    public void switchOnAndOffTwo() {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_logicSwitchesTest_switchOnAndOffTwo",
                "c_logicSwitchesTest_switchOnAndOffTwo");

        // move boulder onto switch by moving player right, causing current to go through wire
        res = dmc.tick(Direction.RIGHT);

        // assert light bulb switched on
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_on").size());

        // move boulder to second switch
        res = dmc.tick(Direction.LEFT);
        res = dmc.tick(Direction.DOWN);
        res = dmc.tick(Direction.DOWN);
        res = dmc.tick(Direction.RIGHT);

        // assert light bulb still switched on
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_on").size());

        // move boulder off second switch
        res = dmc.tick(Direction.DOWN);
        res = dmc.tick(Direction.RIGHT);
        res = dmc.tick(Direction.UP);

        // assert light bulb still switched on
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_on").size());

        // move boulder off first switch
        res = dmc.tick(Direction.LEFT);
        res = dmc.tick(Direction.UP);
        res = dmc.tick(Direction.RIGHT);
        res = dmc.tick(Direction.UP);

        // assert light bulb switched off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());
    }

    @Test
    @DisplayName("Test behaviour of co_and with switchs turning on and off")
    public void switchOnAndOffThree() {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_logicSwitchesTest_switchOnAndOffThree",
                "c_logicSwitchesTest_switchOnAndOffThree");

        // move boulder onto switch by moving player right, causing current to go through wire
        res = dmc.tick(Direction.RIGHT);

        // assert light bulb switched off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());

        // move boulder to second switch
        res = dmc.tick(Direction.LEFT);
        res = dmc.tick(Direction.DOWN);
        res = dmc.tick(Direction.DOWN);
        res = dmc.tick(Direction.DOWN);
        res = dmc.tick(Direction.DOWN);
        res = dmc.tick(Direction.RIGHT);

        // assert light bulb still switched off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());

        // move boulder off second switch
        res = dmc.tick(Direction.RIGHT);

        // assert light bulb still switched off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());

        // move boulder off first switch
        res = dmc.tick(Direction.LEFT);
        res = dmc.tick(Direction.LEFT);
        res = dmc.tick(Direction.UP);
        res = dmc.tick(Direction.UP);
        res = dmc.tick(Direction.UP);
        res = dmc.tick(Direction.UP);
        res = dmc.tick(Direction.RIGHT);
        res = dmc.tick(Direction.RIGHT);

        // assert light bulb switched off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());

        // move boulder on third switch
        res = dmc.tick(Direction.LEFT);
        res = dmc.tick(Direction.LEFT);
        res = dmc.tick(Direction.DOWN);
        res = dmc.tick(Direction.DOWN);
        res = dmc.tick(Direction.RIGHT);

        // assert light bulb switched on
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_on").size());
    }
}
