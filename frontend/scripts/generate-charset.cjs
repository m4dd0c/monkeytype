const fs = require("fs");

/**
 * Generates a charset for each language provided in the arguments.
 * Reads the language file, extracts unique characters from words,
 * and updates the file with the generated charset.
 *
 * @param {string[]} args - List of language to process.
 */
function generateCharset(args) {
  args.forEach((language) => {
    try {
      // Read and parse the language JSON file
      const file = JSON.parse(
        fs.readFileSync(`./static/languages/${language}.json`, {
          encoding: "utf8",
          flag: "r",
        }),
      );

      // Extract unique characters from words and sort them
      const charset = [...new Set(file.words.join(""))].sort();

      // Add the generated charset to the file
      file.charset = charset;

      // Write the updated file back to disk
      fs.writeFileSync(
        `./static/languages/${language}.json`,
        JSON.stringify(file, null, 2),
        { encoding: "utf8" },
      );
    } catch (e) {
      console.error(
        "Couldn't Generate Charset for " + language,
        "\nError:",
        e?.message,
      );
    }
  });
}

/**
 * Reads and returns the list of all available languages from _list.json.
 *
 * @returns {string[]} - List of language codes.
 */
function getLanguageList() {
  try {
    // Read and parse the _list.json file
    const list = JSON.parse(
      fs.readFileSync("./static/languages/_list.json", {
        encoding: "utf8",
        flag: "r",
      }),
    );
    return list;
  } catch (error) {
    console.error("Error reading language list:", error?.message);
  }
}

/**
 * Main function to handle command-line arguments and trigger charset generation.
 * If no arguments are provided, it exits with an error message.
 * If '--all' is provided, it processes all languages in the list.
 */
function main() {
  // Get command-line arguments, excluding the first two (node and script path)
  let args = process.argv.splice(2);

  if (args.length === 0) {
    // Exit if no languages are provided
    console.error("No languages provided. Exiting.");
    return;
  }

  // Replace arguments with the full language list if '--all' is specified
  if (args.includes("--all")) args = getLanguageList();

  // Generate charset for the provided languages
  generateCharset(args);
}

// Execute the main function
main();
