document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing search functionality");
  const searchForm = document.getElementById("header-search-form");
  const queryInput = document.getElementById("header-search-query");
  const subjectsInput = document.getElementById("header-search-subjects");
  let tagify;

  console.log("Search form:", searchForm);
  console.log("Query input:", queryInput);
  console.log("Subjects input:", subjectsInput);

  if (subjectsInput) {
    console.log("Initializing Tagify");
    tagify = new Tagify(subjectsInput, {
      whitelist: subjectsData.map((subject) => subject.subject_name),
      enforceWhitelist: true,
      maxTags: 3,
      dropdown: {
        maxItems: 20,
        classname: "tags-look",
        enabled: 0,
        closeOnSelect: false,
      },
    });
    console.log("Tagify initialized");
  }

  if (searchForm) {
    console.log("Adding submit event listener to search form");
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("Search form submitted");
      const searchQuery = queryInput.value;
      console.log("Search query:", searchQuery);
      const selectedSubjects = tagify
        ? tagify.value.map((tag) => tag.value).join(",")
        : "";
      console.log("Selected subjects:", selectedSubjects);

      let url = new URL("/tutors", window.location.origin);
      if (searchQuery) {
        url.searchParams.set("query", searchQuery);
      }
      if (selectedSubjects) {
        url.searchParams.set("subjects", selectedSubjects);
      }

      console.log("Redirecting to:", url.toString());
      window.location.href = url.toString();
    });
  } else {
    console.error("Search form not found");
  }
});
