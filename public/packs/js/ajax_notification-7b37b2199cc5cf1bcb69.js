!function(t){var e={};function n(o){if(e[o])return e[o].exports;var i=e[o]={i:o,l:!1,exports:{}};return t[o].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(o,i,function(e){return t[e]}.bind(null,i));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/packs/",n(n.s=1)}([,function(t,e){setInterval((function(){var t=document.getElementById("notification_list").dataset.notification,e=new XMLHttpRequest,n=document.getElementById("ul_notification_list"),o=document.getElementById("number-hide");e.onreadystatechange=function(){if(4==this.readyState&&200==this.status&&(data=this.response,data.length>0)){for(var t=data.length-1;t>=0;t--)n.innerHTML='<li><a data-view="'+data[t].notif.view+'" rel="nofollow" data-method="patch" href="/admin/notification/'+data[t].notif.id+'">'+data[t].notif.message+"</a><li>"+n.innerHTML;o.innerHTML=parseInt(o.innerHTML)+data.length,document.getElementById("notification_list").dataset.notification=data[data.length-1].notif.id+1}},e.open("GET","/all/"+t+"/notifications.json",!0),e.responseType="json",e.send()}),1e4)}]);
//# sourceMappingURL=ajax_notification-7b37b2199cc5cf1bcb69.js.map