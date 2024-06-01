export const truncateAtWord = (
  str: string, // Input string to be truncated
  maxChar: number, // Maximum number of characters allowed
  addEllipsis: boolean = true // Flag to indicate whether to add ellipsis at the end
) => {
  // Split the input string into an array of words
  const words = str.split(" ");

  // Initialize character count
  let charCount = 0;
  // Flag to indicate if the character limit has been reached
  let limitReached = false;
  // Array to store accepted words within the character limit
  const acceptedWords = [];

  // Iterate through each word in the array
  for (const word of words) {
    // Flag to indicate if the word is accepted within the character limit
    let wordAccepted = true;
    // Iterate through each character in the word
    for (const _ of word) {
      // Use _ as a placeholder for the character since we don't need it
      charCount++; // Increment the character count

      // Check if the character count exceeds the maximum allowed characters
      if (charCount > maxChar) {
        wordAccepted = false; // Set the wordAccepted flag to false
        limitReached = true; // Set the limitReached flag to true
        break; // Exit the inner loop
      }
    }
    // If the word is not accepted, exit the outer loop
    // This will prevent adding the word that exceeds the character limit
    if (!wordAccepted) break;

    // Add the accepted word to the acceptedWords array
    acceptedWords.push(word);
  }

  // Join the accepted words into a truncated string
  let truncatedStr = acceptedWords.join(" ");

  // Add ellipsis only if there was truncation and addEllipsis = true
  return addEllipsis && limitReached ? truncatedStr + "..." : truncatedStr;
};
