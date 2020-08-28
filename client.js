const publicVapidKey = 'BAN5thccd-J7NOwEXV92lEnJUwQ-EhbUizptshc9cPXRL1qDgCmIfnvOp-mJxdTgOvHc6iIXLai7IDBuxWdGhkM';

if ('serviceWorker' in navigator) {
	console.log('Registering service worker');

	run().catch(error => console.error(error));
}

async function run() {
	console.log('Registering service worker');
	const registration = await navigator.serviceWorker.register('/worker.js', {scope: '/'})
		.then(function (registration) {
			console.log('Service worker successfully registered!');
			return registration;
		})
		.catch(function (err) {
			console.error('Unable to register service worker.', err);
		});

	askPermission();
	subscribeUserToPush();

	console.log('Registering push');
	const subscription = await registration.pushManager.
	subscribe({
		userVisibleOnly: true,
		applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
	});
	console.log('Registered push');

	console.log('Sending push');
	await fetch('/subscribe', {
		method: 'POST',
		body: JSON.stringify(subscription),
		headers: {
			'content-type': 'application/json'
		}
	});
	console.log('Sent push');
}

function subscribeUserToPush() {
	return navigator.serviceWorker.register('/worker.js', {scope: '/'})
		.then(function (registration) {
			const subscribeOptions = {
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
			};

			return registration.pushManager.subscribe(subscribeOptions);
		})
		.then(function (pushSubscription) {
			console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
			return pushSubscription;
		});
}

// Boilerplate borrowed from https://www.npmjs.com/package/web-push#using-vapid-key-for-applicationserverkey
function urlBase64ToUint8Array(base64String) {
	const padding = '='.repeat((4 - base64String.length % 4) % 4);
	const base64 = (base64String + padding)
		.replace(/\-/g, '+')
		.replace(/_/g, '/');

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

function askPermission() {
	return new Promise(function (resolve, reject) {
			const permissionResult = Notification.requestPermission(function (result) {
				resolve(result);
			});

			if (permissionResult) {
				permissionResult.then(resolve, reject);
			}
		})
		.then(function (permissionResult) {
			if (permissionResult !== 'granted') {
				throw new Error('We weren\'t granted permission.');
			}
		});
}