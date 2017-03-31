VideoPlayer
===========

Video Player Plugin for Cordova 3.3+ Android

Based on https://github.com/dawsonloudon/VideoPlayer by Dawson Loudon

The only difference with Dawson Loudon plugin is the npm package which makes it possible to use this plugin with PhoneGap Build service.

Installation
===========

For Cordova CLI -
`cordova plugin add https://github.com/dawsonloudon/VideoPlayer.git`

For PhoneGap Build -
Add `<gap:plugin name="com.dawsonloudon.videoplayer" version="1.0.0" />` to config.xml

Usages
===========

- VideoPlayer.play("http://path.to.my/video.mp4");
- VideoPlayer.play("file:///path/to/my/video.mp4");
- VideoPlayer.play("file:///android_asset/www/path/to/my/video.mp4");
- VideoPlayer.play("https://www.youtube.com/watch?v=en_sVVjWFKk");
