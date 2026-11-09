**RoadVet: Android Build and API Deployment Report**

Date: 2026-11-09

Scope: what this project needs for an Android build, and how to deploy the Django API so the build can reach it. The goal is a demo APK installed on devices directly. Security is not a priority yet, and the app will not go to the Play Store for now.

**1. Current state of the project**

| Item | Finding | Where |
|---|---|---|
| Stack | Expo SDK 57, React Native 0.86.2, Expo Router, New Architecture on, Hermes on | `package.json`, `android/gradle.properties` |
| Android package | `com.roadvet.app` | `app.json` |
| Native folder | `/android` exists locally but is gitignored (Continuous Native Generation) | `.gitignore` |
| API URL | Read from `EXPO_PUBLIC_API_URL`, inlined into the bundle at build time | `src/services/api/client.ts:21` |
| Current `.env` value | Uses `http://`, not `https://` | `.env` (gitignored) |
| Cleartext HTTP | Allowed only in the `debug` and `debugOptimized` manifests, blocked in release | `android/app/src/debug/AndroidManifest.xml`, `android/app/src/debugOptimized/AndroidManifest.xml` |
| Release signing | Uses the debug keystore | `android/app/build.gradle:115` |
| versionCode | Not set in `app.json` | `app.json` |
| Local database | WatermelonDB 0.28 via `@morrowdigital/watermelondb-expo-plugin` with `disableJsi: true` | `app.json` |
| Build tooling on this machine | No Java, no Android SDK, no `eas` CLI, no `eas.json` | |

Backend (`../RoadVet-BackEnd`):

| Item | Finding |
|---|---|
| Framework | Django 6.0.4, DRF, SimpleJWT, django-cors-headers |
| Database | SQLite (`db.sqlite3`) |
| File storage | Local `media/` folder, served by Django only when `DEBUG = True` |
| `DEBUG` | `True` |
| `ALLOWED_HOSTS` | Includes `'*'` |
| Secret key | Read from the `SK` environment variable |
| Production server | None (no gunicorn in `requirements.txt`) |

The Django plan document (`PLANO_BACKEND_DJANGO.md`) calls for PostgreSQL and S3 storage. The current backend uses neither, and it doesn't need them for a demo.

**2. Points to consider for any Android build**

1. **API URL is fixed at build time.** Whatever `EXPO_PUBLIC_API_URL` holds when the bundle is built is what the APK uses. It must be reachable from a real phone, so `localhost` and `10.0.2.2` will not work. Changing it requires a new build.
2. **Cleartext HTTP is blocked in release builds.** With an `http://` URL, every login and sync request fails silently in a release APK. Fix it either by using an HTTPS URL or by enabling cleartext (see section 4).
3. **`.env` is gitignored.** EAS Build does not receive it. The variable must be set in the EAS profile `env` in `eas.json` or as an EAS environment variable.
4. **`/android` is generated.** Native changes go in `app.json` or config plugins. EAS regenerates the folder on every build. Locally, run `npx expo prebuild --clean` after changing the config.
5. **WatermelonDB is the main native risk.** Version 0.28 with JSI disabled, on RN 0.86 with the New Architecture, plus R8 minification in release builds. Test the database and sync on a real device with a release build. Debug working does not prove release works.
6. **`expo-dev-client`** only affects debug builds, so it does not get in the way of a release APK.

**3. Signing, versioning and output format**

| Topic | For the demo (now) | For the Play Store (later) |
|---|---|---|
| Output | APK, installed directly | AAB |
| Signing | Debug keystore is enough | Real upload keystore, managed by EAS or kept locally and backed up (`*.jks` is already gitignored) |
| versionCode | Not needed | Must increase on every upload; use `"appVersionSource": "remote"` and `autoIncrement` in EAS |

**4. API deployment options**

| Option | Cost | HTTPS | PC must stay on | Backend changes | Notes |
|---|---|---|---|---|---|
| ngrok with free static domain | Free | Yes | Yes | None | Recommended for demos run from your own laptop |
| PythonAnywhere free tier | Free | Yes | No | Small (WSGI file, `SK` variable, `/media/` mapping) | Recommended if the app must work with your laptop off; persistent disk suits SQLite and `media/`; free accounts need manual renewal every few months |
| LAN IP over HTTP | Free | No | Yes, same Wi-Fi | None | Requires cleartext enabled in the app |
| Small VPS (Hetzner, DigitalOcean) | About US$4-6/month | No, unless a domain is added | No | Server setup | Requires cleartext if used over HTTP |
| Render or Railway | Free or cheap | Yes | No | Some | SQLite and `media/` are wiped on restart or redeploy, a poor fit for this backend |
| Cloudflare quick tunnel | Free | Yes | Yes | None | Not suitable: the URL changes on every run, which forces a rebuild each time |

Both recommended options use HTTPS, so the app needs no cleartext configuration. Here HTTPS is less work than plain HTTP.

**5. Setup steps for the recommended options**

ngrok:

1. Create a free ngrok account and claim the static domain in the dashboard.
2. Run `ngrok config add-authtoken <token>`.
3. Start Django: `python manage.py runserver 0.0.0.0:8000`.
4. In another terminal: `ngrok http --url=<your-domain>.ngrok-free.app 8000`.
5. Set `EXPO_PUBLIC_API_URL=https://<your-domain>.ngrok-free.app/api`.
6. Check that the app's requests are not stopped by the warning page ngrok's free plan shows browsers. App requests don't send a browser user agent, so this is not expected, but confirm it once.

PythonAnywhere:

1. Upload the backend repository.
2. Create a virtualenv and install `requirements.txt`.
3. Point the WSGI file at `setup.wsgi`.
4. Set the `SK` environment variable.
5. Map `/media/` to the backend's `media` folder in the Web tab.
6. Set `EXPO_PUBLIC_API_URL=https://<username>.pythonanywhere.com/api`.

**6. If plain HTTP is used**

1. Run `npx expo install expo-build-properties`.
2. Add this to `plugins` in `app.json`: `["expo-build-properties", { "android": { "usesCleartextTraffic": true } }]`.
3. Run `npx expo prebuild --clean` before building locally.

**7. Building the demo APK**

| Path | Steps | Requirements |
|---|---|---|
| EAS Build (cloud) | `npm i -g eas-cli`, `eas login`, `eas init`, `eas build:configure`; create a `preview` profile with `"buildType": "apk"` and `EXPO_PUBLIC_API_URL` in its `env`; run `eas build -p android --profile preview` | Expo account |
| Local build | Update `.env`, then run `npx expo run:android --variant release` | JDK and Android SDK installed, `ANDROID_HOME` set; confirm the versions required by SDK 57 in the Expo docs |

**8. Recommended order**

1. Pick ngrok or PythonAnywhere and get the API online over HTTPS.
2. Set `EXPO_PUBLIC_API_URL` to that URL in the build environment.
3. Build a `preview` APK.
4. On a real phone, test registration, login, sync, attachment upload and avatar upload.
5. Leave the keystore, versionCode and AAB for when the Play Store becomes a goal.
