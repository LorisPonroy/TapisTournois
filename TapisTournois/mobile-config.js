App.info({
    id: 'fr.lorisponroy.tapistournois',
    name: 'TapisTournois',
    version: "2"
});

App.icons({
    'android_xxhdpi': 'public/images/logo_tapis.png',
});

App.launchScreens({
    'android_mdpi_portrait': 'public/images/logo_tapis.png',
});

App.setPreference('BackgroundColor', '0xff0000ff');
App.setPreference('HideKeyboardFormAccessoryBar', true);
App.setPreference('Orientation', 'default');
App.setPreference('Orientation', 'all', 'ios');

App.setPreference('android-targetSdkVersion', '31');
App.setPreference('android-minSdkVersion', '31');

App.appendToConfig(`
  <universal-links>
    <host name="http://192.168.0.66" />
  </universal-links>
`);

App.appendToConfig(
    `<edit-config file="app/src/main/AndroidManifest.xml" mode="merge" target="/manifest/application/activity" xmlns:android="http://schemas.android.com/apk/res/android">
        <activity android:exported="true"></activity>
    </edit-config>`
);