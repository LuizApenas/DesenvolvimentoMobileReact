import AsyncStorage from "@react-native-async-storage/async-storage";

// Key for storing users in AsyncStorage
const USERS_STORAGE_KEY = "users";

// Define the User structure
export interface User {
  id: string; // Unique identifier for the user
  name: string; // Display name of the user
  login: string; // Login username
  pin: string; // PIN for login (should be handled securely in a real app)
  role: string; // Role of the user (e.g., 'gerente', 'garcom', 'cozinha')
}

/**
 * Retrieves all users from AsyncStorage.
 * @returns {Promise<User[]>} A promise that resolves to an array of users, or an empty array if none are found or an error occurs.
 */
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error("Error getting all users from AsyncStorage:", error);
    return []; // Return empty array in case of an error
  }
};

/**
 * Saves a new user to AsyncStorage.
 * Ensures no duplicate login exists before saving.
 * @param {User} newUser - The user object to save.
 * @returns {Promise<boolean>} A promise that resolves to true if the user was saved successfully, false otherwise.
 */
export const saveNewUser = async (newUser: User): Promise<boolean> => {
  try {
    const existingUsers = await getAllUsers();

    // Check if a user with the same login already exists
    const userExists = existingUsers.some((user) => user.login === newUser.login);
    if (userExists) {
      console.warn(`User with login "${newUser.login}" already exists.`);
      return false; // Indicate failure due to duplicate login
    }

    const updatedUsers = [...existingUsers, newUser];
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    console.log("User saved successfully:", newUser.login);
    return true; // Indicate success
  } catch (error) {
    console.error("Error saving new user to AsyncStorage:", error);
    return false; // Indicate failure
  }
};

/**
 * Finds a user by their login and PIN.
 * @param {string} login - The login of the user.
 * @param {string} pin - The PIN of the user.
 * @returns {Promise<User | null>} A promise that resolves to the user object if found, or null otherwise.
 */
export const getUserByLoginAndPin = async (login: string, pin: string): Promise<User | null> => {
  try {
    const users = await getAllUsers();
    const foundUser = users.find((user) => user.login === login && user.pin === pin);
    return foundUser || null;
  } catch (error) {
    console.error("Error getting user by login and PIN:", error);
    return null; // Return null in case of an error
  }
};

/**
 * Updates an existing user's data in AsyncStorage.
 * @param {string} userId - The ID of the user to update.
 * @param {Partial<User>} updatedUserData - An object containing the user data to update.
 * @returns {Promise<boolean>} A promise that resolves to true if the user was updated successfully, false otherwise.
 */
export const updateUser = async (userId: string, updatedUserData: Partial<User>): Promise<boolean> => {
  try {
    const existingUsers = await getAllUsers();
    const userIndex = existingUsers.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      console.warn(`User with ID "${userId}" not found for update.`);
      return false; // Indicate user not found
    }

    // Ensure login uniqueness if it's being changed
    if (updatedUserData.login && updatedUserData.login !== existingUsers[userIndex].login) {
      const loginExists = existingUsers.some(
        (user, index) => index !== userIndex && user.login === updatedUserData.login
      );
      if (loginExists) {
        console.warn(`Cannot update user. Login "${updatedUserData.login}" is already in use.`);
        return false; // Indicate failure due to duplicate login
      }
    }

    // Create the updated user object
    const updatedUser = { ...existingUsers[userIndex], ...updatedUserData };
    // Replace the old user object with the updated one
    existingUsers[userIndex] = updatedUser;

    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(existingUsers));
    console.log("User updated successfully:", userId);
    return true; // Indicate success
  } catch (error) {
    console.error("Error updating user in AsyncStorage:", error);
    return false; // Indicate failure
  }
};

/**
 * Removes a user from AsyncStorage by their ID.
 * @param {string} userId - The ID of the user to remove.
 * @returns {Promise<boolean>} A promise that resolves to true if the user was removed successfully, false otherwise.
 */
export const removeUser = async (userId: string): Promise<boolean> => {
  try {
    const existingUsers = await getAllUsers();
    const updatedUsers = existingUsers.filter((user) => user.id !== userId);

    if (existingUsers.length === updatedUsers.length) {
      console.warn(`User with ID "${userId}" not found for removal.`);
      return false; // Indicate user not found
    }

    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    console.log("User removed successfully:", userId);
    return true; // Indicate success
  } catch (error) {
    console.error("Error removing user from AsyncStorage:", error);
    return false; // Indicate failure
  }
};

/**
 * Clears all users from AsyncStorage.
 * Useful for testing or resetting data.
 * @returns {Promise<void>}
 */
export const clearAllUsers = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USERS_STORAGE_KEY);
    console.log("All users cleared from AsyncStorage.");
  } catch (error) {
    console.error("Error clearing all users from AsyncStorage:", error);
  }
};

/**
 * Initializes a default admin user if one doesn't already exist.
 * This is useful for easy testing and initial setup.
 * @returns {Promise<void>}
 */
export const initializeDefaultAdmin = async (): Promise<void> => {
  try {
    const existingUsers = await getAllUsers();
    const adminExists = existingUsers.some((user) => user.login === "admin");

    if (!adminExists) {
      const adminUser: User = {
        id: "admin-default-id", // Static ID for the default admin
        name: "Admin User",
        login: "admin",
        pin: "admin", // For testing purposes, plain PIN
        role: "ADMIN",
      };
      const success = await saveNewUser(adminUser);
      if (success) {
        console.log("Default admin user initialized successfully.");
      } else {
        // This might happen if saveNewUser fails for reasons other than duplicate login (already checked)
        // or if the initial check for adminExists somehow passed but saveNewUser found a duplicate (unlikely race condition here)
        console.warn("Failed to initialize default admin user. It might already exist or another error occurred.");
      }
    } else {
      console.log("Default admin user already exists.");
    }
  } catch (error) {
    console.error("Error initializing default admin user:", error);
  }
};
