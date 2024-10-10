document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("header-search-form");
  const queryInput = document.getElementById("header-search-query");
  const subjectsInput = document.getElementById("header-search-subjects");
  let tagify;

  if (subjectsInput) {
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
  }

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchQuery = queryInput.value;
    const selectedSubjects = tagify.value.map((tag) => tag.value).join(",");

    let url = new URL("/tutors", window.location.origin);
    if (searchQuery) {
      url.searchParams.set("query", searchQuery);
    }
    if (selectedSubjects) {
      url.searchParams.set("subjects", selectedSubjects);
    }

    window.location.href = url.toString();
  });
});
