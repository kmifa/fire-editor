window.addEventListener("load",init,false);

// google認証情報変数
let userInfo;

function init(){

  // Initialize Firebase
  const config = {
    apiKey: "AIzaSyAeGe0icR3kV1m5vZsgaO5pOOVyhgVk4S8",
    authDomain: "fire-editor-507ff.firebaseapp.com",
    databaseURL: "https://fire-editor-507ff.firebaseio.com",
    projectId: "fire-editor-507ff",
    storageBucket: "fire-editor-507ff.appspot.com",
    messagingSenderId: "258843679002"
  };
  firebase.initializeApp(config);

googleLogin();
postNewChat();
clickChatMenu();

}

var ownEditor;
var ownSession;

var EditSession = require("ace/edit_session").EditSession;

function createFirepad(){

  // Get Firebase Database reference.
  var firepadRef = getRef();

  //// Create ACE
  ownEditor = ace.edit("firepad-container");
  ownEditor.setTheme("ace/theme/textmate");
  

  var ownSession = ownEditor.getSession();
  ownSession.setUseWrapMode(true);
  ownSession.setUseWorker(false);
  ownSession.setMode("ace/mode/javascript");

  // console.log(ace);
  // console.log(ownEditor);

  // 後で
  // var se = new EditSession(ownSession.getDocument(), ownSession.getMode());
  // se.setUseWrapMode(true);

  //// Create Firepad.
  var firepad = Firepad.fromACE(firepadRef, ownEditor, {
    defaultText: '// JavaScript Editing with Firepad!\nfunction go() {\n  var message = "Hello, world.";\n  console.log(message);\n}'
  });

  getOtherRef();

}


//---------------------------------------------------------
//editor edit
//---------------------------------------------------------

$("#select-font-size").on("change",function(){
  let $this = $(this);
  let val = $("#select-font-size option:selected").text();
  let tempVal = parseInt(val,10);

  ownEditor.setFontSize(tempVal);
});

$("#live-preview").on("click",function(){
  let $this = $(this);
  let data = ownEditor.getValue();
  let previewReturn = $("#live-preview-return");

  if($this.hasClass('active')){
    $this.removeClass('active');
    previewReturn.html("");
    previewReturn.removeAttr('style');
    previewReturn.removeClass('active');
  }else{
    $this.addClass('active');
    previewReturn.html("<iframe src=" +
             "data:text/html," + encodeURIComponent(data) +
        "></iframe>");
    previewReturn.addClass('active');
  }

});


//---------------------------------------------------------
//create other editor
//---------------------------------------------------------

function createOtherFirepad(ref){

  var firepadRef = ref;

    //// Create ACE
  var editor = ace.edit("firepad-container-2");
  editor.setTheme("ace/theme/textmate");
  editor.setReadOnly(true);
  
  var session = editor.getSession();
  session.setUseWrapMode(true);
  session.setUseWorker(false);
  session.setMode("ace/mode/javascript");

  //// Create Firepad.
  var firepad = Firepad.fromACE(firepadRef, editor, {
    defaultText: '// JavaScript Editing with Firepad!\nfunction go() {\n  var message = "Hello, world.";\n  console.log(message);\n}'
  });

}

//固有のdatabaseを作成
function createDatabase(){
  var ref = firebase.database().ref();
  var hash = window.location.hash.replace(/#/g, '');

  if(hash){
    ref = ref.child(hash);
  }else{
    ref = ref.push();

    window.location = window.location + "#" + ref.key;
  }

  if(typeof console !== 'undefined'){
    console.log('Firebase data: ', ref.toString());
  }

  return ref;
  
}

function getRef() {
  let ref = createDatabase();
  ref = ref.child('/Editor/' + userInfo.user.displayName);

  return ref;
}


function getOtherRef(){

  let ref = createDatabase();
  let newPostRef = createDatabase();
  let tempData;
  let timer;
  // console.log(newPostRef.key)
  ref = ref.child('/Editor/');
  ref.once("value")
  .then(function(snapshot){
    snapshot.forEach(function(childSnapshot){
      var key = childSnapshot.key;
      var childData = childSnapshot.val();

      if(key === userInfo.user.displayName){
        return false;
      }
      
      newPostRef = newPostRef.child('/Editor/' + key);
      tempData = newPostRef.key;
      
    });
  });

  timer = setInterval(function(){

    if(tempData){
      clearInterval(timer);
      createOtherFirepad(newPostRef);
      
      return;
    }

  },1000);
  
}

// ログイン時にDB登録、誰がオンラインにいるか
function ActiveUser(userName,mail,nowState){
  let newPostRef = createDatabase();

  newPostRef.child('/ActiveUser/' + userName).set({
    mail : mail,
    active : nowState
  });

}


//---------------------------------------------------------
//Googleログイン
//---------------------------------------------------------
function googleLogin(){

  firebase.auth().getRedirectResult().then(function(result){
      userInfo = result;
     if(!result.credential){
         //ログインしていなければ認証画面へリダイレクト
         var provider = new firebase.auth.GoogleAuthProvider();
         firebase.auth().signInWithRedirect(provider);
         return;
     }
     //ログイン成功時の処理
     $("#user_view").html("Login: " + result.user.email);
     $("#username").val(result.user.displayName);
     $("#loading_start").fadeOut(100);
     $("#loading_end").fadeIn(500);

     ActiveUser(result.user.displayName,result.user.email,true);
     createFirepad();

  }).catch(function(error){
     console.log('Error', error);
     //ログイン失敗時の処理
     $("#user_view").html("Login Error.");
  });

}    
//---------------------------------------------------------
//Googleログアウト(機能してない)
//---------------------------------------------------------
function googleLogout(userName,mail,nowState){
  var newPostRef = firebase.database();

  newPostRef.ref('/ActiveUser/' + userName).set({
    mail : mail,
    active : nowState
  });

}

$(document).on("click","#logout",function(){
  googleLogout(userInfo.user.displayName,userInfo.user.email,false);
});


//---------------------------------------------------------
//チャット機能
//---------------------------------------------------------

$(document).on("click","#enter-send",function(){
  let text = $("#enter-text").val();
  writeNewPost(userInfo.user.displayName,text,userInfo.user.photoURL);
});


// チャットに書き込む時
function writeNewPost(userName, text, picture) {

  // Get a key for a new Post.
  let newPostKey = createDatabase();
  newPostKey.child('posts').push({
    author: userName,
    authorText: text,
    authorPic: picture
  });

}

// チャットに書き込まれた値を受取り、反映させる
function postNewChat(){
  let NEWPOSTREF = createDatabase();
  NEWPOSTREF = NEWPOSTREF.child('posts');
  const OUTPUT     = $("#chat-output");
  const ENTERTEXT  = $("#enter-text");

  NEWPOSTREF.on("child_added",function(data){
    let v    = data.val();  //データ取得
    let k    = data.key;    //ユニークKEY取得

    let html = `<li class="chat-post clearfix" id=${k}>
                  <div class="chat-post-pic">
                    <img src="${v.authorPic}" alt="" />
                  </div>
                  <div class="chat-texts-area">
                    <p class="chat-post-text">
                      ${v.authorText}
                    </p>
                    <p class="chat-post-name">
                      ${v.author}
                    </p>
                  </div>
                </li>`;

    OUTPUT.append(html);
    ENTERTEXT.val("");
    
  });
}


//---------------------------------------------------------
//UI
//---------------------------------------------------------
function clickChatMenu(){
  const menu = $(".menu-trigger");
  const chat = $("#chat-area");

  menu.on("click",function(){
    let $this = $(this);
    
    if(menu.hasClass('active')){
      $this.removeClass('active');
      chat.animate({
        right : -300
      },300);

    }else{
      $this.addClass('active');
      chat.animate({
        right : 0
      },300);
    }
  });
}

function clickMenu(){

}