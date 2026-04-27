package dungeonmania.mvp;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import dungeonmania.DungeonManiaController;
import dungeonmania.exceptions.InvalidActionException;
import dungeonmania.response.models.DungeonResponse;
import dungeonmania.util.Direction;
import dungeonmania.util.Position;

public class SunStoneTest {
    @Test
    @Tag("16-1")
    @DisplayName("Test sun stone counts towards treasure goal")
    public void treasure() {
        DungeonManiaController dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_SunStoneTest_treasure", "c_SunStoneTest_treasure");
        assertTrue(TestUtils.getGoals(res).contains(":treasure"));

        assertEquals(0, TestUtils.getInventory(res, "sun_stone").size());
        assertEquals(1, TestUtils.getEntities(res, "sun_stone").size());

        // Pick up sun stone
        res = dmc.tick(Direction.RIGHT);
        assertEquals(1, TestUtils.getInventory(res, "sun_stone").size());
        assertEquals(0, TestUtils.getEntities(res, "sun_stone").size());

        // assert goal met
        assertEquals("", TestUtils.getGoals(res));

    }

    @Test
    @Tag("16-2")
    @DisplayName("Test sun stone acts as key but is not used")
    public void key() {
        DungeonManiaController dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_SunStoneTest_key", "c_SunStoneTest_key");

        assertEquals(0, TestUtils.getInventory(res, "sun_stone").size());

        // Pick up sun stone
        res = dmc.tick(Direction.RIGHT);
        assertEquals(1, TestUtils.getInventory(res, "sun_stone").size());
        Position pos = TestUtils.getEntities(res, "player").get(0).getPosition();

        // Walk through the door
        res = dmc.tick(Direction.RIGHT);
        assertNotEquals(pos, TestUtils.getEntities(res, "player").get(0).getPosition());
        assertEquals(1, TestUtils.getInventory(res, "sun_stone").size());

    }

    @Test
    @Tag("16-3")
    @DisplayName("Test sun stone cannot be used to bribe")
    public void bribe() {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_SunStoneTest_bribe", "c_SunStoneTest_bribe");
        String mercId = TestUtils.getEntitiesStream(res, "mercenary").findFirst().get().getId();

        // pick up sun_stone
        res = dmc.tick(Direction.RIGHT);
        assertEquals(1, TestUtils.getInventory(res, "sun_stone").size());

        // assert mercenary is next to player
        assertEquals(TestUtils.getEntities(res, "player").get(0).getPosition(), new Position(2, 1));
        assertEquals(TestUtils.getEntities(res, "mercenary").get(0).getPosition(), new Position(3, 1));

        assertThrows(InvalidActionException.class, () -> dmc.interact(mercId));
    }
}
