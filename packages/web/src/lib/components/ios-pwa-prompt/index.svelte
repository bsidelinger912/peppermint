<script lang="ts">
	import { browser } from '$app/environment';
	import PWAPrompt from './components/pwa-prompt.svelte';

	export let timesToShow = 2,
		promptOnVisit = 1,
		permanentlyHideOnDismiss = true,
		copyTitle = 'Add to Home Screen',
		copyBody =
			'This website has app functionality. Add it to your home screen to use it in fullscreen and while offline.',
		copyShareButtonLabel = "1) Press the 'Share' button on the menu bar below.",
		copyAddHomeButtonLabel = "2) Press 'Add to Home Screen'.",
		copyClosePrompt = 'Cancel',
		delay = 1000,
		debug = false,
		onClose = () => {};

	const deviceCheck = () => {
		const isiOS = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
		const isiPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
		const isStandalone = 'standalone' in window.navigator && window.navigator.standalone;

		return (isiOS || isiPadOS) && !isStandalone;
	};

	let shouldRender = false;

	let promptData = browser ? JSON.parse(localStorage.getItem('iosPwaPrompt') as string) : null;

	if (promptData === null && browser) {
		promptData = { isiOS: deviceCheck(), visits: 0 };
		localStorage.setItem('iosPwaPrompt', JSON.stringify(promptData));
	}

	if (promptData?.isiOS || debug) {
		const aboveMinVisits = promptData.visits + 1 >= promptOnVisit;
		const belowMaxVisits = promptData.visits + 1 < promptOnVisit + timesToShow;

		if (belowMaxVisits || debug) {
			localStorage.setItem(
				'iosPwaPrompt',
				JSON.stringify({
					...promptData,
					visits: promptData.visits + 1
				})
			);

			if (aboveMinVisits || debug) {
				shouldRender = true;
			}
		}
	}
</script>

{#if shouldRender}
	<PWAPrompt
		{delay}
		{copyTitle}
		{copyBody}
		{copyAddHomeButtonLabel}
		{copyShareButtonLabel}
		{copyClosePrompt}
		{permanentlyHideOnDismiss}
		{promptData}
		maxVisits={timesToShow + promptOnVisit}
		{onClose}
	/>
{/if}