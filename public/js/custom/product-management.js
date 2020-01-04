function formatAmount(amount) {
  amount = Math.floor(amount / 1000) * 1000 + (amount % 1000 >= 500) * 1000;
  return amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
}

const updateProductListTable = path => {
  $.get(`/products`, function(data) {
    const $data = $(data);
    $("#product-table").html($data.find("#product-table > *"));
  });
};

const updateProductDetailsTable = path => {
  $.get(`/products/${path}`, function(data) {
    const $data = $(data);
    $("#product-details-table").html($data.find("#product-details-table > *"));
  });
};

$(document).ready(function() {
  let scrollTop = $("#product-details-table").offset().top;

  // Event listenter on click table row
  $("#product-table").on("click", function(e) {
    $target = $(e.target);
    if ($target.prop("tagName") === "TD") {
      updateProductDetailsTable($target.parent().attr("data-path"));
      $(".main-panel").animate(
        {
          scrollTop
        },
        800
      );
    }
  });

  $("#product-details").validate({
    rules: { name: "required", brand: "required", promote: "digits" },
    messages: {
      name: "Lỗi: không được để trống",
      brand: "Lỗi: không được để trống",
      promote: "Lỗi: chỉ nhận giá trị từ 0 đến 100"
    }
  });

  // Event listener on submit form
  $("#product-details-table").on("click", function(e) {
    $target = $(e.target);
    if ($target.attr("id") === "submitForm") {
      e.preventDefault();

      let id = $("input#id").val();
      let form = $("form#product-details");
      $.ajax({
        type: "POST",
        url: `products/update/${id}`,
        data: form.serialize(),
        success: function() {
          updateProductListTable();
          alert("Thành công");
        },
        error: function() {
          alert("Thất bại");
        }
      });
    }
  });

  // Event listener on change 'promote' value
  $("#product-details-table").on("input", function(e) {
    $target = $(e.target);
    if ($target.attr("id") === "promote") {
      if (
        $target.val() === "" ||
        validator.isInt($target.val(), { min: 0, max: 100 })
      ) {
        if (
          validator.isCurrency($("input#price").val(), {
            thousands_separator: "."
          })
        ) {
          $("#newPrice").val(
            formatAmount(
              Number(
                $("input#price")
                  .val()
                  .replace(/[^0-9]/g, "")
              ) *
                (1 - Number($target.val()) / 100)
            )
          );
        } else {
          $("#newPrice").val("#Lỗi giá trị");
        }
      } else {
        $("#newPrice").val("#Lỗi giá trị");
      }
    }
  });
});
