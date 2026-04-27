package dungeonmania.mvp;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import dungeonmania.DungeonManiaController;
import dungeonmania.response.models.DungeonResponse;
import dungeonmania.util.Direction;

public class DryrunTest {
    @Test
    @Tag("0-1")
    @DisplayName("Dryrun for enemy goal")
    public void dryrunEnemyGoal() {
        DungeonManiaController dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_dryrun_enemyGoal", "c_dryrun_enemyGoal");
        assertTrue(TestUtils.getGoals(res).contains(":enemies"));
    }

    @Test
    @Tag("0-5")
    @DisplayName("Dryrun for sunstone and more buildables")
    public void dryrunSunstoneAndBuildables() {
        DungeonManiaController dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_dryrun_sunstoneAndBuildables", "c_dryrun_sunstoneAndBuildables");
        assertTrue(TestUtils.countType(res, "sun_stone") == 2);
        res = dmc.tick(Direction.RIGHT);
        res = dmc.tick(Direction.RIGHT);
        res = dmc.tick(Direction.RIGHT);
        res = dmc.tick(Direction.RIGHT);
        res = dmc.tick(Direction.RIGHT);

        res = assertDoesNotThrow(() -> dmc.build("sceptre"));
        assertEquals(1, TestUtils.getInventory(res, "sceptre").size());
        res = assertDoesNotThrow(() -> dmc.build("midnight_armour"));
        assertEquals(1, TestUtils.getInventory(res, "midnight_armour").size());

    }

    @Test
    @Tag("0-7")
    @DisplayName("Dryrun for logic switches")
    public void dryrunLogic() {
        DungeonManiaController dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_dryrun_logic", "c_dryrun_logic");
        assertTrue(TestUtils.countType(res, "switch_door") == 1);
        assertTrue(TestUtils.countType(res, "bomb") == 1);
        assertTrue(TestUtils.countType(res, "wire") == 1);
        assertTrue(TestUtils.countType(res, "light_bulb_off") >= 1);
        res = dmc.tick(Direction.RIGHT);
        assertTrue(TestUtils.countType(res, "light_bulb_on") == 1);
    }
}
