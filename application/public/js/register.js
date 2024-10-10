document.addEventListener("DOMContentLoaded", () => {
  const roleButtons = document.querySelectorAll('input[name="role"]');
  const registerForm = document.getElementById("registerForm");
  const nextToStep3Button = document.getElementById("nextToStep3");
  const steps = document.querySelectorAll(".step");
  let selectedRole = "";

  roleButtons.forEach((button) => {
    button.addEventListener("change", () => {
      selectedRole = button.value;
      registerForm.action = `/register/${selectedRole}`;
      showStep(2);
    });
  });

  if (nextToStep3Button) {
    nextToStep3Button.addEventListener("click", () => {
      if (selectedRole === "tutor") {
        showStep(3);
      } else {
        registerForm.submit();
      }
    });
  }

  function showStep(stepNumber) {
    steps.forEach((step, index) => {
      step.classList.toggle("hidden", index !== stepNumber - 1);
    });
  }

  // Show subjects input if tutor role is selected
  document.getElementById("tutorBtn").addEventListener("click", function () {
    document.getElementById("subjectsStep").classList.remove("hidden");
  });

  document.getElementById("studentBtn").addEventListener("click", function () {
    document.getElementById("subjectsStep").classList.add("hidden");
  });

  // Initialize Tagify for Subjects
  const input = document.getElementById("subjects");
  const subjects = <%- JSON.stringify(subjects) %>.map(subject => subject.subject_name);

  const tagify = new Tagify(input, {
    whitelist: subjects,
    dropdown: {
      maxItems: 20,           // maximum items to show in the suggestions dropdown
      classname: "tags-look", // custom class for the dropdown
      enabled: 0,             // show suggestions on focus
      closeOnSelect: false    // keep the dropdown open after selecting a suggestion
    }
  });

  // Ensure that the subjects are submitted as a comma-separated string
  tagify.on('change', function() {
    const selectedTags = tagify.value.map(tag => tag.value);
    input.value = selectedTags.join(',');
  });
});
