+++
title = "Which browser cares about privacy the most?"
description = "Comparison of privacy features in Chrome, Firefox, and Brave browsers"
date = "2025-03-23T16:14:23-07:00"
draft = false
tags = ["privacy", "browsers"]
topics = ["tech-explorations"]
+++

I stopped using Chrome a long time ago due to privacy concerns, and I've been switching between Firefox, Edge, and occasionally Brave. But I never spent the time to fully compare these browsers and analyze which one best suits my needs. Today, I decided to look deeply into these browsers and ended up going down a rabbit hole of researching their privacy features.

**Why is this important?** Every time we browse a website, we are sharing bits of our digital life with companies we don't know. These companies collect vast amounts of data about our browsing habits, preferences, and personal information.  It is so cringy and annoying to see YouTube showing a 'suggested video' of the dental procedure that you searched about and are planning to get done. The browser you choose plays a significant role in how much of your data is collected and shared.

This post summarizes my findings about privacy features in three popular browsers - [Google Chrome](https://www.google.com/chrome/), [Mozilla Firefox](https://www.mozilla.org/en-US/firefox/) and [Brave](https://brave.com/). This analysis isn't comprehensive, but it covers the key privacy aspects that helped me make my decision. If you have seen similar or more information, please share them in the  comments. There is always room to learn. I hope this helps anyone who is evaluating their own browser choices.

## 1. Browsing data synchronization
This is the feature where the browsing data (bookmarks, history, passwords, preferences etc.) can be kept in sync across multiple devices (laptop, phone etc.). 
- **Google** implements this by asking the user to login to their Google account and updates the server copy whenever there are changes in any of the devices. It also stores all the browsing data on Google servers.
- **Firefox** follows a slightly different approach that balances privacy with convenience. It encrypts the sync data locally on the device using an encryption key derived locally from the user's Firefox account password and sends the encrypted data to Mozilla's servers. The encryption key never leaves the user's device, so the servers cannot decrypt the data.
- **Brave** follows a privacy-first approach which synchronizes the data using encrypted chains. It asks the user to create a sync code (a QR code) on the 'source' device and enter the same code in the 'destination' device - this is the encrypted sync chain. Then the source device encrypts the data and synchronizes it through an end-to-end encrypted channel passing date to Brave's relay servers. These servers cannot read the data because it is encrypted and do NOT store the sync data. Only the user's devices with the proper keys can read the data. So the destination device where the user gave the sync code will download the data, decrypt it locally using the user's private key and update it.
    - Here is one of the PRs in Brave repository that disables the Chrome settings that send user data to Google servers - https://github.com/brave/brave-core/pull/244/files
    - This is the full list of features completely disabled in Brave - https://support.brave.com/hc/en-us/articles/10742158329613-What-does-Brave-remove-from-the-Chromium-engine

## 2.Safe Browsing
This is the feature developed by Google that protects users from malicious users. The server maintains a list of websites that have phishing attempts, malware distribution, deceptive software etc.
- In **Chrome**, when the user visits a website, it sends partial hash of the URL to Google servers and checks against the blacklisted sites and warn the user if it appears in that last.
- **Brave** has replaced this implementation with a privacy-focused version where it downloads the blacklisted domains locally and performs the check locally on the user''s device.
- **Firefox** - similar to Brave, it downloads the list of malicious sites to the devices and checks against the requested URL locally. This list is updated periodically. So the requested URL is not sent to the Firefox servers. 

## 3. Telemetry and usage statistics
Telemetry is the automated collection and sending of data about how the software (in this case the browser) performs, its usage patterns, and technical metrics. Browsers can collect a lot of data about your usage and performance as part of telemetry.
* In **Chrome**, telemetry is enabled by default, with few options to opt-out. Collects data including performance, extensive usage statistics, user interactions, search queries, data about websites visited and location data (if permission granted)
* **Firefox** collect usage statistics like performance, feature usage and user interactions, but is not as extensive as Chrome and offers more granular control to opt-out. More importantly, Mozilla is very transparent about the data that they collect and is well documented in [Mozilla's privacy policy](https://www.mozilla.org/en-US/privacy/firefox/) and [Firefox Telemetry Documentation](https://firefox-source-docs.mozilla.org/toolkit/components/telemetry/) that lists what data it collects, how they use it and how it is stored.
* **Brave** has disabled telemetry by default and uses an opt-in model if the user wants to. It has disabled the Chromium feature of automatic reporting of usage data and crash reports to Google. It uses the [Privacy-Preserving Product Analytics](https://brave.com/blog/privacy-preserving-product-analytics-p3a/) system (also known as P3A system) which anonymizes usage data such that it prevents the user to be individually identifies or tracked. 

## 4. Browser Fingerprinting
This is a tracking technique that collects information about the user's browser configuration to create a unique "fingerprint" that can identify and track the user across websites, even without cookies.
- **Chrome** offers very little built-in protection against fingerprinting. Users have to rely on extensions to prevent it. Interestingly, when I searched for 'fingerprint' in Chrome settings, it showed that there are two results, but when I go into those settings, there is no mention of fingerprint.
- **Firefox** offers *Enhanced Tracking Protection* with three protection levels, of which *Strict* level prevents *known and suspected fingerprinters* in addition to blocking cross-site cookies, tracking content in all windows etc.
- **Brave** enables fingerprinting protection by default. You see the pattern here - privacy-first approach. It can be turned off Settings > Shields. Its protection approach ("privacy through randomization") is considered quite strong among mainstream browsers.

{{< fluid_imgs
  "pure-u-1-1|scr-chrome-fingerprint.png|Fastlane"
  "pure-u-1-2|scr-firefox-fingerprint.png|Fastlane"
  "pure-u-1-3|scr-brave-fingerprint.png|Fastlane"
>}}


In addition to these factors, we need to consider a few things that are not directly related to privacy, but impact the design choices made by the browser vendors and hence are critical for our decision.

## 5. Mobile Browsers
Many of us browse websites on our mobile devices. So we must take that also into consideration. All three browser have similar defaults and tracking protection on mobile as they have on desktop.
- **Chrome for Mobile**: Similar privacy concerns as desktop, with additional permissions for location tracking.
- **Firefox for Mobile**: Offers tracking protection similar to desktop version, supports extensions on Android.
- **Brave for Mobile**: Maintains the same privacy features as desktop, including ad and tracker blocking by default.

## 6. Source code transparency
- **Chrome** is closed source, although it is based on the open-source Chromium browser engine (Blink) with additional proprietary components that aren't open source. 
- **Brave** is also built on Chromium's Blink engine and all their additions and customizations are open source. 
- **Firefox** is built on its own Gecko engine. 

The source code of Firefox and Brave are available at the links below. This code has been reviewed and studied by security experts and independent researchers.
- [Gecko repository](https://github.com/mozilla/gecko-dev)
- [Brave core repository](https://github.com/brave/brave-core)
- [Chromium Git repository](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/third_party/blink/)

## 7. Business Model
The business model of the browser directly influences its privacy practices. When a company's revenue depends on collecting and selling user data, there is an inherent conflict of interest with privacy protection.
- **Google Chrome**: Google's primary revenue comes from advertising, which relies on collecting user data. So privacy protections are often secondary to their financial interests.
- **Firefox**: Mozilla is a non-profit organization funded primarily through partnerships with search engines. While this includes Google, Mozilla has demonstrated commitment to privacy as part of its mission.
- **Brave**: Operates on a unique model with Brave Rewards, allowing users to opt into privacy-respecting ads and earn BAT tokens. This creates a business model aligned with privacy interests rather than opposing them.

## Conclusion
Brave and Firefox offer strong privacy features, with Brave taking a more aggressive approach out of the box while Firefox offers more customization options. 

So here is how I see it based on what the user wants:
- For users who want maximum **privacy with minimal configuration**: **Brave**
- For users who want a **customizable privacy** experience: **Firefox** with privacy tweaks
- For users **transitioning from Chrome** who want better privacy: Start with **Firefox**, then consider Brave
- For users who need both strong privacy and Chrome compatibility (eg: extensions from Chrome Web Store): **Brave** is the ideal choice.

My decision is to go all in with Brave with all the default settings for maximum privacy. I will also set up Firefox with the strictest privacy settings so that I can keep it as a backup browser for sites that might have compatibility issues with Brave. All other browsers will be gone from my machine!