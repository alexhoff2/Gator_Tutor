document.addEventListener("DOMContentLoaded", () => {
  const filterForm = document.getElementById("filter-form");
  const subjectsInput = document.getElementById("subjects");
  let tagify;

  // Initialize Tagify for Subjects
  if (subjectsInput) {
    const subjectsList = subjectsData.map((subject) => ({
      value: subject.subject_name,
      tutorCount: subject.tutor_count,
    }));

    tagify = new Tagify(subjectsInput, {
      whitelist: subjectsList,
      enforceWhitelist: true,
      maxTags: 5,
      dropdown: {
        maxItems: 100,
        classname: "tags-look",
        enabled: 0,
        closeOnSelect: false,
        searchKeys: ["value"],
      },
    });

    // Add event listener for tag removal
    tagify.on("remove", () => {
      applyFilters();
    });
  }

  // Filtering functionality
  if (filterForm) {
    filterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      applyFilters();
    });
  }

  function applyFilters() {
    const selectedSubjects = tagify.value.map((tag) => tag.value).join(",");
    const minPrice = document.getElementById("min-price").value;
    const maxPrice = document.getElementById("max-price").value;

    let url = new URL(window.location);

    if (selectedSubjects) {
      url.searchParams.set("subjects", selectedSubjects);
    } else {
      url.searchParams.delete("subjects");
    }

    if (minPrice) {
      url.searchParams.set("minPrice", minPrice);
    } else {
      url.searchParams.delete("minPrice");
    }

    if (maxPrice) {
      url.searchParams.set("maxPrice", maxPrice);
    } else {
      url.searchParams.delete("maxPrice");
    }

    // Preserve the current sort option if it exists
    const currentSort = url.searchParams.get("sort");
    if (currentSort) {
      url.searchParams.set("sort", currentSort);
    }

    window.location = url;
  }

  // Sorting functionality
  const sortOptions = document.querySelectorAll("[data-sort-option]");
  sortOptions.forEach((option) => {
    option.addEventListener("click", (e) => {
      e.preventDefault();
      const sortBy = option.getAttribute("data-sort-option");
      let url = new URL(window.location);
      url.searchParams.set("sort", sortBy);
      window.location = url;
    });
  });
});
