$(function() {
  $(".upload-img").on("change", function() {
    var files = !!this.files ? this.files : [];
    if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support

    if (/^image/.test(files[0].type)) {
      // only image file
      var reader = new FileReader(); // instance of the FileReader
      reader.readAsDataURL(files[0]); // read the local file

      reader.onload = function(e) {
        // set image data as background of div

        $("#img-preview-block").css({
          "background-image": "url(" + e.target.result + ")",
          "background-size": "cover"
        });
      };
    }
  });
});

$("#updateProfile").on("click", function(e) {
  e.preventDefault();

  let form = $("form#profileForm");
  $.ajax({
    type: "POST",
    url: "/profile/update",
    data: form.serialize(),
    success: function() {
      alert("Thành công");
    },
    error: function() {
      alert("Thất bại");
    }
  });
});
