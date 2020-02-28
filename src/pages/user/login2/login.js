// require(["jquery","request","storejs"],function ($,request,store) {

//     document.onkeydown = function (event) {
//         var e = event || window.event || arguments.callee.caller.arguments[0];
//         if (e && e.keyCode === 13) {
//             doLogin();
//         }
//     };

//     $("#doLogin").on("click", doLogin);

//     function doLogin() {
//         var username = $("#username").val();
//         var password = $("#password").val();

//         if (!username) {
//             $("#username").focus();
//             return;
//         }
//         if (!password) {
//             $("#password").focus();
//             return;
//         }
//         request.post("authorize/login", {
//             token_type: "default",
//             username: username,
//             password: password
//         }, function (e) {
//             if (e.status === 200) {
//                 store.set("X-Access-Token", e.result.token);
//                 $("#password").val("");
//                 if (window.loginCallback) {
//                     window.loginCallback();
//                 }else{
//                     window.location.href=window.BASE_PATH+"admin/index.html"
//                 }

//             } else {
//                 alert(e.message);
//             }
//         });

//     }
// })
