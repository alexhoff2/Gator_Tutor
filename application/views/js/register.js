// public/js/register.js

document.addEventListener('DOMContentLoaded', function () {
    const studentBtn = document.getElementById('studentBtn');
    const tutorBtn = document.getElementById('tutorBtn');
    const registrationForm = document.getElementById('registrationForm');
    const studentFields = document.getElementById('studentFields');
    const tutorFields = document.getElementById('tutorFields');

    // Show the form and student-specific fields when "I'm a Student" is clicked
    studentBtn.addEventListener('click', function () {
        registrationForm.style.display = 'block';  // Show the form
        studentFields.style.display = 'block';     // Show student-specific fields
        tutorFields.style.display = 'none';        // Hide tutor-specific fields
    });

    // Show the form and tutor-specific fields when "I'm a Tutor" is clicked
    tutorBtn.addEventListener('click', function () {
        registrationForm.style.display = 'block';  // Show the form
        studentFields.style.display = 'none';      // Hide student-specific fields
        tutorFields.style.display = 'block';       // Show tutor-specific fields
    });
});
