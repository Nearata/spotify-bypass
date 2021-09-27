// ==UserScript==
// @name        Spotify Premium
// @namespace   https://github.com/Nearata
// @match       https://open.spotify.com/*
// @grant       none
// @version     1.0.0
// @author      Nearata
// @description Bypass ads
// @license     MIT
// @run-at      document-end
// ==/UserScript==
(function () {
	let tick = 0
	let clicked = false
	let godown = true

	let songs
	let currentsongtitle
	let currentsongelement

	const observer = new MutationObserver(function () {
		if (tick === 0) {
			tick += 1
			return
		}
		tick -= 1

		const repeatbutton = document.querySelector('.player-controls__right > button:last-child')
		if (repeatbutton === null || repeatbutton.getAttribute('aria-checked') === 'mixed') {
			return
		}

		const stringstart = document.querySelector('.Root__now-playing-bar .playback-bar > div:first-child')
		const stringend = document.querySelector('.Root__now-playing-bar .playback-bar > div:last-child')
		const stringcurrenttitle = document.querySelector("a[data-testid=context-item-link]")

		if (stringstart === null) {
			return
		}

		if (stringend === null) {
			return
		}

		if (stringcurrenttitle === null) {
			return
		}

		const start = parseInt(stringstart.textContent.replace(':', ''))
		const end = parseInt(stringend.textContent.replace(':', '')) - 2

		if (start < 1) {
			return
		}

		songs = document.querySelectorAll("div[data-testid=playlist-tracklist] > div:last-child div[role=row]")

		if (!currentsongelement) {
			for (const s of songs) {
				const stitle = s.querySelector('img').nextSibling.querySelector('div:first-child').textContent
				if (stitle === stringcurrenttitle.textContent) {
					currentsongtitle = stitle
					currentsongelement = s
					break
				}
			}
		}

		if (!currentsongelement) {
			const picked = songs[Math.floor(Math.random() * songs.length)]
			currentsongelement = picked
			currentsongtitle = picked.querySelector('img').nextSibling.querySelector('div:first-child').textContent
		}

		console.log(`${start}:${end}`)

		if (start === end) {
			if (clicked) {
				return
			}

			let iter
			if (godown) {
				iter = currentsongelement.nextSibling

				if (!iter) {
					iter = currentsongelement.previousSibling
					godown = false
				}
			} else {
				iter = currentsongelement.previousSibling

				if (!iter) {
					iter = currentsongelement.nextSibling
					godown = true
				}
			}

			songs = []
			while (iter) {
				songs.push(iter)

				if (godown) {
					iter = iter.nextSibling
				} else {
					iter = iter.previousSibling
				}
			}

			const picked = songs[Math.floor(Math.random() * songs.length)]

			currentsongelement = picked
			currentsongtitle = picked.querySelector('img').nextSibling.querySelector('div:first-child').textContent

			picked.querySelector('div:first-child > div:first-child button').scrollIntoView()
			picked.querySelector('div:first-child > div:first-child button').click()
			clicked = true
		} else {
			clicked = false
		}
	});

	observer.observe(document.body, { childList: true, subtree: true, attributes: true })
})();
