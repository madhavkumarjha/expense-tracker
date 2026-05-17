// utils/budgetValidator.js
import Budget from "../models/budget.model.js";

export const validateAndComputeBudgetTimeline = async (monthInput, userId, excludeId = null) => {
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-11
  const currentYear = now.getFullYear();

  // 1. If no month passed, default to current month. Otherwise convert human 1-12 to JS 0-11
  let budgetMonth = monthInput !== undefined ? Number(monthInput) - 1 : currentMonth;
  let budgetYear = currentYear; // Set default baseline

  if (Number.isNaN(budgetMonth) || budgetMonth < 0 || budgetMonth > 11) {
    return { valid: false, status: 400, message: "Invalid month selection." };
  }

  // 2. Automatically handle year rollovers without needing frontend input
  if (currentMonth === 0 && budgetMonth === 11) {
    budgetYear = currentYear - 1; // It's Jan, user selected Dec -> Previous Year
  } else if (currentMonth === 11 && budgetMonth === 0) {
    budgetYear = currentYear + 1; // It's Dec, user selected Jan -> Next Year
  }

  // 3. Strict 3-Month Window Security Check
  const targetDate = new Date(budgetYear, budgetMonth, 1);
  const minDate = new Date(currentYear, currentMonth - 1, 1);
  const maxDate = new Date(currentYear, currentMonth + 1, 1);

  if (targetDate < minDate || targetDate > maxDate) {
    return { 
      valid: false, 
      status: 400, 
      message: "Restricted Action: Budget can only be set for the previous, current, or next month." 
    };
  }

  // 4. Collision / Duplicate Check
  const query = { userId, month: budgetMonth, year: budgetYear };
  if (excludeId) query._id = { $ne: excludeId }; // Skip current record if updating/moving

  const conflict = await Budget.findOne(query);
  if (conflict) {
    return { 
      valid: false, 
      status: 409, 
      message: "A budget configuration already exists for this specific month." 
    };
  }

  // Return clean calculated data for the DB pipeline
  return { valid: true, budgetMonth, budgetYear };
};
