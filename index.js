const express = require('express');
const webpush = require('web-push');

const vapidKeys = {
	publicKey: 'BAN5thccd-J7NOwEXV92lEnJUwQ-EhbUizptshc9cPXRL1qDgCmIfnvOp-mJxdTgOvHc6iIXLai7IDBuxWdGhkM',
	privateKey: 'WoCot_HubqAbYBywdQP_jVg9XdDWT6rpOWSIPpt0JbI'
};
webpush.setVapidDetails(
	'mailto:apfjuliano@gmail.com',
	vapidKeys.publicKey,
	vapidKeys.privateKey
);

const app = express();

// app.use('/healthcheck', require('express-healthcheck')({
//     healthy: function () {
//         return { everything: 'is ok' };
//     }
// }));

app.use(require('body-parser').json());

app.post('/subscribe', (req, res) => {
	const subscription = req.body;
	res.status(201).json({});
	const dataToSend = JSON.stringify({
		title: 'Cashier:',
		options: {
			body: 'What do you want?',
			icon: 'https://lh3.googleusercontent.com/DKoidc0T3T1KvYC2stChcX9zwmjKj1pgmg3hXzGBDQXM8RG_7JjgiuS0CLOh8DUa7as',
			requireInteraction: false,
			silent: false,
			vibrate: [200, 100, 200, 100, 200, 100, 200],
			tag: 'Payment',
			actions: [{
					action: 'coffee-action',
					title: 'Coffee',
					icon: '/images/coffee.png'
				},
				{
					action: 'doughnut-action',
					title: 'Doughnut',
					icon: '/images/doughnuts.png'
				}
			]
		}
	});

	console.log(subscription);

	webpush.sendNotification(subscription, dataToSend).catch(error => {
		console.error(error.stack);
	});
});

//app.use(require('express-static')('./'));
app.use(express.static('./'));
app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next()
}).listen(3000, () => console.log('Web Push app listening on port 3000!'))