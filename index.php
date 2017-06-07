<!DOCTYPE html>
<html prefix="og: http://ogp.me/ns#" class="no-js">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="format-detection" content="telephone=no">

<title>Fire Editor</title>
<meta name="description" content="">
<meta name="keywords" content="">

<!-- sns -->

<meta property="og:title" content="">
<meta property="og:description" content="">
<meta property="og:type" content="website">
<meta property="og:url" content="">
<meta property="og:image" content="">
<meta property="og:site_name" content="">
<meta property="og:locale" content="ja_JP" />

<meta id="tw-text" property="tw:description" content="テキストが入ります" />

<!-- favicon icon -->

<link rel="icon" sizes="16x16 32x32 48x48 128x128 256x256" href=""> 
<!-- 256pxのfavicon.icoを設定 -->
<link rel="apple-touch-icon" sizes="57x57" href="">
<link rel="apple-touch-icon" sizes="114x114" href="">
<link rel="apple-touch-icon" sizes="72x72" href="">
<link rel="apple-touch-icon" sizes="144x144" href="">
<link rel="apple-touch-icon" sizes="60x60" href="">
<link rel="apple-touch-icon" sizes="120x120" href="">
<link rel="apple-touch-icon" sizes="76x76" href="">
<link rel="apple-touch-icon" sizes="152x152" href="">
<link rel="apple-touch-icon" sizes="180x180" href="">

<!-- styles -->

<link rel="stylesheet" href="css/reset.css">
<link rel="stylesheet" href="css/foundation-icons.css">
<link rel="stylesheet" href="css/main.css">

<!-- scripts -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
<script src="//webrtc.github.io/adapter/adapter-3.1.3.js"></script>
<script type="text/javascript" src="https://cdn.skyway.io/skyway.js"></script>

<script src="https://www.gstatic.com/firebasejs/3.6.2/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/3.6.2/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/3.6.2/firebase-database.js"></script>
<script src="https://www.gstatic.com/firebasejs/3.6.2/firebase-messaging.js"></script>
<script src="https://www.gstatic.com/firebasejs/4.0.0/firebase.js"></script>



  <!-- ACE and its JavaScript mode and theme files -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.5/ace.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.5/mode-javascript.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.5/theme-textmate.js"></script>

  <!-- Firepad -->
  <link rel="stylesheet" href="https://cdn.firebase.com/libs/firepad/1.4.0/firepad.css" />
  <script src="https://cdn.firebase.com/libs/firepad/1.4.0/firepad.min.js"></script>

  <script src="js/genresize.js"></script>

</head>

<body>

<!-- Loading画面 -->
<div id="loading_start" style="height:100%;background-color:#e3f4fd;text-align:center;">
    <img src="img/gia.gif" alt="Loading...">
</div>
<!--/ Loading画面 -->
<!-- コンテンツ表示画面 -->


<header>
<div id="logo">
	<h1>
		Fire Editor
	</h1>
</div>
	

<div class="pure-g">

  <!-- Video area -->
  <div class="pure-u-2-3" id="video-container">
    <div id="their-videos"></div>
    <div>
      <label id="my-label"></label>
      <video id="my-video" muted="true" autoplay></video>
    </div>
  </div>

  <!-- Steps -->
  <div class="pure-u-1-3">

    <div class="select">
      <label for="audioSource">Audio input source: </label><select id="audioSource"></select>
    </div>

    <div class="select">
      <label for="videoSource">Video source: </label><select id="videoSource"></select>
    </div>

    <!-- Get local audio/video stream -->
    <div id="step1">
      <p>Please click `allow` on the top of the screen so we can access your webcam and microphone for calls.</p>
      <div id="step1-error">
        <p>Failed to access the webcam and microphone. Make sure to run this demo on an http server and click allow when asked for permission by the browser.</p>
        <a href="#" class="pure-button pure-button-error" id="step1-retry">Try again</a>
      </div>
    </div>

    <!-- Make calls to others -->
    <div id="step2">
      <h3>Make a call</h3>
      <form id="make-call" class="pure-form">
        <input type="text" placeholder="Join room..." id="join-room">
        <button class="pure-button pure-button-success" type="submit">Join</button>
      </form>
      <!-- <p><strong>Warning:</strong> You may connect with people you don't know if you both use the same room name.</p>
      <p><strong>注意：</strong>同じルーム名を使用した場合、知らない人と接続する可能性があります。</p> -->
    </div>
    <p class="your-id-text">Your id: <span id="my-id">...</span></p>

    <!-- Call in progress -->
    <div id="step3">
      <p>Currently in room <span id="room-id">...</span></p>
      <p><a href="#" class="pure-button pure-button-error" id="end-call">End call</a></p>
    </div>
  </div>
</div>

</header>


<div id="right-area">



<div id="menu">

<div class="menu-inner">
  
  <p id="anke">
    アンケート
  </p>


  <div id="live-preview">
    <div class="fi-eye large"></div>
  </div>

  <select name="" id="select-font-size">
    <option value="">10</option>
    <option value="">12</option>
    <option value="">14</option>
    <option value="">16</option>
    <option value="">18</option>
    <option value="">20</option>
  </select>

	<a class="menu-trigger" href="javascript:void(0)">
		<span></span>
		<span></span>
		<span></span>
	</a>
</div>
</div>

	<div id="firepad-container"></div>
  <div id="firepad-container-2"></div>
	<!-- <div id="editor">some text</div> -->
  <div id="live-preview-return" class="resizeMe"></div>

	<div id="chat-area" class="clearfix">
		<div id="chat-area-inner">
			<div id="chat-output-area">
				<ul id="chat-output">

				</ul>
			</div>
			<div id="enter">
		      <div id="enter-inner">
		        <textarea id="enter-text" cols="30" rows="10"></textarea>
		      <div id="enter-send">SEND</div>
		      </div>
			</div>
		</div>
	</div>

</div>

<!-- Ace API -->
<script src="src/ace.js" type="text/javascript" charset="utf-8"></script>
<script src="js/camera.js"></script>
<script src="js/index.js"></script>
</body>
</html>