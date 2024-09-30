document.addEventListener('DOMContentLoaded', () => {
    const roleButtons = document.querySelectorAll('input[name="role"]');
    const registerForm = document.getElementById('registerForm');
    const nextToStep3Button = document.getElementById('nextToStep3');
    const steps = document.querySelectorAll('.step');
    let selectedRole = '';

    roleButtons.forEach(button => {
        button.addEventListener('change', () => {
            selectedRole = button.value;
            registerForm.action = `/register/${selectedRole}`;
            showStep(2);
        });
    });

    if (nextToStep3Button) {
        nextToStep3Button.addEventListener('click', () => {
            if (selectedRole === 'tutor') {
                showStep(3);
            } else {
                registerForm.submit();
            }
        });
    }

    function showStep(stepNumber) {
        steps.forEach((step, index) => {
            step.classList.toggle('hidden', index !== stepNumber - 1);
        });
    }
});