var chat = {};
var socket = io();

chat.messages = Array;

chat.vm = new function () {
	var vm = {};
	vm.init = function () {
		vm.list = new chat.messages();
		vm.username = m.prop("");
		vm.msg = m.prop("");
		vm.send = function () {
			if (!vm.username()) {
				alert('Please type your name!');
			} else if (vm.msg()) {
				socket.emit('send', {message: vm.msg(), name: vm.username()});
				vm.msg("");
			}
		};
		vm.listen = (function () {
					m.startComputation();
					socket.on('message', function (data) {
						try {
							if (data.message) {
								vm.list.push(data);
							}
						} catch (e) {
							alert('There is a problem:', e);
						} finally {
							m.endComputation();
						}
					});
				}) ()
	}
	return vm;
}

chat.controller = function () {
	chat.vm.init();
}

chat.view = function (ctrl) {
	return m("section", 
		m("h1", "Node Express Socket.io Mithril"),
		m("h4", "------------------------ Javascript all the way ------------------------"),
			[m("div.conversation",[
				chat.vm.list.map(function (msg, i) {
					return m('div', 
						m('b', (msg.name? msg.name:'Server' )+': '),
						m('span', msg.message)
						)
				})]),
			m("div", "Name: ",
				[m("input.chat", {onchange: m.withAttr("value", chat.vm.username), value: chat.vm.username()})]),
			m("br"),
			m("input.chat", {onchange: m.withAttr("value", chat.vm.msg), value: chat.vm.msg()}),
			m("button", {onclick: chat.vm.send}, "Send")]
		);
}

m.module(document.body, {controller: chat.controller, view: chat.view})