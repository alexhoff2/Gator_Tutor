document.addEventListener("DOMContentLoaded", () => {
  const sortButton = document.getElementById("sortDropdownButton");
  const sortDropdown = document.getElementById("dropdownSort");
  const filterButton = document.getElementById("filterButton");
  const filterModal = document.getElementById("filterModal");

  // Toggle Sort Dropdown
  sortButton.addEventListener("click", () => {
    sortDropdown.classList.toggle("hidden");
  });

  // Close Sort Dropdown when clicking outside
  window.addEventListener("click", (event) => {
    if (
      !sortButton.contains(event.target) &&
      !sortDropdown.contains(event.target)
    ) {
      sortDropdown.classList.add("hidden");
    }
  });

  // Toggle Filter Modal
  filterButton.addEventListener("click", () => {
    filterModal.classList.toggle("hidden");
  });

  // Close Modal when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target === filterModal) {
      filterModal.classList.add("hidden");
    }
  });
});
