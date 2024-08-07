(() => {
    "use strict";
    const forms = document.querySelectorAll(".needs-validation");
    Array.from(forms).forEach((form) => {
        form.addEventListener(
            "submit",
            (event) => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add("was-validated");
            },
            false
        );
    });
})();


    document.addEventListener('DOMContentLoaded', () => {
        const stars = document.querySelectorAll('.star');
        const ratingInput = document.getElementById('rating');

        stars.forEach(star => {
            star.addEventListener('click', () => {
                const ratingValue = star.getAttribute('data-value');
                ratingInput.value = ratingValue;

                stars.forEach(s => {
                    s.classList.remove('selected');
                    if (s.getAttribute('data-value') <= ratingValue) {
                        s.classList.add('selected');
                    }
                });
            });
        });
    });


    document.addEventListener("DOMContentLoaded", function() {
        var successAlert = document.getElementById('success-alert');
        if (successAlert) {
            setTimeout(function() {
                var alert = new bootstrap.Alert(successAlert);
                alert.close();
            }, 500); // 2000 milliseconds = 2 seconds
        }
    });

        document.addEventListener("DOMContentLoaded", function() {
            var errorAlert = document.getElementById('error-alert');
            if (errorAlert) {
                setTimeout(function() {
                    var alert = new bootstrap.Alert(errorAlert);
                    alert.close();
                }, 500); // 2000 milliseconds = 2 seconds
            }
        });

