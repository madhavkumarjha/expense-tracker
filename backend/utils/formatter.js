/**
 * Utility Helper: Array se duplicate model reference data ko alag karke top par set karta hai.
 * @param {Array} records - Mongoose documents ka array
 * @param {String} populateKey - Kis field se user object extract karna hai (Default: 'userId')
 */
export const formatCleanResponse = (records, populateKey = "userId") => {
  if (!records || records.length === 0) {
    return { user: null, data: [] };
  }

  // records[0][populateKey] se data nikalega, safely handling first element
  const firstRecord = records[0];
  const userData = firstRecord && firstRecord[populateKey] ? firstRecord[populateKey] : null;

  const cleanedData = records.map((item) => {
    const plainDoc = typeof item.toObject === "function" ? item.toObject() : { ...item };
    delete plainDoc[populateKey]; // Dynamically removes the duplicate field
    return plainDoc;
  });

  return {
    user: userData,
    data: cleanedData
  };
};
