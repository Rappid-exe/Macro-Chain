// Workflow mock buttons — prevent default and add pressed state
document.querySelectorAll('.workflow-btn').forEach(function (btn) {
  btn.addEventListener('click', function (event) {
    event.preventDefault();
  });

  btn.addEventListener('mousedown', function () {
    btn.classList.add('is-pressed');
  });

  btn.addEventListener('mouseup', function () {
    btn.classList.remove('is-pressed');
  });

  btn.addEventListener('mouseleave', function () {
    btn.classList.remove('is-pressed');
  });
});
