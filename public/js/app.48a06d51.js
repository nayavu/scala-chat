(function(e){function t(t){for(var a,s,o=t[0],i=t[1],u=t[2],l=0,m=[];l<o.length;l++)s=o[l],Object.prototype.hasOwnProperty.call(r,s)&&r[s]&&m.push(r[s][0]),r[s]=0;for(a in i)Object.prototype.hasOwnProperty.call(i,a)&&(e[a]=i[a]);d&&d(t);while(m.length)m.shift()();return c.push.apply(c,u||[]),n()}function n(){for(var e,t=0;t<c.length;t++){for(var n=c[t],a=!0,o=1;o<n.length;o++){var i=n[o];0!==r[i]&&(a=!1)}a&&(c.splice(t--,1),e=s(s.s=n[0]))}return e}var a={},r={app:0},c=[];function s(t){if(a[t])return a[t].exports;var n=a[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.m=e,s.c=a,s.d=function(e,t,n){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},s.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)s.d(n,a,function(t){return e[t]}.bind(null,a));return n},s.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="/";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],i=o.push.bind(o);o.push=t,o=o.slice();for(var u=0;u<o.length;u++)t(o[u]);var d=i;c.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"0aa3":function(e,t,n){},"211a":function(e,t,n){},"50d4":function(e,t,n){"use strict";n("afd8")},"56d7":function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var a=n("7a23"),r=Object(a["g"])("div",null,[Object(a["g"])("h1",null,"Chat")],-1);function c(e,t,n,c,s,o){var i=Object(a["w"])("the-navigator"),u=Object(a["w"])("user-info"),d=Object(a["w"])("the-notification"),l=Object(a["w"])("router-view");return Object(a["p"])(),Object(a["d"])(a["a"],null,[Object(a["g"])("header",null,[r,Object(a["g"])("div",null,[o.isAuthenticated?(Object(a["p"])(),Object(a["d"])(i,{key:0})):Object(a["e"])("",!0)]),Object(a["g"])("div",null,[o.isAuthenticated?(Object(a["p"])(),Object(a["d"])(u,{key:0})):Object(a["e"])("",!0)])]),Object(a["g"])("main",null,[o.notification?(Object(a["p"])(),Object(a["d"])(d,{key:0,message:o.notification.message,level:o.notification.level},null,8,["message","level"])):Object(a["e"])("",!0),Object(a["g"])(l)])],64)}var s=n("1da1"),o=(n("96cf"),Object(a["C"])("data-v-1c9f89e6"));Object(a["s"])("data-v-1c9f89e6");var i=Object(a["f"])("Chat"),u=Object(a["f"])("Visualization");Object(a["q"])();var d=o((function(e,t,n,r,c,s){var d=Object(a["w"])("router-link");return Object(a["p"])(),Object(a["d"])("nav",null,[Object(a["g"])("ul",null,[Object(a["g"])("li",null,[Object(a["g"])(d,{to:"/chat"},{default:o((function(){return[i]})),_:1})]),Object(a["g"])("li",null,[Object(a["g"])(d,{to:"/visualization"},{default:o((function(){return[u]})),_:1})])])])})),l={name:"TheNavigator"};n("724f");l.render=d,l.__scopeId="data-v-1c9f89e6";var m=l,b=Object(a["C"])("data-v-5b4db464");Object(a["s"])("data-v-5b4db464");var g=Object(a["f"])(" You logged in as ");Object(a["q"])();var f=b((function(e,t,n,r,c,s){return Object(a["p"])(),Object(a["d"])(a["a"],null,[Object(a["g"])("span",null,[g,Object(a["g"])("strong",null,Object(a["y"])(s.nickname),1)]),Object(a["g"])("button",{onClick:t[1]||(t[1]=function(e){return s.logout()})},"Logout")],64)})),p={name:"UserInfo",computed:{nickname:function(){return this.$store.getters["auth/nickname"]}},methods:{logout:function(){var e=this;return Object(s["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.$store.dispatch("auth/logout");case 2:e.$router.push("/");case 3:case"end":return t.stop()}}),t)})))()}}};n("be20");p.render=f,p.__scopeId="data-v-5b4db464";var h=p,O=Object(a["C"])("data-v-56cf6653");Object(a["s"])("data-v-56cf6653");var v={class:"message"};Object(a["q"])();var j=O((function(e,t,n,r,c,s){return Object(a["p"])(),Object(a["d"])("div",v,[Object(a["g"])("span",{class:{error:"error"===n.level}},Object(a["y"])(n.message),3)])})),I={name:"TheNotification",props:["message","level"]};n("d713");I.render=j,I.__scopeId="data-v-56cf6653";var k=I,S={name:"App",components:{TheNotification:k,UserInfo:h,TheNavigator:m},created:function(){var e=this;return Object(s["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.$store.dispatch("auth/loadSession");case 2:case"end":return t.stop()}}),t)})))()},computed:{isAuthenticated:function(){return this.$store.getters["auth/isAuthenticated"]},notification:function(){return this.$store.getters.notification}}};n("f917");S.render=c;var E=S,y=n("6c02"),C=Object(a["C"])("data-v-6faaa7dd");Object(a["s"])("data-v-6faaa7dd");var M={class:"form"},T={class:"form-control"},_=Object(a["g"])("label",{for:"username"},"Username:",-1),w={type:"text",id:"username",ref:"username"},N={key:0,class:"form-message"},R={class:"error"},D=Object(a["g"])("div",{class:"form-buttons"},[Object(a["g"])("button",null,"Login")],-1);Object(a["q"])();var A=C((function(e,t,n,r,c,s){return Object(a["p"])(),Object(a["d"])("div",M,[Object(a["g"])("form",{onSubmit:t[1]||(t[1]=Object(a["B"])((function(){return s.doLogin&&s.doLogin.apply(s,arguments)}),["prevent"]))},[Object(a["g"])("div",T,[_,Object(a["g"])("input",w,null,512)]),c.errorMessage?(Object(a["p"])(),Object(a["d"])("div",N,[Object(a["g"])("span",R,Object(a["y"])(c.errorMessage),1)])):Object(a["e"])("",!0),D],32)])})),U={name:"UserLogin",data:function(){return{errorMessage:null}},methods:{doLogin:function(){var e=this;return Object(s["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,e.$store.dispatch("auth/login",{username:e.$refs.username.value});case 3:e.$router.push("/chat"),t.next=9;break;case 6:t.prev=6,t.t0=t["catch"](0),e.errorMessage=t.t0.message||"Could not login";case 9:case"end":return t.stop()}}),t,null,[[0,6]])})))()}}};n("db1e");U.render=A,U.__scopeId="data-v-6faaa7dd";var x=U,L=Object(a["C"])("data-v-19179727");Object(a["s"])("data-v-19179727");var B={class:"chat-box"},P={class:"chat-members-list"},$={class:"chat-conversation"};Object(a["q"])();var G=L((function(e,t,n,r,c,s){var o=Object(a["w"])("chat-members-list"),i=Object(a["w"])("chat-conversation");return Object(a["p"])(),Object(a["d"])("div",B,[Object(a["g"])("div",P,[Object(a["g"])(o,{"target-user-id":c.targetUserId,"onUpdate:target-user-id":t[1]||(t[1]=function(e){return c.targetUserId=e})},null,8,["target-user-id"])]),Object(a["g"])("div",$,[s.targetUser?(Object(a["p"])(),Object(a["d"])(i,{key:0,"target-user":s.targetUser,disabled:s.disabled},null,8,["target-user","disabled"])):Object(a["e"])("",!0)])])})),q=Object(a["C"])("data-v-027a560a");Object(a["s"])("data-v-027a560a");var V={key:0};Object(a["q"])();var Y=q((function(e,t,n,r,c,s){return Object(a["p"])(),Object(a["d"])(a["a"],null,[Object(a["g"])("ul",null,[(Object(a["p"])(!0),Object(a["d"])(a["a"],null,Object(a["v"])(s.membersList,(function(e){return Object(a["p"])(),Object(a["d"])("li",{key:e.id,class:{online:e.onlineSince,offline:!e.onlineSince,selected:e.userId===n.targetUserId},onClick:function(t){return s.selectMember(e.userId)},title:s.getOnlineStatus(e)},Object(a["y"])(e.nickname),11,["onClick","title"])})),128))]),s.membersList.length?Object(a["e"])("",!0):(Object(a["p"])(),Object(a["d"])("p",V,"No other chat members"))],64)})),F=(n("07ac"),{name:"ChatMembers",emits:["update:targetUserId"],props:["targetUserId"],computed:{membersList:function(){return Object.values(this.$store.getters["chat/members"]).sort()}},methods:{selectMember:function(e){this.$emit("update:targetUserId",e)},getOnlineStatus:function(e){return e.onlineSince?"Online since "+new Date(e.onlineSince).toLocaleDateString():"Offline"}}});n("f70c");F.render=Y,F.__scopeId="data-v-027a560a";var J=F,z=Object(a["C"])("data-v-4f41dac9");Object(a["s"])("data-v-4f41dac9");var W={class:"chat-conversation-box"},K={class:"chat-messages-list"},H={class:"chat-notification"},Q={class:"chat-input"};Object(a["q"])();var X=z((function(e,t,n,r,c,s){var o=Object(a["w"])("chat-messages-list"),i=Object(a["w"])("chat-notification"),u=Object(a["w"])("chat-input");return Object(a["p"])(),Object(a["d"])("div",W,[Object(a["g"])("div",K,[Object(a["g"])(o,{"target-user-id":n.targetUser.userId},null,8,["target-user-id"])]),Object(a["g"])("div",H,[Object(a["g"])(i,{notification:s.notification},null,8,["notification"])]),Object(a["g"])("div",Q,[Object(a["g"])(u,{"target-user-id":n.targetUser.userId,disabled:n.disabled},null,8,["target-user-id","disabled"])])])})),Z=Object(a["C"])("data-v-74c22879");Object(a["s"])("data-v-74c22879");var ee={class:"timestamp"},te=Object(a["g"])("span",{class:"placeholder"},null,-1);Object(a["q"])();var ne=Z((function(e,t,n,r,c,s){return Object(a["p"])(),Object(a["d"])("ul",null,[(Object(a["p"])(!0),Object(a["d"])(a["a"],null,Object(a["v"])(s.messagesList,(function(e){return Object(a["p"])(),Object(a["d"])("li",{key:e.messageId,class:{"our-message":e.isOur,"their-message":!e.isOur,undelivered:!e.delivered}},[Object(a["g"])("span",ee,Object(a["y"])(s.formatTimestamp(e.timestamp)),1),te,Object(a["f"])(" "+Object(a["y"])(e.message),1)],2)})),128))])})),ae=n("5530"),re=(n("d81d"),{name:"ChatMessagesList",props:["targetUserId"],computed:{messagesList:function(){var e=this.$store.getters["auth/userId"],t=this.$store.getters["chat/messages"][this.targetUserId];if(t)return t.map((function(t){return Object(ae["a"])(Object(ae["a"])({},t),{},{isOur:t.senderId===e})}))}},methods:{formatTimestamp:function(e){return new Date(e).toLocaleString()}}});n("ce36");re.render=ne,re.__scopeId="data-v-74c22879";var ce=re,se=Object(a["C"])("data-v-500ef9f2"),oe=se((function(e,t,n,r,c,s){return Object(a["p"])(),Object(a["d"])("form",{onSubmit:t[3]||(t[3]=Object(a["B"])((function(e){return s.submit()}),["prevent"]))},[Object(a["g"])("input",{type:"text",ref:"message",onBlur:t[1]||(t[1]=function(e){return s.blur()}),onKeypress:t[2]||(t[2]=function(e){return s.keypress()}),disabled:n.disabled},null,40,["disabled"]),Object(a["g"])("button",{disabled:n.disabled},"Send",8,["disabled"])],32)})),ie={name:"ChatInput",props:["targetUserId","disabled"],data:function(){return{isTyping:!1,sendingMessage:!1}},methods:{submit:function(){var e=this;return Object(s["a"])(regeneratorRuntime.mark((function t(){var n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:n=e.$store.getters["auth/userId"],e.$store.dispatch({type:"chat/addMessage",senderId:n,recipientId:e.targetUserId,message:e.$refs.message.value}),e.$refs.message.value=null,e.isTyping=!1;case 4:case"end":return t.stop()}}),t)})))()},blur:function(){if(this.isTyping){this.isTyping=!1;var e=this.$store.getters["auth/userId"];this.$store.dispatch("chat/notifyMemberStoppedTyping",{senderId:e,recipientId:this.targetUserId})}},keypress:function(){if(!this.isTyping){this.isTyping=!0;var e=this.$store.getters["auth/userId"];this.$store.dispatch("chat/notifyMemberStartedTyping",{senderId:e,recipientId:this.targetUserId})}}}};n("b414");ie.render=oe,ie.__scopeId="data-v-500ef9f2";var ue=ie,de=Object(a["C"])("data-v-12c8c902"),le=de((function(e,t,n,r,c,s){return Object(a["p"])(),Object(a["d"])("span",null,Object(a["y"])(n.notification),1)})),me={name:"ChatNotification",props:["notification"]};n("eb5c");me.render=le,me.__scopeId="data-v-12c8c902";var be=me,ge={name:"ChatConversation",components:{ChatNotification:be,ChatInput:ue,ChatMessagesList:ce},props:["targetUser","disabled"],computed:{notification:function(){var e=this.$store.getters["chat/memberActions"][this.targetUser.userId];return"typing"==e?"".concat(this.targetUser.nickname," is typing"):null}}};n("50d4");ge.render=X,ge.__scopeId="data-v-4f41dac9";var fe=ge,pe={name:"ChatBox",components:{ChatConversation:fe,ChatMembersList:J},data:function(){return{targetUserId:null}},computed:{targetUser:function(){return this.$store.getters["chat/members"][this.targetUserId]},disabled:function(){var e;return!this.$store.getters["chat/connected"]||!(null!==(e=this.targetUser)&&void 0!==e&&e.onlineSince)}},created:function(){this.$store.dispatch("chat/loadMembers")}};n("dcab");pe.render=G,pe.__scopeId="data-v-19179727";var he=pe,Oe=Object(a["C"])("data-v-23acef96"),ve=Oe((function(e,t,n,r,c,s){return Object(a["p"])(),Object(a["d"])("div")})),je={name:"MessagesVisualization"};je.render=ve,je.__scopeId="data-v-23acef96";var Ie=je,ke=n("5502"),Se=n("d4ec"),Ee=n("bee2"),ye=(n("d3b7"),"/api/auth"),Ce=function(){function e(){Object(Se["a"])(this,e)}return Object(Ee["a"])(e,[{key:"login",value:function(e){return fetch(ye+"/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e})}).then((function(e){return e.ok?e.json():e.json().then((function(e){throw new Error(e.message||"Server communication failed")}))}))}},{key:"logout",value:function(e){return fetch(ye+"/logout",{method:"POST",headers:{Authorization:e}}).then((function(e){if(e.ok)return e}))}}]),e}(),Me=n("ade3"),Te=(n("99af"),"/api/members"),_e=function(){function e(){Object(Se["a"])(this,e),Object(Me["a"])(this,"newMessageCallback",null),Object(Me["a"])(this,"messageDeliveredCallback",null),Object(Me["a"])(this,"memberStateChangedCallback",null),Object(Me["a"])(this,"memberStartedTypingCallback",null),Object(Me["a"])(this,"memberStoppedTypingCallback",null),Object(Me["a"])(this,"connectedCallback",null),Object(Me["a"])(this,"disconnectedCallback",null),Object(Me["a"])(this,"errorCallback",null),Object(Me["a"])(this,"socket",null)}return Object(Ee["a"])(e,[{key:"connect",value:function(e,t){var n=this;null!=e&&(this.socket=new WebSocket(e,t),this.socket.onopen=function(){console.log("Chat socket connected"),n.connectedCallback&&n.connectedCallback()},this.socket.onclose=function(e){e.wasClean?console.log("Chat socket disconnected"):console.error("Chat socket terminated, code="+e.code+", reason: "+e.reason),n.disconnectedCallback&&n.disconnectedCallback()},this.socket.onmessage=function(e){var t=JSON.parse(e.data);switch(t.type){case"NEW_MESSAGE":console.log("Received NEW_MESSAGE",t.data),n.newMessageCallback&&n.newMessageCallback({messageId:t.data.messageId,senderId:t.data.senderId,recipientId:t.data.recipientId,message:t.data.message,timestamp:t.data.timestamp,delivered:t.data.delivered});break;case"MESSAGE_DELIVERED":console.log("Received MESSAGE_DELIVERED",t.data),n.messageDeliveredCallback&&n.messageDeliveredCallback({messageId:t.data.messageId,recipientId:t.data.recipientId,timestamp:t.data.timestamp});break;case"MEMBER_CONNECTED":console.log("Received MEMBER_CONNECTED",t.data),n.memberStateChangedCallback&&n.memberStateChangedCallback({userId:t.data.userId,nickname:t.data.nickname,onlineSince:t.data.onlineSince,state:"connected"});break;case"MEMBER_DISCONNECTED":console.log("Received MEMBER_DISCONNECTED",t.data),n.memberStateChangedCallback&&n.memberStateChangedCallback({userId:t.data.userId,state:"disconnected"});break;case"MEMBER_LEFT":console.log("Received MEMBER_LEFT",t.data),n.memberStateChangedCallback&&n.memberStateChangedCallback({userId:t.data.userId,state:"left"});break;case"MEMBER_STARTED_TYPING":console.log("Received MEMBER_STARTED_TYPING",t.data),n.memberStartedTypingCallback&&n.memberStartedTypingCallback({userId:t.data.userId});break;case"MEMBER_STOPPED_TYPING":console.log("Received MEMBER_STOPPED_TYPING",t.data),n.memberStoppedTypingCallback&&n.memberStoppedTypingCallback({userId:t.data.userId});break;default:console.warn("Could not identify message",t)}},this.socket.onerror=function(e){console.error("Chat socket failed",e),n.errorCallback&&n.errorCallback(e)})}},{key:"disconnect",value:function(){this.socket.close(),console.log("Chat socket disconnected")}},{key:"loadMembers",value:function(e){return console.log("Loading chat members list"),fetch(Te,{headers:{Authorization:e}}).then((function(e){return e.ok?e.json():e.json().then((function(e){throw new Error(e.message||"Server communication failed")}))}))}},{key:"sendMessage",value:function(e){console.log("Sending message from ".concat(e.senderId," to ").concat(e.recipientId)),this.checkSocket()&&this.socket.send(JSON.stringify({type:"SEND_MESSAGE",data:{messageId:e.messageId,senderId:e.senderId,recipientId:e.recipientId,message:e.message}}))}},{key:"notifyMemberStartedTyping",value:function(e,t){console.log("Member ".concat(e," started typing to ").concat(t)),this.checkSocket()&&(console.log("Sending MEMBER_STARTED_TYPING"),this.socket.send(JSON.stringify({type:"MEMBER_STARTED_TYPING",data:{senderId:e,recipientId:t}})))}},{key:"notifyMemberStoppedTyping",value:function(e,t){console.log("Member ".concat(e," stopped typing to ").concat(t)),this.checkSocket()&&this.socket.send(JSON.stringify({type:"MEMBER_STOPPED_TYPING",data:{senderId:e,recipientId:t}}))}},{key:"checkSocket",value:function(){return!(!this.socket||1!==this.socket.readyState)||(console.error("Web socket is not opened"),!1)}},{key:"onNewMessage",value:function(e){return this.newMessageCallback=e,this}},{key:"onMessageDelivered",value:function(e){return this.messageDeliveredCallback=e,this}},{key:"onMemberStateChanged",value:function(e){return this.memberStateChangedCallback=e,this}},{key:"onMemberStartedTyping",value:function(e){return this.memberStartedTypingCallback=e,this}},{key:"onMemberStoppedTyping",value:function(e){return this.memberStoppedTypingCallback=e,this}},{key:"onConnected",value:function(e){return this.connectedCallback=e,this}},{key:"onDisconnected",value:function(e){return this.disconnectedCallback=e,this}},{key:"onError",value:function(e){return this.errorCallback=e,this}}]),e}(),we=new Ce,Ne=new _e,Re={namespaced:!0,state:function(){return{userId:null,nickname:null,chatSocketUrl:null,token:null}},mutations:{SET_SESSION:function(e,t){var n,a;e.userId=null===t||void 0===t||null===(n=t.member)||void 0===n?void 0:n.userId,e.nickname=null===t||void 0===t||null===(a=t.member)||void 0===a?void 0:a.nickname,e.token=null===t||void 0===t?void 0:t.token,e.chatSocketUrl=null===t||void 0===t?void 0:t.chatSocketUrl}},actions:{loadSession:function(e){return Object(s["a"])(regeneratorRuntime.mark((function t(){var n,a,r,c;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(n=localStorage.getItem("userId"),a=localStorage.getItem("nickname"),r=localStorage.getItem("token"),c=localStorage.getItem("chatSocketUrl"),n&&a&&r&&c){t.next=9;break}if(!(n||a||r||c)){t.next=8;break}return t.next=8,e.dispatch("clearSession");case 8:return t.abrupt("return",null);case 9:e.commit("SET_SESSION",{member:{userId:n,nickname:a},token:r,chatSocketUrl:c}),Ne.connect(e.state.chatSocketUrl,e.state.token);case 11:case"end":return t.stop()}}),t)})))()},clearSession:function(){localStorage.removeItem("userId"),localStorage.removeItem("nickname"),localStorage.removeItem("token"),localStorage.removeItem("chatSocketUrl")},logout:function(e){return Object(s["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return console.log("Logging out"),Ne.disconnect(),t.next=4,we.logout(e.state.token);case 4:return console.log("cleaing session"),e.commit("SET_SESSION",null),t.next=8,e.dispatch("clearSession");case 8:case"end":return t.stop()}}),t)})))()},login:function(e,t){return Object(s["a"])(regeneratorRuntime.mark((function n(){var a,r;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return a=t.username,console.log("Logging in as ".concat(a)),n.next=4,we.login(a);case 4:r=n.sent,e.commit("SET_SESSION",r),Ne.connect(e.state.chatSocketUrl,e.state.token),localStorage.setItem("userId",e.state.userId),localStorage.setItem("nickname",e.state.nickname),localStorage.setItem("token",e.state.token),localStorage.setItem("chatSocketUrl",e.state.chatSocketUrl);case 11:case"end":return n.stop()}}),n)})))()}},getters:{isAuthenticated:function(e){return!!e.userId},userId:function(e){return e.userId},nickname:function(e){return e.nickname},token:function(e){return e.token}}};n("25f0");function De(e,t,n){if(!e.messages[t])return console.warn("No conversation with ".concat(t)),null;for(var a=e.messages[t].length-1;a>=0;a--)if(e.messages[t][a].messageId===n)return a;return console.warn("No message with id=".concat(n," in conversation with ").concat(t)),null}var Ae={namespaced:!0,state:function(){return{members:{},memberActions:{},messages:{},connected:!1}},mutations:{RECEIVE_MESSAGE:function(e,t){var n=t.senderId;e.messages[n]||(e.messages[n]=[]),e.messages[n].push(t)},ADD_MESSAGE:function(e,t){var n=t.recipientId;e.messages[n]||(e.messages[n]=[]),e.messages[n].push(Object(ae["a"])(Object(ae["a"])({},t),{},{delivered:!1}))},CONFIRM_DELIVERY:function(e,t){var n=t.recipientId,a=De(e,n,t.messageId);null!=a&&(e.messages[n][a].delivered=!0,e.messages[n][a].timestamp=t.timestamp)},SET_MEMBERS:function(e,t){e.members=t},UPDATE_MEMBER:function(e,t){var n=e.members[t.userId]||{};e.members[t.userId]=Object(ae["a"])(Object(ae["a"])({},n),t)},REMOVE_MEMBER:function(e,t){delete e.members[t.userId],delete e.memberActions[t.userId]},SET_MEMBER_ACTION:function(e,t){e.memberActions[t.userId]=t.action},SET_CONNECTED_STATE:function(e,t){e.connected=t}},getters:{members:function(e){return e.members},memberActions:function(e){return e.memberActions},messages:function(e){return e.messages},connected:function(e){return e.connected}},actions:{loadMembers:function(e){return Object(s["a"])(regeneratorRuntime.mark((function t(){var n,a,r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return n=e.rootGetters["auth/token"],t.next=3,Ne.loadMembers(n);case 3:a=t.sent,r=a.reduce((function(e,t){return e[t.userId]=t,e}),{}),e.commit("SET_MEMBERS",r);case 6:case"end":return t.stop()}}),t)})))()},updateMember:function(e,t){switch(t.state){case"connected":e.commit("UPDATE_MEMBER",{userId:t.userId,nickname:t.nickname,onlineSince:t.onlineSince});break;case"disconnected":e.commit("UPDATE_MEMBER",{userId:t.userId,onlineSince:null});break;case"left":e.commit("REMOVE_MEMBER",{userId:t.userId});break}},memberStartedTyping:function(e,t){e.commit("SET_MEMBER_ACTION",{userId:t.userId,action:"typing"})},memberStoppedTyping:function(e,t){e.commit("SET_MEMBER_ACTION",{userId:t.userId,action:null})},receiveMessage:function(e,t){e.commit("RECEIVE_MESSAGE",t),e.commit("SET_MEMBER_ACTION",{userId:t.senderId,action:null})},addMessage:function(e,t){var n=Object(ae["a"])(Object(ae["a"])({},t),{},{messageId:Date.now().toString()+window.performance.now(),timestamp:Date.now()});e.commit("ADD_MESSAGE",n)},confirmDelivery:function(e,t){e.commit("CONFIRM_DELIVERY",t)},setSocketConnected:function(e){e.commit("SET_CONNECTED_STATE",!0)},setSocketDisconnected:function(e){var t=e.state.connected;e.commit("SET_CONNECTED_STATE",!1),t?e.commit("SET_NOTIFICATION",{message:"Server connection lost",level:"error"},{root:!0}):e.commit("SET_NOTIFICATION",null,{root:!0})},notifyMemberStartedTyping:function(e,t){Ne.notifyMemberStartedTyping(t.senderId,t.recipientId)},notifyMemberStoppedTyping:function(e,t){Ne.notifyMemberStoppedTyping(t.senderId,t.recipientId)},socketError:function(e){e.state.connected||(console.log("Forcing logging out"),e.dispatch("auth/logout",null,{root:!0}))}}};function Ue(){return function(e){Ne.onNewMessage((function(t){e.dispatch("chat/receiveMessage",t)})).onMessageDelivered((function(t){e.dispatch("chat/confirmDelivery",t)})).onMemberStateChanged((function(t){e.dispatch("chat/updateMember",t)})).onMemberStartedTyping((function(t){e.dispatch("chat/memberStartedTyping",t)})).onMemberStoppedTyping((function(t){e.dispatch("chat/memberStoppedTyping",t)})).onConnected((function(){e.dispatch("chat/setSocketConnected")})).onDisconnected((function(){e.dispatch("chat/setSocketDisconnected")})).onError((function(){e.dispatch("chat/socketError")})),e.subscribe((function(e,t){"chat/ADD_MESSAGE"===e.type&&t.chat.connected&&Ne.sendMessage(e.payload)}))}}var xe=Ue(),Le=Object(ke["a"])({modules:{auth:Re,chat:Ae},plugins:[xe],state:{notification:null},mutations:{SET_NOTIFICATION:function(e,t){e.notification=t}},getters:{notification:function(e){return e.notification}},actions:{setNotification:function(e,t){e.commit("SET_NOTIFICATION",t)}}}),Be=Le,Pe=Object(y["a"])({history:Object(y["b"])(),routes:[{path:"/",redirect:"/login"},{path:"/login",component:x,meta:{requiresNotLoggedIn:!0}},{path:"/chat",component:he,meta:{requiresLoggedIn:!0}},{path:"/visualization",component:Ie,meta:{requiresLoggedIn:!0}}]});Pe.beforeEach((function(e,t,n){e.meta.requiresLoggedIn&&!Be.getters["auth/isAuthenticated"]?n("/login"):e.meta.requiresNotLoggedIn&&Be.getters["auth/isAuthenticated"]?n("/chat"):n()}));var $e=Pe,Ge=Object(a["c"])(E);Ge.use($e),Ge.use(Be),Ge.mount("#app")},"5cb6":function(e,t,n){},"65f4":function(e,t,n){},"6d1f":function(e,t,n){},"724f":function(e,t,n){"use strict";n("5cb6")},9645:function(e,t,n){},afd8:function(e,t,n){},b414:function(e,t,n){"use strict";n("c746")},bdee:function(e,t,n){},be20:function(e,t,n){"use strict";n("65f4")},c1fd:function(e,t,n){},c746:function(e,t,n){},c86e:function(e,t,n){},ce36:function(e,t,n){"use strict";n("211a")},d713:function(e,t,n){"use strict";n("c86e")},db1e:function(e,t,n){"use strict";n("0aa3")},dcab:function(e,t,n){"use strict";n("bdee")},eb5c:function(e,t,n){"use strict";n("c1fd")},f70c:function(e,t,n){"use strict";n("6d1f")},f917:function(e,t,n){"use strict";n("9645")}});
//# sourceMappingURL=app.48a06d51.js.map