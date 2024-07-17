function generateEncryptionKey(password, salt, iterations) {
	const encryptionKey = CryptoJS.PBKDF2(password, salt, {
		keySize: 256 / 32,
		iterations: iterations
	});
	return encryptionKey;
}

function encrypt() {
	const plaintext = document.getElementById('plaintext').value;
	const password = document.getElementById('password').value;
	const iterations = parseInt(document.getElementById('iterations').value);
	const salt = CryptoJS.lib.WordArray.random(16);
	const encryptionKey = generateEncryptionKey(password, salt, iterations);
	const iv = CryptoJS.lib.WordArray.random(16);
	const encrypted = CryptoJS.AES.encrypt(plaintext, encryptionKey, {iv: iv}).toString();
	let ciphertext = iterations.toString() + '$';
	ciphertext += CryptoJS.enc.Base64.stringify(salt) + '$';
	ciphertext += encrypted + '$';
	ciphertext += CryptoJS.enc.Base64.stringify(iv);
	document.getElementById('ciphertext').value = ciphertext;
}

function decrypt() {
	const ciphertext = document.getElementById('ciphertext').value;
	const password = document.getElementById('password').value;
	const ciphertext_l = ciphertext.split('$');    
	const iterations = parseInt(ciphertext_l[0]);
	const salt = CryptoJS.enc.Base64.parse(ciphertext_l[1]);
	const encryptionKey = generateEncryptionKey(password, salt, iterations);
	const encrypted = ciphertext_l[2];
	const iv = CryptoJS.enc.Base64.parse(ciphertext_l[3]);
	const plaintext = CryptoJS.AES.decrypt(encrypted, encryptionKey, {iv: iv}).toString(CryptoJS.enc.Utf8);
	document.getElementById('plaintext').value = plaintext;
	document.getElementById('iterations').value = iterations;
	document.getElementById('iterations-display').textContent = iterations;
}

function copy(btn, id) {
	navigator.clipboard.writeText(document.getElementById(id).value).then(() => {
		btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14 8H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2V10c0-1.103-.897-2-2-2z"></path><path d="M20 2H10a2 2 0 0 0-2 2v2h8a2 2 0 0 1 2 2v8h2a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"></path></svg>';
		setTimeout(() => {
			btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H10c-1.103 0-2 .897-2 2v4H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2v-4h4c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zM4 20V10h10l.002 10H4zm16-6h-4v-4c0-1.103-.897-2-2-2h-4V4h10v10z"></path></svg>';
		}, '1000');
	});
}

function setIterations() {
	const iterations = document.getElementById('iterations').value;
	document.getElementById('iterations-display').textContent = iterations;
}

setIterations();