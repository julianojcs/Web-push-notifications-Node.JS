console.log('Loaded service worker!');

self.addEventListener('push', ev => {
	const data = ev.data.json();
	console.log('Got push', data);
	self.registration.showNotification(data.title, data.options); //https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
});

self.addEventListener('notificationclick', function (event) {
	console.log('[Service Worker] Notification click Received.');

	if (!event.action) {
		// Was a normal notification click
		console.log('Notification Click.');
		return;
	}

	var selection = '';

	switch (event.action) {
		case 'coffee-action':
			console.log('User ❤️️\'s coffee.');
			selection = "coffee";
			break;
		case 'doughnut-action':
			console.log('User ❤️️\'s doughnuts.');
			selection = "doughnuts";
			break;
		default:
			console.log(`Unknown action clicked: '${event.action}'`);
			break;
	}

	event.notification.close();

	 event.waitUntil(
	 	clients.openWindow('https://www.google.com/search?q=' + selection)
	 );
});