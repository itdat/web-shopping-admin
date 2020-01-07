$(document).ready(function() {
  // Event listener on click pagination button
  $("#userListWrapper").on("click", function(e) {
    $target = $(e.target);
    if (
      $target.parent().hasClass("paginationjs-page") ||
      $target.parent().hasClass("paginationjs-prev") ||
      $target.parent().hasClass("paginationjs-next")
    ) {
      e.preventDefault();
      if (!$target.parent().hasClass("disabled")) {
        const targetURL = $target.attr("href");
        try {
          history.pushState({ url: targetURL }, "", targetURL);
          updateUserListTable();
        } catch {
          window.location.href = targetURL;
        }
      }
    }
  });
});
