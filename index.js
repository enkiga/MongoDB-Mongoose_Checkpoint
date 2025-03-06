// Environment Setup and Dependencies
require("dotenv").config();
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

// Check if MongoDB is connected
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("MongoDB connected!");
});

// Create a Person Schema {Name, Age, FavoriteFoods}
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: Number,
  favoriteFoods: [String],
});

// Create a Person Model
const Person = mongoose.model("Person", personSchema);

const createAndSavePerson = async () => {
  const person = new Person({
    name: "John Doe",
    age: 25,
    favoriteFoods: ["Pizza", "Pasta"],
  });

  try {
    const data = await person.save();
    return data; // Return the saved data
  } catch (err) {
    console.error(err);
    throw err; // Rethrow the error to be handled by the caller
  }
};

// Create Many Records
const createManyPeople = async (arrayOfPeople) => {
  try {
    const data = await Person.create(arrayOfPeople);
    return data; // Return the saved data
  } catch (err) {
    console.error(err);
    throw err; // Rethrow the error to be handled by the caller
  }
};

// Find People By Name
const findPeopleByName = async (personName) => {
  try {
    const data = await Person.find({ name: personName });
    return data; // Return the found data
  } catch (err) {
    console.error(err);
    throw err; // Rethrow the error to be handled by the caller
  }
};

// Find One Person By Food
const findOneByFood = async (food) => {
  try {
    const data = await Person.findOne({ favoriteFoods: food });
    return data; // Return the found data
  } catch (err) {
    console.error(err);
    throw err; // Rethrow the error to be handled by the caller
  }
};

// Find Person By ID
const findPersonById = async (personId) => {
  try {
    const data = await Person.findById(personId);
    return data; // Return the found data
  } catch (err) {
    console.error(err);
    throw err; // Rethrow the error to be handled by the caller
  }
};

// Perform Classic Updates by Running Find, Edit, then Save
const findEditThenSave = async (personId) => {
  try {
    const person = await Person.findById(personId); // Corrected line: added (personId)
    if (!person) {
      return null; // Handle case where person is not found.
    }
    person.favoriteFoods.push("Hamburger");
    const data = await person.save();
    return data; // Return the updated data
  } catch (err) {
    console.error(err);
    throw err; // Rethrow the error to be handled by the caller
  }
};

// Perform New Updates on a Document Using model.findOneAndUpdate()
const findAndUpdate = async (personName) => {
  const ageToSet = 20;

  try {
    const data = await Person.findOneAndUpdate(
      // Find and update
      { name: personName },
      { age: ageToSet },
      { new: true } // Return the updated document
    );
    return data; // Return the updated data
  } catch (err) {
    console.error(err);
    throw err; // Rethrow the error to be handled by the caller
  }
};

// Delete One Person By Id
const removeById = async (personId) => {
  try {
    const data = await Person.findByIdAndDelete(personId); // Changed to findByIdAndDelete
    return data; // Return the removed data
  } catch (err) {
    console.error(err);
    throw err; // Rethrow the error to be handled by the caller
  }
};

// Delete Many People
const removeManyPeople = async (nameToRemove) => {
  try {
    const data = await Person.deleteMany({ name: nameToRemove }); // Changed to deleteMany
    return data; // Return the removed data
  } catch (err) {
    console.error(err);
    throw err; // Rethrow the error to be handled by the caller
  }
};

// Chain Search Query Helpers to Narrow Search Results
const queryChain = async (foodToSearch) => {
  try {
    const data = await Person.find({ favoriteFoods: foodToSearch })
      .sort({ name: 1 })
      .limit(2)
      .select("-age");
    return data; // Return the found data
  } catch (err) {
    console.error(err);
    throw err; // Rethrow the error to be handled by the caller
  }
};

// Call the createAndSavePerson function
async function main() {
  try {
    const savedPerson = await createAndSavePerson();
    console.log(savedPerson);

    const arrayOfPeople = [
      { name: "Jane Doe", age: 25, favoriteFoods: ["Pizza", "Pasta"] },
      { name: "Mary Doe", age: 30, favoriteFoods: ["Burger", "Fries"] },
      { name: "John Doe", age: 35, favoriteFoods: ["Pizza", "Pasta"] },
    ];
    const savedPeople = await createManyPeople(arrayOfPeople);
    console.log(savedPeople);

    const peopleByName = await findPeopleByName("John Doe");
    console.log(peopleByName);

    const personByFood = await findOneByFood("Pizza");
    console.log(personByFood);

    const personById = await findPersonById("67c9e7ff96e3296f9dc98fb6");
    console.log(personById);

    const editedPerson = await findEditThenSave("5f7d8a3f5d4b7a0d3c3e5b6e");
    console.log(editedPerson);

    const updatedPerson = await findAndUpdate("Mary Doe");
    console.log(updatedPerson);

    const removedPerson = await removeById("5f7d8a3f5d4b7a0d3c3e5b6e");
    console.log(removedPerson);

    const removedPeople = await removeManyPeople("Mary Doe");
    console.log(removedPeople);

    const queriedData = await queryChain("Pizza");
    console.log(queriedData);

    // Close the connection
    mongoose.connection
      .close()
      .then(() => console.log("MongoDB connection closed"))
      .catch((err) => console.error(err));
  } catch (err) {
    console.error(err);
  }
}

main();
