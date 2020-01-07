const updateUserListTable = () => {
  $.get(window.location.href, function(data) {
    const $data = $(data);
    $("#userListTable").html($data.find("#userListTable > *"));
    $("#userListPagination").html($data.find("#userListPagination > *"));
  });
};

const updateUserDetails = id => {
  $.get(`/users/${id}`, function(data) {
    const $data = $(data);
    $("#userDetails").html($data.find("#userDetails > *"));
    $("#blockStatus").bootstrapToggle();
    $("#userDetails").modal("show");
  });
};

$(document).ready(function() {
  // Event listenter on click table row
  $("#userListTable").on("click", function(e) {
    $target = $(e.target);
    if ($target.prop("tagName") === "TD") {
      updateUserDetails($target.parent().attr("data-id"));
    }
  });

  $("#userDetails").on("click", function(e) {
    e.preventDefault();
    let $target = $(e.target);
    if (
      $target.hasClass("btn btn-danger toggle-off") ||
      $target.hasClass("btn btn-success toggle-on")
    ) {
      $.ajax({
        type: "POST",
        url: `/users/change-status/${$("#userID").val()}`,
        success: function() {
          updateUserListTable();
        },
        error: function() {
          if ($target.hasClass("btn btn-danger toggle-off")) {
            $("#blockStatus").bootstrapToggle("off");
          } else {
            $("#blockStatus").bootstrapToggle("on");
          }
          alert("Thất bại");
        }
      });
    }
  });
});
