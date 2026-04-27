package random;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class GameTest {
    @Test
    public void test1() {
        Game game = new Game(4);
        boolean[] solutions = {
                true, true, false, true, true, false, false, false
        };
        for (boolean solution : solutions) {
            assertEquals(solution, game.battle());
        }

        Game game2 = new Game(-4);
        boolean[] solutions2 = {
                false, false, true, false, false, true, false, false
        };
        for (boolean solution : solutions2) {
            assertEquals(solution, game2.battle());
        }
    }
}
