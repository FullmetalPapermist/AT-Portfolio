# Assignment II Pair Blog Template

## Task 1) Code Analysis and Refactoring ⛏️

### a) From DRY to Design Patterns

[Links to your merge requests](/put/links/here)
https://nw-syd-gitlab.cseunsw.tech/COMP2511/24T2/teams/W11A_ASPARAGUS/assignment-ii/-/merge_requests/3

> i. Look inside src/main/java/dungeonmania/entities/enemies. Where can you notice an instance of repeated code? Note down the particular offending lines/methods/fields.

[Answer]

Mercenary (line 102-129) and Zombie Toast (lines 26-53) - same movement away from player when player obtains invincibility potion.

Mercenary line 97, 100, 134 - unnecessary moveTo()

Mercenary line 90-101 and Zombie Toast lines 54-62 - same random movement.

Zombie Toast Spawner lines 22-25 and Enemy lines 31-36 - same onDestroy()

Zombie Toast lines 29-30, 31-32 and Mercenary lines 105-106, 108-109 similar format different variables.

Zombie Toast lines 115-120, 122-127 and Mercenary lines 39-44, 46-51 similar format different variables.

> ii. What Design Pattern could be used to improve the quality of the code and avoid repetition? Justify your choice by relating the scenario to the key characteristics of your chosen Design Pattern.

[Answer]
The strategy pattern can be used to fix these repeated codes since the move method implements a different algorithm depending on the situation at runtime. For instance if the player takes an invincibility potion the mercenaries and zombies will run away from the player while if they take an invisbility potion mercenaries will move randomly exactly like zombies.

> iii. Using your chosen Design Pattern, refactor the code to remove the repetition.

I added a movement implementation which returns a position when the strategy is implemented. This is changed depending on the state of the game. I added a HumanoidEnemy abstract class as the spider does not change its movement strategy. I decided not to include the spider movement in this movement strategy since unlike the other strategies it depends on previous movements and trying to implement the strategy would increase the amount of coupling between the two classes. The HumanoidEnemy stores a strategy which will change depending on the state of the game and uses this to move the enemy to where it needs to go.

### b) Observer Pattern

> Identify one place where the Observer Pattern is present in the codebase, and outline how the implementation relates to the key characteristics of the Observer Pattern.

[Answer]

There is an observer pattern in Game and Comparable Callback. The observer pattern requires an obseravable, in this case the game and observers, which are the CompareableCallback. An observable can have multiple oberservers and can add or remove observers. When an event happens the observable will update the observers - in this case this is in the tick function where the game will call the run method on each of the Comparable Callback observers, hence updating each of the observers.

### c) Inheritance Design

[Links to your merge requests](/put/links/here)
https://nw-syd-gitlab.cseunsw.tech/COMP2511/24T2/teams/W11A_ASPARAGUS/assignment-ii/-/merge_requests/5

> i. Name the code smell present in the above code. Identify all subclasses of Entity which have similar code smells that point towards the same root cause.

The code smell present is Refused Bequest, i.e. a subclass only uses some of the methods inherited from its parents. The subclasses of Entity which have similar code smells are Boulder, Exit, Door, Player, Portal, Switch, Wall, Arrow, Bomb, Key, Sword, Treasure, Wood, Enemy, Zombie Toast Spawner, Buildable and Potion.

> ii. Redesign the inheritance structure to solve the problem, in doing so remove the smells.

To solve this problem, I used the 'push down method' strategy by removing onOverlap, onMovedAway and onDestroy from the Entity abstract class, which then allowed me to remove the @Override functions that did nothing. I then created three interfaces: OverlappableEntity, MovableEntity, and DestroyableEntity which contain onOverlap, onMovedAway and onDestroy respectively. For the classes that do contain onOverlap, onMovedAway or onDestroy, I made them implement the corresponding interfact. Then, in GameMap.java, whenever onOverlap, onMovedAway and onDestroy is called for an Entity, I first check that it is an instanceof the correct Interface before calling the method.

### d) More Code Smells

[Links to your merge requests](/put/links/here)
https://nw-syd-gitlab.cseunsw.tech/COMP2511/24T2/teams/W11A_ASPARAGUS/assignment-ii/-/merge_requests/6

> i. What design smell is present in the above description?

The above description describes the code smell 'Shotgun Surgery', i.e. a single responsibility has been split up among a large number of classes. This is most noticable by the repeated code in the onOverlap method in each of the Collectables.

> ii. Refactor the code to resolve the smell and underlying problem causing it.

I created a Collectable abstract superclass, Collectable.java, which contains the implemented onOverlap method which was identical in most of the Collectable subclasses. This then meant the onOverlap method could be removed from Potion, Arrow, Key, Sword, Treasure and Wood. I also noticed the canMoveOnto method was identical in all Collectable subclasses so I moved that into the Collectable superclass as well.

### e) Open-Closed Goals

[Links to your merge requests](/put/links/here)
https://nw-syd-gitlab.cseunsw.tech/COMP2511/24T2/teams/W11A_ASPARAGUS/assignment-ii/-/merge_requests/8

> i. Do you think the design is of good quality here? Do you think it complies with the open-closed principle? Do you think the design should be changed?
> This code is not good quality - it does not comply with the open-closed principle as the Goal implementation must be heavily modified to extend the program. The design should be changed as it will make developing the game significantly harder.
> [Answer]

> ii. If you think the design is sufficient as it is, justify your decision. If you think the answer is no, pick a suitable Design Pattern that would improve the quality of the code and refactor the code accordingly.

[Briefly explain what you did]

I created a composite pattern with a goal interface with the achieved and toString functions. I then implemented each of the cases into implementations of the goal interface with the and and or goals being composite goals while the rest were leaf goals.

### f) Open Refactoring

[Merge Request 1](/put/links/here)
https://nw-syd-gitlab.cseunsw.tech/COMP2511/24T2/teams/W11A_ASPARAGUS/assignment-ii/-/merge_requests/9

Went through codebase and added the following methods to fix Law of Demeter Violations using method forwarding:

- Added getHealth() method in player and enemy classes
- Added getEntities() method in player
- Added getMapEntities() method in game class
- Added setHealth() method to player and enemy
- Added removeFromInventory() method in Game
- Added getCardinallyAdjacentPositions() method in entity
- Added getAdjacentPositions() method in entity
- Added getX() and getY() methods in entity
- Added getPlayerPosition() method in game
- Added getPlayerPosition() method in map
- Added battle() method in GameMap
- Added moveTo() method in game
- Added getPlayerEffectivePotion() method in map
- Added getMapEntities() method in game
- Added useWeapon() method in player and inventory
- Added spawnSpider() method in game

[Merge Request 2](/put/links/here)
https://nw-syd-gitlab.cseunsw.tech/COMP2511/24T2/teams/W11A_ASPARAGUS/assignment-ii/-/merge_requests/10

Removed both versions of deprecated method 'translate' which was marked for removal and refactored code which called it to use setPosition instead.

[Merge Request 3](/put/links/here)
https://nw-syd-gitlab.cseunsw.tech/COMP2511/24T2/teams/W11A_ASPARAGUS/assignment-ii/-/merge_requests/11

Refactored implementation of potions to instead use strategy pattern. Here are the steps I followed:

First I noticed a violation of the open/close priniciple in the triggerNext method in Player. Here it is:
if (inEffective instanceof InvincibilityPotion) {
state.transitionInvincible();
} else {
state.transitionInvisible();
}

To fix this, I decided to instead use the 'inEffective' parameter in Player. Then, whenever the 'applyBuff' method is called, it used the version of the method in from the inEffective potion. This an implementation of the strategy pattern and abides by the open/close principle as a new potion type can be easily added.

I changed the applyBuff method from this:
public BattleStatistics applyBuff(BattleStatistics origin) {
if (state.isInvincible()) {
return BattleStatistics.applyBuff(origin, new BattleStatistics(0, 0, 0, 1, 1, true, true));
} else if (state.isInvisible()) {
return BattleStatistics.applyBuff(origin, new BattleStatistics(0, 0, 0, 1, 1, false, false));
}
return inEffective.applyBuff(origin);
}
to this:
public BattleStatistics applyBuff(BattleStatistics origin) {
return inEffective.applyBuff(origin);
}

So that now the implementation of applyBuff in the inEffective potion is used instead, making it now abide by the open/close principle.

I then removed all the classes used to implement the state pattern as they were no longer needed.

[Merge Request 4](/put/links/here)
https://nw-syd-gitlab.cseunsw.tech/COMP2511/24T2/teams/W11A_ASPARAGUS/assignment-ii/-/merge_requests/12

Refactored implementation of Buildabled implementation by removing checkBuildCriteria method and replacing with different methods for building a bow or a shield. I also created constants for the materials required to make each of the buildables so that magic numbers could be removed.

[Merge Request 5](/put/links/here)
https://nw-syd-gitlab.cseunsw.tech/COMP2511/24T2/teams/W11A_ASPARAGUS/assignment-ii/-/merge_requests/17

Liskov Substitution Violations Found:

- Of all the subclasses of Entity, only 'Player' uses the variable facing and its related methods, so facing and all its related methods were moved from the Entity superclass to the Player subclass.

-Of all the subclasses of Entity, only 'Player' uses the variables previousPosition and previousDistinctPosition and its related methods, so previousPosition and previousDistinctPosition and all its related methods were moved from the Entity superclass to the Player subclass.

- Buildables don't have a position yet are a subclass of Entity. To fix this, I made an intermediate Abstract class PositionEntity which every subclass of Entity except the buildables are a subclass of.

[Merge Request 6](/put/links/here)
https://nw-syd-gitlab.cseunsw.tech/COMP2511/24T2/teams/W11A_ASPARAGUS/assignment-ii/-/merge_requests/19

- Midnight Armour is no longer a DurableItem

[Merge Request 5](/put/links/here)
https://nw-syd-gitlab.cseunsw.tech/COMP2511/24T2/teams/W11A_ASPARAGUS/assignment-ii/-/merge_requests/17

Liskov Substitution Violations Found:

- Of all the subclasses of Entity, only 'Player' uses the variable facing and its related methods, so facing and all its related methods were moved from the Entity superclass to the Player subclass.

-Of all the subclasses of Entity, only 'Player' uses the variables previousPosition and previousDistinctPosition and its related methods, so previousPosition and previousDistinctPosition and all its related methods were moved from the Entity superclass to the Player subclass.

- Buildables don't have a position yet are a subclass of Entity. To fix this, I made an intermediate Abstract class PositionEntity which every subclass of Entity except the buildables are a subclass of.

## Task 2) Evolution of Requirements 👽

### a) Microevolution - Enemy Goal

[Links to your merge requests](/put/links/here)
https://nw-syd-gitlab.cseunsw.tech/COMP2511/24T2/teams/W11A_ASPARAGUS/assignment-ii/-/merge_requests/14

**Assumptions**

- Allied mercenaries are not enemies
- Whether allies destroyed by a player-placed bomb count towards the enemy goal is undefined.
- Default enemies defeated is 1

**Design**

[Design]

- new class: GoalEnemy implements Goal (with achieved and toString methods)
- new method Game.getDefeatedEnemies(): Game returns defeated enemies - achieved method can check this
- new method Game.getSpawners(): Game returns spawners remaining- achieved method can check this
- new method Game.addDefeatedEnemies(): Used when mercenaries are bribed or when enemies are defeated
- new method Game.removeSpawner(): used when spawners are destroyed or interacted with

- new method GameMap.getDefeatedEnemies(): GameMap stores defeated enemies
- new method GameMap.getSpawners(): GameMap stores spawners remaining
- new method GameMap.addDefeatedEnemies(): used when mercenaries are bribed or when enemies are defeated
- new method GameMap.removeSpawner(): used when spawners are destroyed or interacted with
- new method GameMap.addSpawner(): used when initiating spawners; adds a spawner to the spawners remaining

- edit method GoalFactory.createGoal(JSONObject, JSONObject): Goal factory sets the enemy goal to defeat a certain amount of enemies according to configuration

**Changes after review**

[Design review/Changes made]

- Added names for new classes added
- Added assumptions about allies being destroyed by player placed bomb

**Test list**

[Test List]

- Test 1: test enemy goal is completed after player defeats 2 enemies
- Test 2: test enemy goal is completed after player destroys all spawners
- Test 3: test enemy goal is completed after player defeats 1 enemy and destroys all spawners
- Test 4: test enemy goal is completed after player bribes mercenary
- Test 5: test enemy goal is compatible with exit goal, treasure and boulder goal
- Test 6: test enemy goal is completed when a spawner is blown up

[Test review/Changes made]

- Add a test for when a final goal involves completing the enemy goal in conjuction with other goal(s).

**Other notes**

- Added GameMap.getIds() to method forward (returns ids of a certain type)
- Added methods GameMap.addSpawner(), GameMap.removeSpawner(), GameMap.getSpawner(), GameMap.addDefeatedEnemy(), GameMap.getDefeatedEnemies()
- Added private int variables spawner and enemies defeated
- Added game methods Game.removeSpawner(), Game.addDefeatedEnemy()
- Added test for when spawner is blown up

### Choice 1 (Task2D - Sun Stone & More Buildables)

[Links to your merge requests](/put/links/here)
https://nw-syd-gitlab.cseunsw.tech/COMP2511/24T2/teams/W11A_ASPARAGUS/assignment-ii/-/merge_requests/new?merge_request%5Bsource_branch%5D=Task2D

**Assumptions**

- Where there are multiple valid options for creating a buildable entity, the precedence of items is undefined
- The behaviour of a sceptre after use is undefined
- The behaviour of possessing multiple sceptres is undefined
- When trying to open a door with both a key and a sunstone in the player's inventory, it is undefined which entity will be used.
- The behaviour when mind_control_duration is <= 0 is undefined.
- When a mercenary or assassin can be bribed and mind controlled at the same time, which action will be taken after the player interacts with them is undefined.
- Whether midnight armour counts as a weapon when destroying zombie toast spawners is undefined.
- Mercenary behaviour when ending mind control while on the same tile as a player is undefined
- Mercenaries mind controlled do not count towards the enemy goal
- Midnight armour does not disappear if zombie toast spawn after
- Midnight armour buff stacks with multiple midnight armour
- Sceptres are not weapons

**Design**

[Design]

- New class - Sun Stone: extends Key implements InventoryItem implements treasure
- Update method: Game.build(buildable) to prioritise keys and treasure
- Update method: to check sun stones in possession
- Update method: usage does not delete item

- New class - Sceptre: extends Buildable
- Field - Sceptre.ticksControlled

- New field: Mercenary.mindControlledDuration - ticks remaining of Mercenary mind countrolled
- Update method: Mercenary.interact - if unable to bribe will mind control with sceptre
- Update method: Mercenary.canBeInteracted - will set to true if player has a sceptre

- Update method: Inventory.getBuildables() to include Sceptre and Midnight Armour
- Update method: Inventory.build(entity, EntityFactory) to include Sceptre and Midnight Armour

- New class - MidnightArmour: extends Buildable implements BattleItem
- Field - private int MidnightArmour.attack
- Field - private int MidnightArmour.defence
- Field - private static final MidnightArmour.durability = 1

- Edit Graph Node Factory and Entity Factory method construct entity to include sun stone

- Edited Door.onOverlap method to include sunStone
- Edited Door.canMoveOnto method to include sunStone
- Created Door.hasSunStone(player) method

- Added method: Player.hasSceptre() to determine whether a player has a sceptre

- Edited gameBuilder.buildMap to add map to inventory through method forwarding by player
  **Changes after review**

- No changes to be made.

**Test list**

[Test List]

- Test 1: Test sun stone counts towards treasure goal
- Test 2: Test sun stone acts as key but is not used
- Test 3: Test sun stone cannot be used to bribe
- Test 4: Test sun stone is not consumed when crafting shield
- Test 5: Test treasure prioritised to craft shield
- Test 6: Test key prioritised to craft shield
- Test 7: Test all recipes to build sceptre
- Test 8: Test sceptre can mind control mercenaries for a certain number of ticks
- Test 9: Test recipe to build midnight armour with zombie toast spawner
- Test 10: Test battle buffs for midnight armour
- Test 11: Test mind controlled mercenaries buffs

**Other notes**
[Any other notes]

### Choice 2 (Task 2F - Logical Switches)

[Links to your merge requests](/put/links/here)
https://nw-syd-gitlab.cseunsw.tech/COMP2511/24T2/teams/W11A_ASPARAGUS/assignment-ii/-/merge_requests/13
https://nw-syd-gitlab.cseunsw.tech/COMP2511/24T2/teams/W11A_ASPARAGUS/assignment-ii/-/merge_requests/15

**Assumptions**

- Whether the player can stand on light bulbs is undefined
- Any scenario where the order in which activated components perform their action is undefined. e.g. where a logical bomb might activate and destroy parts of a circuit before other logical components are able to activate
- What happens when a door is closed on an entity is undefined

**Design**

- New Interface - Conductor
- method - isActivated (to return whether conductor is active)
- method - activate (to change the conductor to the active state)
- method - getTicksActive (returns how long the conductor has been active)
- method - tick (increases ticksActive)

- New Interface - LogicalRule (to be used for strategy pattern)
- method - checkActive (checks the surrounding conductors so see if a LogicalEntity should activate)

- New Class - Wire

- New Class - SwitchDoor

- New Class - LightBulb

- New Class - Or

- New Class - And

- New Class - Xor

- New Class - Coand

- Modify Class - Switch

- Modify Class - Bomb

**Changes after review**

[Design review/Changes made]

- Add assumption for when doors close on enemies
- Outline what the LogicalRule methods would be/ their functionality

**Test list**

Light Bulb Tests

- Can be activated by a cardinally adjacent switch
- Can be activated by current from a switch propagated through wires

Switch Door Tests

- Cannot walk through a closed switch door
- Can be activated by a cardinally adjacent switch
- Can be activated by current from a switch propagated through wires

Bomb Tests

- Can be activated by a cardinally adjacent switch
- Can be activated by current from a switch propagated through wires

Or Rule Tests

- Activate 'or' entity by having 1 adjacent activated conductor
- Activate 'or' entity by having more than 1 adjacent activated conductor

And Rule Tests

- There is 1 adjacent conductor which is active so 'and' Entity does not activate
- There are exactly 2 adjacent conductors. Initially, only 1 is active, so 'and' Entity does not active. At a later tick, the other conductor also activates, so the Entity should activate.
- 2 out of 3 adjacent conductors become active in the same tick, making an 'and' entity remain inactive. When the third conductor becomes active, the entity becomes active.

Xor Rule Tests

- There is 1 adjacent condutor which is active so the 'xor' entity is active.
- There are 2 adjacent conductors. When none are active, the 'xor' entity should not be active. When 1 is active, the entity should be active. When both are active, the 'xor' entity should not be active.

CoAnd Rule Tests

- There is 1 cardinally adjacent conducor. When it becomes active, the 'coand' entity remains inactive.
- There are 2 cardinally adjacent conductors which both activate on the same tick, making the 'CoAnd' entity activate.
- There are 2 cardinally adjacent conductors. 1 is already active. When the other becomes active, the 'CoAnd' entity should remain deactive.
- There are 3 cardinally adjacent conductors. They each become active on different ticks, meaning the coand entity never activates

**Other notes**

[Any other notes]

- check that AND does not switch off when 3 adjacent activated conductors are next to it

### Choice 3 (Insert choice) (If you have a 3rd member)

[Links to your merge requests](/put/links/here)

**Assumptions**

[Any assumptions made]

**Design**

[Design]

**Changes after review**

[Design review/Changes made]

**Test list**

[Test List]

**Other notes**

[Any other notes]

## Task 3) Investigation Task ⁉️

[Merge Request 1](/put/links/here)

[Briefly explain what you did]

[Merge Request 2](/put/links/here)

[Briefly explain what you did]

Add all other changes you made in the same format here:
