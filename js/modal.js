$(function() {


  //modal

  var modal = {},
      $lay,
      $content;

  modal.inner = function() {
    if ($("#modal-overlay")[0]) return false;

    $("body").append('<div id="modal-overlay"></div>');

    $lay = $("#modal-overlay");
    $content = $("#modal-content");

    $lay.fadeIn("slow");

    this.resize();

    $content.fadeIn("slow");

    $lay.unbind().click(function() {
      
      $content.add($lay).fadeOut("slow", function() {
        $lay.remove();
      });
    });
  };

  modal.resize = function() {
    var w = $(window).width();
    var h = $(window).height();

    var cw = $("#modal-content").outerWidth();
    var ch = $("#modal-content").outerHeight();

    $("#modal-content").css({
      "left": ((w - cw) / 2) + "px",
      "top": ((h - ch) / 2) + "px"
    });
  }



  $("#anke").click(function() {
    modal.inner();
  });


  $(window).resize(modal.resize);



});