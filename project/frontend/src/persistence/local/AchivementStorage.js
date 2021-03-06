import AsyncStorage from "@react-native-community/async-storage";

const ACHIEVEMENT_STORAGE_KEY = "achievementList";

/**
 * Stores the list of acquired achievements locally.
 * @param {Array<{id: Number, hasCollected: Boolean }>} achievementList  - the list of collected achievements
 */
export async function writeCollectedAchievements(achievementList) {
  const achievementString = JSON.stringify(achievementList);
  await AsyncStorage.setItem(ACHIEVEMENT_STORAGE_KEY, achievementString);
}

/**
 * Reads from the persistent memory and
 * @returns {Promise<Array<{id: Number, hasCollected: Boolean }>>}, which is a list of all granted
 * achievement-objects.
 */
export async function readCollectedAchievements() {
  const achievementString = await AsyncStorage.getItem(ACHIEVEMENT_STORAGE_KEY);
  if (achievementString === null || JSON.parse(achievementString) === null) {
    return [];
  }
  return await JSON.parse(achievementString);
}
/**
 * Pushes an achievement to the persistent memory.
 * @param {Array<{id: Number, hasCollected: Boolean }>} item
 */
export async function pushCollected(item) {
  const collected = await readCollectedAchievements();
  collected.push(item);
  await writeCollectedAchievements(collected);
}
