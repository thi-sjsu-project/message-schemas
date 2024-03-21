import typia, { tags } from "typia";



/* type definitions */

type User = {
  username: string & tags.MinLength<4> & tags.MaxLength<16>, // string with minimum and maximum length
  birthdate: DateString, // custom type that also has constrains added to it
  pets: Pet[] & tags.MinItems<1>, // bounds for number of items in list
  favouriteTvSeries?: string, // optional properties
};

// custom type
type DateString = string & tags.Format<"date">;

type Cat = {
  animalType: "cat", // `animalType` can only be "cat", "dog" or "bird"
  numberOfLivesLeft: number & tags.Type<"uint32"> & tags.Maximum<9>, // integer and maximum value constrains
};

type Dog = {
  animalType: "dog",
  favouriteDogFoodBrand?: string,
};

type Bird = {
  animalType: "bird",
};

type Pet = (Cat | Dog | Bird) & {
  name: string,
};

// other possibilities:
//  - other built-in formats: email, uuid, url, json pointers, ...
//  - check string for regex pattern
//  - completely custom constraints for tags



/* json samples */

// valid
const SAMPLE_1 = `{
  "username": "meyer.sepp",
  "birthdate": "1983-03-28",
  "pets": [
    { "animalType": "cat", "name": "Kittykatty", "numberOfLivesLeft": 5 },
    { "animalType": "dog", "name": "Olaf", "favouriteDogFoodBrand": "DogGo!" },
    { "animalType": "bird", "name": "Lori" },
    { "animalType": "bird", "name": "Flori" }
  ],
  "favouriteTvSeries": "The Office"
}`;

// missing property `birthdate`
const SAMPLE_2 = `{
  "username": "foofa",
  "pets": [
    { "animalType": "dog", "name": "Ludwig" }
  ]
}`;

// additional property `id`
const SAMPLE_3 = `{
  "id": 42,
  "username": "IcyToothPaste",
  "birthdate": "2001-08-08",
  "pets": [
    { "animalType": "cat", "name": "Susi", "numberOfLivesLeft": 9 },
    { "animalType": "cat", "name": "Lolo", "numberOfLivesLeft": 8 }
  ]
}`;

// incorrect values: too short username, malformatted date, invalid
// `animalType`, incorrect value for `numberOfLivesLeft`
const SAMPLE_4 = `{
  "username": "qux",
  "birthdate": "04/32/1947",
  "pets": [
    { "animalType": "turtle", "name": "Schildi" },
    { "animalType": "cat", "name": "Felix", "numberOfLivesLeft": 11 }
  ]
}`;

const SAMPLES = [SAMPLE_1, SAMPLE_2, SAMPLE_3, SAMPLE_4];



/* validation */

const validator = typia.createValidateEquals<User>();

for (const idx in SAMPLES) {
  const json = SAMPLES[idx];
  const parsed = JSON.parse(json);
  const validationResult = validator(parsed);

  if (validationResult.success) {
    console.log(`sample ${idx + 1}: success`);
    // here, we can retrieve the actual `User` object with:
    // const user = validationResult.data;
  } else {
    console.log(`sample ${idx + 1}: failure`);
    for (const error of validationResult.errors) {
      console.log(` - ${error.path}, expected ${error.expected}, found value ${error.value}`);
    }
  }
}
