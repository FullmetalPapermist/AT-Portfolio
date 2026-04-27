package dungeonmania.entities.inventory;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import dungeonmania.Game;
import dungeonmania.entities.BattleItem;
import dungeonmania.entities.DurableItem;
import dungeonmania.entities.Entity;
import dungeonmania.entities.EntityFactory;
import dungeonmania.entities.buildables.Bow;
import dungeonmania.entities.buildables.Sceptre;
import dungeonmania.entities.collectables.Arrow;
import dungeonmania.entities.collectables.Key;
import dungeonmania.entities.collectables.SunStone;
import dungeonmania.entities.collectables.Sword;
import dungeonmania.entities.collectables.Treasure;
import dungeonmania.entities.collectables.Wood;
import dungeonmania.entities.enemies.ZombieToast;
import dungeonmania.map.GameMap;

public class Inventory {
    private List<InventoryItem> items = new ArrayList<>();

    private GameMap map;

    private static final int WOOD_FOR_BOW = 1;
    private static final int ARROWS_FOR_BOW = 3;
    private static final int WOOD_FOR_SHIELD = 2;
    private static final int KEY_FOR_SHIELD = 1;
    private static final int TREASURE_FOR_SHIELD = 1;
    private static final int WOOD_FOR_SCEPTRE = 1;
    private static final int ARROWS_FOR_SCEPTRE = 2;
    private static final int KEY_FOR_SCEPTRE = 1;
    private static final int TREASURE_FOR_SCEPTRE = 1;
    private static final int SUN_STONE_FOR_SCEPTRE = 1;
    private static final int SUN_STONE_FOR_MIDNIGHT_ARMOUR = 1;
    private static final int SWORD_FOR_MIDNIGHT_ARMOUR = 1;

    public boolean add(InventoryItem item) {
        if (item == null)
            return false;
        items.add(item);
        return true;
    }

    public void remove(InventoryItem item) {
        items.remove(item);
    }

    public List<String> getBuildables() {

        int wood = count(Wood.class);
        int arrows = count(Arrow.class);
        int treasure = count(Treasure.class);
        int keys = count(Key.class);
        int sunStones = count(SunStone.class);
        int swords = count(Sword.class);
        List<String> result = new ArrayList<>();

        if (wood >= WOOD_FOR_BOW && arrows >= ARROWS_FOR_BOW) {
            result.add("bow");
        }
        if (wood >= WOOD_FOR_SHIELD
                && (treasure >= TREASURE_FOR_SHIELD || keys >= KEY_FOR_SHIELD || sunStones >= TREASURE_FOR_SHIELD)) {
            result.add("shield");
        }
        if ((wood >= WOOD_FOR_SCEPTRE || arrows >= ARROWS_FOR_SCEPTRE)
                && (treasure >= TREASURE_FOR_SCEPTRE || keys >= KEY_FOR_SCEPTRE
                        || sunStones >= SUN_STONE_FOR_SCEPTRE + TREASURE_FOR_SCEPTRE)
                && (sunStones >= SUN_STONE_FOR_SCEPTRE)) {
            result.add("sceptre");
        }
        if (swords >= SWORD_FOR_MIDNIGHT_ARMOUR && sunStones >= SUN_STONE_FOR_MIDNIGHT_ARMOUR
                && map.getEntities(ZombieToast.class).size() == 0)
            result.add("midnight_armour");
        return result;
    }

    public boolean build(String entity, EntityFactory factory) {
        List<Wood> wood = getEntities(Wood.class);
        List<Treasure> treasure = getEntities(Treasure.class);
        List<Key> keys = getEntities(Key.class);
        List<Arrow> arrows = getEntities(Arrow.class);
        List<SunStone> sunStones = getEntities(SunStone.class);
        List<Sword> swords = getEntities(Sword.class);

        if (entity.equals("bow"))
            return add(buildBow(factory, wood, arrows));
        if (entity.equals("shield"))
            return add(buildShield(factory, wood, treasure, keys));
        if (entity.equals("sceptre"))
            return add(buildSceptre(factory, wood, arrows, treasure, keys, sunStones));
        if (entity.equals("midnight_armour"))
            return add(buildMidnightArmour(factory, swords, sunStones));
        return false;
    }

    public InventoryItem buildShield(EntityFactory factory, List<Wood> wood, List<Treasure> treasure, List<Key> keys) {
        for (int i = 0; i < WOOD_FOR_SHIELD; i++)
            items.remove(wood.get(i));

        if (treasure.size() >= TREASURE_FOR_SHIELD) {
            items.remove(treasure.get(0));
        } else if (keys.size() >= KEY_FOR_SHIELD) {
            items.remove(keys.get(0));
        }

        return factory.buildShield();
    }

    public InventoryItem buildBow(EntityFactory factory, List<Wood> wood, List<Arrow> arrows) {
        items.remove(wood.get(0));
        for (int i = 0; i < ARROWS_FOR_BOW; i++)
            items.remove(arrows.get(i));

        return factory.buildBow();
    }

    public InventoryItem buildSceptre(EntityFactory factory, List<Wood> wood, List<Arrow> arrows,
            List<Treasure> treasure, List<Key> keys, List<SunStone> sunStones) {
        if (wood.size() >= WOOD_FOR_SCEPTRE) {
            items.remove(wood.get(0));
        } else {
            for (int i = 0; i < ARROWS_FOR_SCEPTRE; i++)
                items.remove(arrows.get(i));
        }

        if (treasure.size() >= TREASURE_FOR_SCEPTRE) {
            items.remove(treasure.get(0));
        } else if (keys.size() >= KEY_FOR_SCEPTRE) {
            items.remove(keys.get(0));
        } else {
            items.remove(sunStones.get(0));
        }

        items.remove(sunStones.get(0));

        return factory.buildSceptre();
    }

    public InventoryItem buildMidnightArmour(EntityFactory factory, List<Sword> swords, List<SunStone> sunStones) {
        items.remove(sunStones.get(0));
        items.remove(swords.get(0));

        return factory.buildMidnightArmour();
    }

    public <T extends InventoryItem> T getFirst(Class<T> itemType) {
        for (InventoryItem item : items)
            if (itemType.isInstance(item))
                return itemType.cast(item);
        return null;
    }

    public <T extends InventoryItem> int count(Class<T> itemType) {
        int count = 0;
        for (InventoryItem item : items)
            if (itemType.isInstance(item))
                count++;
        return count;
    }

    public Entity getEntity(String itemUsedId) {
        for (InventoryItem item : items)
            if (((Entity) item).getId().equals(itemUsedId))
                return (Entity) item;
        return null;
    }

    public List<Entity> getEntities() {
        return items.stream().map(Entity.class::cast).collect(Collectors.toList());
    }

    public <T> List<T> getEntities(Class<T> clz) {
        return items.stream().filter(clz::isInstance).map(clz::cast).collect(Collectors.toList());
    }

    public boolean hasWeapon() {
        return getFirst(Sword.class) != null || getFirst(Bow.class) != null;
    }

    public BattleItem getWeapon() {
        BattleItem weapon = getFirst(Sword.class);
        if (weapon == null)
            return getFirst(Bow.class);
        return weapon;
    }

    public void useWeapon(Game g) {
        ((DurableItem) getWeapon()).use(g);
    }

    public void setMap(GameMap map) {
        this.map = map;
    }

    public int getMindControlledDuration() {
        return getFirst(Sceptre.class).getMindControlledDuration();
    }

}
